import {
    ChangeDetectionStrategy,
    Injector,
    ChangeDetectorRef,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    OnDestroy,
    Renderer2,
    AfterViewInit,
} from '@angular/core';
import { fromJS } from 'immutable';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { NgRedux, select } from '@angular-redux/store';
import { clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight } from '@setl/core-store/highlight/actions';
import { SET_USERTOUR_INPROGRESS } from '@setl/core-store/usertour/inprogress/actions';
import { SET_USER_TOURS } from '@setl/core-store/usertour/usertour/actions';
import { Router } from '@angular/router';

import { UserTourService } from '@setl/core-req-services/usertour/service';

@Directive({
    selector: '[tooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy, AfterViewInit {

    private el: any;
    @Input('tooltip') config: any;
    clonedConfig: any = [];
    divTooltip: any;
    divTooltipTitle: any;
    divTooltipTimer: any;
    divTooltipText: any;
    divTooltipCloseBtn: any;
    divBackgroundTour: any;
    btnContainer: any;
    btnBack: any;
    btnNext: any;
    btnDone: any;   // when finished
    btnClose: any;  // to close usertour before end
    arrowSize = 10; // arrow size
    scrollTop = 0;
    scrollListener = null;
    parentDiv: any;
    pCases = [0, 0, 0, 0]; // top - right - bottom - left
    tourConfig = [];
    step = 0;
    autoNextTimeout: any;
    tourDuration = 8000; // default 8s
    isAutoNext = true;
    isTour = false;

    connectedWalletId = 0;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    userTourDatas = [];
    userTourInProgress = false;
    userTourName = '';

    UserTourService: any;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['usertour', 'inProgress', 'inProgress']) inProgressOb;
    @select(['usertour', 'userTours', 'userToursRequested']) userToursRequestedOb;
    @select(['usertour', 'userTours', 'userTours']) userToursOb;

    constructor(
        private _el: ElementRef,
        private renderer: Renderer2,
        private _ngRedux: NgRedux<any>,
        private _router: Router,
        private _translate: MultilingualService,
        private injector: Injector,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.el = this._el.nativeElement;

        this.parentDiv = document.getElementsByClassName('content-area')[0];
        if (!this.parentDiv) {
            this.parentDiv = document.getElementsByClassName('router-container')[0];
        }
    }

    ngOnInit() {
        this.cloneConfig();

        // force overflow hidden to prevent scroll outside website
        document.body.style.overflow = 'hidden';

        if (this.clonedConfig.length > 1) {
            this.isTour = true;
            this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
                this.connectedWalletId = connected;
            }));
            this.subscriptionsArray.push(this.inProgressOb.subscribe(inProgress => {
                this.userTourInProgress = inProgress;
            }));
            if (this.clonedConfig[0]) {
                if (this.clonedConfig[0].usertourName) {
                    this.userTourName = this.clonedConfig[0].usertourName;
                }
            }
            if (this.userTourName !== '') {
                this.subscriptionsArray.push(this.userToursRequestedOb.subscribe(userToursRequested => this.requestUserTours(userToursRequested)));
                this.subscriptionsArray.push(this.userToursOb.subscribe(userTours => this.getUserTours(userTours)));
            }
        } else {
            this.renderer.setStyle(this.el, 'cursor', 'pointer');
        }
        this.autoshowTooltip();
    }

    ngAfterViewInit() {
        if (this.clonedConfig.autoshow !== undefined && this.clonedConfig.autoshow === true) {
            this.moveTooltip();
        }
    }

    @HostListener('click') onClick(): void {
        if (this.clonedConfig.transform === undefined) {
            if (this.divTooltip !== null && this.divTooltip !== undefined) {
                this.hideTooltip();
            }
            this.clonedConfig.autoshow = !this.clonedConfig.autoshow;
            setTimeout(() => {
                this.autoshowTooltip();
            },         350);
        }
    }

    @HostListener('mouseenter') onMouseEnter(): void {
        this.checkIfTooltipExists();
        if (this.parentDiv) {
            this.scrollListener = this.parentDiv.addEventListener('scroll', (event) => {
                this.getScroll(event);
            },                                                    false);
            this.scrollTop = this.parentDiv.scrollTop;
        }
        if (this.clonedConfig.autoshow === undefined || this.clonedConfig.autoshow === false) {
            this.showTooltip();
        }
    }

    @HostListener('mouseover') onMouseOver(): void {
        this.checkIfTooltipExists();
        if (this.clonedConfig.autoshow === undefined || this.clonedConfig.autoshow === false) {
            this.showTooltip();
        }
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
        if (this.clonedConfig.autoshow === undefined || this.clonedConfig.autoshow === false) {
            if (this.el === event.target) {
                this.checkIfTooltipExists();
                this.moveTooltip();
            }
        }
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        if (this.clonedConfig.autoshow === undefined || this.clonedConfig.autoshow === false) {
            this.hideTooltip();
        }
    }

    @HostListener('window:resize') onWindowResize(): void {
        this.checkIfTooltipExists();
        this.moveTooltip();
    }

    cloneConfig() {
        // reset
        this.clonedConfig = [];
        this.tourConfig = [];
        // clone
        if (this.config.length > 1) {
            for (const conf of this.config) {
                this.clonedConfig.push(_.clone(conf));
            }
        } else {
            this.clonedConfig = _.clone(this.config);
        }
    }

    requestUserTours(req) {
        // this.cloneConfig();
        if (!req) {
            if (this.userTourName !== '') {
                const payload = {
                    walletid: this.connectedWalletId,
                    type: this.userTourName,
                };
                UserTourService.defaultRequestUserTours(this.UserTourService, this._ngRedux, payload);
            }
        }
    }

    getUserTours(userTours) {
        // this.cloneConfig();
        if (userTours) {
            const listImu = fromJS(userTours);
            this.userTourDatas = listImu.reduce((result, item) => {
                result.push({
                    type: item.type,
                    value: item.value,
                    walletID: item.walletID,
                });
                return result;
            },                                  []);

            if (this.userTourName !== '') {
                if (this.userTourDatas.length === 0 && !this.userTourInProgress) {
                    this.initTour();
                } else {
                    if (this.userTourDatas[0]) {
                        if (this.userTourDatas[0].value !== '') {
                            if (this.userTourDatas[0].value === '0' && !this.userTourInProgress) {
                                this.initTour();
                            }
                        }
                    }
                }
            }
        }

        this._changeDetectorRef.markForCheck();
    }

    saveUserTour() {
        if (this.userTourName !== '') {
            const asyncTaskPipe = this.UserTourService.saveUserTour({
                type: this.userTourName,
                value: 1,
                walletid: this.connectedWalletId,
            });

            this._ngRedux.dispatch({
                type: 'RUN_ASYNC_TASK',
                successTypes: (data) => {},
                failureTypes: (data) => {},
                descriptor: asyncTaskPipe,
                args: {},
                successCallback: (response) => {
                    UserTourService.setRequestedUserTours(false, this._ngRedux);
                },
                failureCallback: (response) => {
                    console.log('UserTour save error: ', response);
                },
            });
        }
    }

    initTour() {
        this._ngRedux.dispatch({ type: SET_USERTOUR_INPROGRESS, data: true });

        // add black bglayer
        this.divBackgroundTour = document.createElement('div');
        this.divBackgroundTour.style.position = 'absolute';
        this.divBackgroundTour.style.left = '0';
        this.divBackgroundTour.style.top = '0';
        this.divBackgroundTour.style.backgroundColor = 'rgba(0,0,0,0.6)';
        this.divBackgroundTour.style.width = '100%';
        this.divBackgroundTour.style.zIndex = 1101;
        const pageSize = this.getPageSize();
        this.divBackgroundTour.style.height = pageSize.height + 'px';
        document.body.appendChild(this.divBackgroundTour);

        for (const conf of this.clonedConfig) {
            this.tourConfig.push(_.clone(conf));
        }
        this.setConfig(this.step);
        this.autoshowTooltip();
    }

    autoshowTooltip() {
        if (this.clonedConfig.autoshow !== undefined && this.clonedConfig.autoshow === true) {
            this.isAutoNext = true;
            this.checkIfTooltipExists();
            if (this.parentDiv) {
                this.parentDiv.addEventListener('scroll', (event) => {
                    this.getScroll(event);
                },                              false);
                this.scrollTop = this.parentDiv.scrollTop;
            }
            this.showTooltip();
            this._ngRedux.dispatch({ type: SET_HIGHLIGHT_LIST, data: [{ id: this.clonedConfig.target }] });
            this._ngRedux.dispatch(setAppliedHighlight());
        }
    }

    checkIfTooltipExists() {
        if (this.divTooltip === null || this.divTooltip === undefined) {
            const isTitle = (this.clonedConfig.title !== undefined && this.clonedConfig.title !== '');
            this.divTooltip = document.createElement('div');
            this.divTooltip.className = 'tooltips';
            const randomID = this.generateID(50);
            this.divTooltip.id = 'tooltip_' + randomID;
            let addCloseButton = '';
            if (!this.isTour) {
                addCloseButton = '<i class="fa fa-times tooltipCloseBtnTitle" id="tooltipCloseBtn_' + randomID + '"></i>';
            }
            // add default title
            if (isTitle) {
                this.divTooltip.innerHTML = '<div id="tooltipTitle_' + randomID + '" class="title"></div>';
            }
            // if autoshow
            if (this.clonedConfig.autoshow !== undefined && this.clonedConfig.autoshow === true) {
                // if title
                if (isTitle) {
                    this.divTooltip.innerHTML = '<div id="tooltipTitle_' + randomID + '" class="title">' + addCloseButton + '</div>';
                }
            }
            let tmpInnerHTML = '';
            // add timer bar
            if (this.isTour) {
                // add timer div
                tmpInnerHTML += '<div id="tooltipTimer_' + randomID + '" class="tooltipTimer"></div>';
            }
            // add default text
            tmpInnerHTML += '<div id="tooltipText_' + randomID + '" class="text"></div>';
            if (this.clonedConfig.autoshow !== undefined && this.clonedConfig.autoshow === true) {
                // if title
                if (!isTitle) {
                    // change button if no title
                    addCloseButton = '<i class="fa fa-times tooltipCloseBtnText" id="tooltipCloseBtn_' + randomID + '"></i>';
                    tmpInnerHTML = '<div id="tooltipText_' + randomID + '" class="text">' + addCloseButton + '</div>';
                }
            }
            this.divTooltip.innerHTML += tmpInnerHTML;
            document.body.appendChild(this.divTooltip);
            // assign
            if (isTitle) {
                this.divTooltipTitle = document.getElementById('tooltipTitle_' + randomID);
            }
            this.divTooltipText = document.getElementById('tooltipText_' + randomID);

            this.divTooltipTimer = document.getElementById('tooltipTimer_' + randomID);
            if (this.divTooltipTimer && this.isTour) {
                this.divTooltipTimer.style.transition = 'width ' + (this.clonedConfig.duration / 1000) + 's linear';
            }

            this.divTooltipCloseBtn = document.getElementById('tooltipCloseBtn_' + randomID);
            // add click function
            if (this.divTooltip && !this.isTour) {
                this.divTooltip.onclick = (event) => {
                    if (event.target.id === 'tooltipCloseBtn_' + randomID) {
                        this.clonedConfig.autoshow = false;
                        this.hideTooltip();
                    }
                };
            }
            // add title + text
            let tourNum = '';
            if (this.isTour) {
                // add step into Title
                tourNum = (this.step + 1) + '/' + this.tourConfig.length + '. ';
            }
            if (isTitle) {
                this.divTooltipTitle.innerHTML += tourNum + this.clonedConfig.title;
            }
            this.divTooltipText.innerHTML += this.clonedConfig.text;

            // reset css
            this.divTooltip.className = 'tooltips';

            // size rules
            if (!this.clonedConfig.size) {
                if (!isTitle && this.clonedConfig.text.length <= 50) {
                    this.divTooltip.classList.add('t-small');
                } else {
                    this.divTooltip.classList.add('t-medium');
                }
            } else {
                if (this.clonedConfig.size === 'small') {
                    if (this.clonedConfig.text.length > 50) { // small no max-width
                        this.divTooltip.classList.add('t-medium'); // force max-width
                    } else {
                        this.divTooltip.classList.add('t-' + this.clonedConfig.size);
                    }
                } else {
                    // force small if no title & <50 chars
                    if (!isTitle) {
                        if (this.clonedConfig.text.length <= 50) {
                            this.divTooltip.classList.add('t-small');
                        } else {
                            this.divTooltip.classList.add('t-medium');
                        }
                    } else {
                        this.divTooltip.classList.add('t-' + this.clonedConfig.size);
                    }
                }
            }

            if (this.isTour) {
                this.divTooltip.style.zIndex = 1102;

                // add button back/next
                this.btnContainer = document.createElement('div');
                this.btnContainer.className = 'btnTourContainer';
                this.btnContainer.innerHTML = '<hr>';
                this.divTooltipText.appendChild(this.btnContainer);
                if (this.step > 0) {
                    this.btnBack = document.createElement('button');
                    this.btnBack.id = 'btnTourBack_' + randomID;
                    this.btnBack.className = 'btn btn-sm btn-success';
                    this.btnBack.innerHTML = this._translate.translate('Back');
                    this.btnBack.onclick = (event) => {
                        if (event.target.id === 'btnTourBack_' + randomID) {
                            this._ngRedux.dispatch(clearAppliedHighlight());
                            clearTimeout(this.autoNextTimeout);
                            this.isAutoNext = false;
                            this.prevStep();
                        }
                    };
                    this.btnContainer.appendChild(this.btnBack);
                }
                let hasRedirect = false;
                if (this.clonedConfig.redirect !== undefined && this.clonedConfig.redirect !== '') {
                    hasRedirect = true;
                }
                if ((this.step) < (this.tourConfig.length - 1) || hasRedirect) {
                    this.btnNext = document.createElement('button');
                    this.btnNext.id = 'btnTourNext_' + randomID;
                    this.btnNext.className = 'btn btn-sm btn-success';
                    this.btnNext.innerHTML = this._translate.translate('Next');
                    this.btnNext.onclick = (event) => {
                        if (event.target.id === 'btnTourNext_' + randomID) {
                            if (hasRedirect) {
                                // do same thing Done button + redirect
                                this._ngRedux.dispatch(clearAppliedHighlight());
                                clearTimeout(this.autoNextTimeout);
                                this.isAutoNext = false;
                                this.step += 1;
                                this.hideTooltip();
                                this.divBackgroundTour.remove();
                                this._router.navigate([this.clonedConfig.redirect]);
                            } else {
                                this._ngRedux.dispatch(clearAppliedHighlight());
                                clearTimeout(this.autoNextTimeout);
                                this.isAutoNext = false;
                                this.nextStep();
                            }
                        }
                    };
                    this.btnContainer.appendChild(this.btnNext);

                    // add button close usertour
                    this.btnClose = document.createElement('button');
                    this.btnClose.id = 'btnTourClose_' + randomID;
                    this.btnClose.className = 'btn btn-sm btn-success';
                    this.btnClose.innerHTML = this._translate.translate('Close');
                    this.btnClose.onclick = (event) => {
                        if (event.target.id === 'btnTourClose_' + randomID) {
                            // this._ngRedux.dispatch(clearAppliedHighlight());
                            // clearTimeout(this.autoNextTimeout);
                            // this.isAutoNext = false;
                            // this.step = this.tourConfig.length;
                            // this.hideTooltip();
                            // this.divBackgroundTour.remove();
                            this.cleanAll(true);
                        }
                    };
                    this.btnContainer.appendChild(this.btnClose);
                } else {
                    this.btnDone = document.createElement('button');
                    this.btnDone.id = 'btnTourDone_' + randomID;
                    this.btnDone.className = 'btn btn-sm btn-success';
                    this.btnDone.innerHTML = this._translate.translate('Done');
                    this.btnDone.onclick = (event) => {
                        if (event.target.id === 'btnTourDone_' + randomID) {
                            // this._ngRedux.dispatch(clearAppliedHighlight());
                            // clearTimeout(this.autoNextTimeout);
                            // this.isAutoNext = false;
                            // this.step += 1;
                            // this.hideTooltip();
                            // this.divBackgroundTour.remove();
                            this.cleanAll(true);
                        }
                    };
                    this.btnContainer.appendChild(this.btnDone);
                }
            }

            // if tour launch timer
            if (this.isTour && this.isAutoNext) {
                this.autoNextTimeout = setTimeout(() => {
                    if ((this.step) < (this.tourConfig.length - 1)) {
                        this._ngRedux.dispatch(clearAppliedHighlight());
                        this.nextStep();
                    } else {
                        // this._ngRedux.dispatch(clearAppliedHighlight());
                        // clearTimeout(this.autoNextTimeout);
                        // this.isAutoNext = false;
                        // this.step += 1;
                        // this.hideTooltip();
                        // this.divBackgroundTour.remove();
                        this.cleanAll(true);
                        if (this.clonedConfig.redirect !== undefined && this.clonedConfig.redirect !== '') {
                            this._router.navigate([this.clonedConfig.redirect]);
                        }
                    }
                },                                this.clonedConfig.duration);
            }
        }
    }

    showTooltip(): void {
        if (this.divTooltip !== null && this.divTooltip !== undefined) {

            this.moveTooltip();

            setTimeout(() => {
                if (this.divTooltip !== null && this.divTooltip !== undefined) {
                    this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, 0, 0)');
                    this.renderer.setStyle(this.divTooltip, 'opacity', '1');
                    if (this.isTour) {
                        this.renderer.setStyle(this.divTooltipTimer, 'width', '100%');
                    }
                }
            },         50);
        }
    }

    moveTooltip(): void {
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            this.scrollTop = this.parentDiv.scrollTop;

            // reset array
            this.pCases = [0, 0, 0, 0];

            // default direction
            this.applyArrowClass('tooltips-bottom');

            this.el = (this.isTour) ? document.getElementById(this.clonedConfig.target) : this.el;
            if (this.el) {
                const elRect = this.el.getBoundingClientRect();

                const isChildContainer = this.isChild(this.parentDiv, this.el);
                const elPosition = window.getComputedStyle(this.el, null).getPropertyValue('position');
                if (!isChildContainer) {
                    this.scrollTop = 0;
                } else if (elPosition === 'absolute') {
                    this.scrollTop = 0;
                }

                // tooltip position
                let newTop: any = Number(this.getOffset(this.el).top - this.divTooltip.offsetHeight - this.arrowSize - this.scrollTop);
                let newLeft: any = Number((elRect.left + (this.el.offsetWidth / 2)) - (this.divTooltip.offsetWidth / 2));

                // check if tooltip is in screen
                const pageSize = this.getPageSize();
                // too high
                if (newTop < 0) {
                    this.pCases[0] = 1;
                }
                // too low
                if (Number(newTop + this.divTooltip.offsetHeight) > pageSize.height) {
                    this.pCases[2] = 1;
                }
                // too left
                if (newLeft < 0) {
                    this.pCases[3] = 1;
                }
                // too right
                if (Number(newLeft + this.divTooltip.offsetWidth) > pageSize.width) {
                    this.pCases[1] = 1;
                }

                const strPCases = this.pCases.join();
                // console.log(strPCases);
                switch (strPCases) {
                case '0,0,0,1': // middle left
                    // tooltip position
                    newLeft = Number(this.getOffset(this.el).left + this.el.offsetWidth + this.arrowSize);
                    newTop = Number((this.getOffset(this.el).top - this.scrollTop) + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                    if (Number(newTop + this.divTooltip.offsetHeight) >= pageSize.height) {
                        newTop = Number(pageSize.height - this.arrowSize - this.divTooltip.offsetHeight);
                        const posYTooltip = newTop;
                        const posYMiddleEl = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2));
                        const tooltipSize = this.divTooltip.offsetHeight;
                        const percent = (posYMiddleEl - posYTooltip) / tooltipSize * 100;
                        // change arrow direction
                        this.applyArrowClass('tooltips-left');
                        // move arrow position
                        let roundPercent = (5 * Math.round(percent / 5));
                        roundPercent = (roundPercent > 95) ? 95 : roundPercent;
                        roundPercent = (roundPercent < 5) ? 5 : roundPercent;
                        this.divTooltip.classList.add('tooltips-left' + roundPercent);
                    } else {
                        // change arrow direction
                        this.applyArrowClass('tooltips-left');
                    }
                    break;
                case '0,1,0,0': // middle right
                    // tooltip position
                    newLeft = Number(this.getOffset(this.el).left - this.arrowSize - this.divTooltip.offsetWidth);
                    newTop = Number((this.getOffset(this.el).top - this.scrollTop) + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                    this.applyArrowClass('tooltips-right');
                    break;
                case '1,0,0,1': // corner top-left
                    newLeft = Number(this.getOffset(this.el).left + this.el.offsetWidth + this.arrowSize);
                    newTop = Number((this.getOffset(this.el).top - this.scrollTop) + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                    this.applyArrowClass('tooltips-left');
                    // if (Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2)) <= 0) {
                    //     newTop = this.arrowSize;
                    //     const posYTooltip = newTop;
                    //     const posYMiddleEl = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2));
                    //     const tooltipSize = this.divTooltip.offsetHeight;
                    //     const percent = (posYMiddleEl - posYTooltip) / tooltipSize * 100;
                    //     // change arrow direction
                    //     this.applyArrowClass('tooltips-left');
                    //     // move arrow position
                    //     let roundPercent = (5 * Math.round(percent / 5));
                    //     roundPercent = (roundPercent > 95) ? 95 : roundPercent;
                    //     roundPercent = (roundPercent < 5) ? 5 : roundPercent;
                    //     this.divTooltip.classList.add('tooltips-left' + roundPercent);
                    // } else {
                    //     // change arrow direction
                    //     this.applyArrowClass('tooltips-left');
                    // }
                    break;
                case '1,1,0,0': // corner top-right
                    newLeft = Number(this.getOffset(this.el).left - this.arrowSize - this.divTooltip.offsetWidth);
                    newTop = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2) - this.scrollTop);
                    this.applyArrowClass('tooltips-right');
                    // if (Number((this.getOffset(this.el).top - this.scrollTop) + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2)) <= 0) {
                    //     newTop = this.arrowSize;
                    //     const posYTooltip = newTop;
                    //     const posYMiddleEl = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2));
                    //     const tooltipSize = this.divTooltip.offsetHeight;
                    //     const percent = (posYMiddleEl - posYTooltip) / tooltipSize * 100;
                    //     // change arrow direction
                    //     this.applyArrowClass('tooltips-right');
                    //     // move arrow position
                    //     let roundPercent = (5 * Math.round(percent / 5));
                    //     roundPercent = (roundPercent > 95) ? 95 : roundPercent;
                    //     roundPercent = (roundPercent < 5) ? 5 : roundPercent;
                    //     this.divTooltip.classList.add('tooltips-left' + roundPercent);
                    //     this.divTooltip.classList.add('tooltips-right' + roundPercent);
                    // } else {
                    //     // change arrow direction
                    //     this.applyArrowClass('tooltips-right');
                    // }
                    break;
                case '1,0,0,0': // middle top
                    newTop = Number(this.getOffset(this.el).top + this.el.offsetHeight + this.arrowSize - this.scrollTop);
                    // change arrow direction
                    this.applyArrowClass('tooltips-top');
                    if (this.clonedConfig.title === undefined || this.clonedConfig.title === '') {
                        this.divTooltip.classList.add('tooltips-top-text');
                    }
                    break;
                case '0,1,1,0': // corner bottom right
                    newLeft = Number(this.getOffset(this.el).left - this.arrowSize - this.divTooltip.offsetWidth);
                    newTop = Number((this.getOffset(this.el).top - this.scrollTop) + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                case '0,0,1,1': // corner bottom left
                    newLeft = Number(this.getOffset(this.el).left + this.el.offsetWidth + this.arrowSize);
                    newTop = Number((this.getOffset(this.el).top - this.scrollTop) + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                }

                // calcul decal from previous position - first time decal = new
                let decalTop = (this.divTooltip.style.top !== '') ? parseInt(newTop) - parseInt(this.divTooltip.style.top) : newTop;
                decalTop = (decalTop < 0) ? decalTop * -1 : decalTop;
                let decalLeft = (this.divTooltip.style.top !== '') ? parseInt(newLeft) - parseInt(this.divTooltip.style.left) : newLeft;
                decalLeft = (decalLeft < 0) ? decalLeft * -1 : decalLeft;

                // hide only scrollable tooltips
                if (this.clonedConfig.autoshow !== undefined && this.clonedConfig.autoshow === true && isChildContainer && elPosition !== 'absolute' && this.clonedConfig.target === undefined) {
                    const topBarSizeHeight = 75;
                    const arrowSize = (this.divTooltip.classList.contains('tooltips-left') || this.divTooltip.classList.contains('tooltips-right')) ? 0 : (this.arrowSize * 2);
                    const tooltipSize = (this.divTooltip.classList.contains('tooltips-left') || this.divTooltip.classList.contains('tooltips-right')) ? ((this.getOffset(this.el).top - (this.getOffset(this.el).top + (this.el.offsetWidth / 2) - (this.divTooltip.offsetHeight / 2)))) : this.divTooltip.offsetHeight;
                    // console.log('-------------------------------------------------------------------');
                    // console.log('this.getOffset(this.el).top', this.getOffset(this.el).top);
                    // console.log('this.scrollTop', this.scrollTop);
                    // console.log('topBarSizeHeight', topBarSizeHeight);
                    // console.log('this.divTooltip.offsetHeight', this.divTooltip.offsetHeight);
                    // console.log('arrowSize', arrowSize);
                    // console.log('newTop', newTop);
                    // console.log('this.divTooltip.offsetTop', this.divTooltip.offsetTop);
                    // console.log('this.getOffset(this.divTooltip).top', this.getOffset(this.divTooltip).top);
                    // console.log('calcul', (this.getOffset(this.el).top - this.scrollTop - topBarSizeHeight - tooltipSize - arrowSize));
                    // console.log('-------------------------------------------------------------------');
                    if ((this.getOffset(this.el).top - this.scrollTop - topBarSizeHeight - tooltipSize - arrowSize) <= 1) {
                        // hide
                        decalTop = 0; // stop moving
                        this.hideTooltip();
                    } else {
                        // show
                        if (this.divTooltip !== null && this.divTooltip !== undefined) {
                            this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, 0, 0)');
                            this.renderer.setStyle(this.divTooltip, 'opacity', '1');
                            this.renderer.setStyle(this.divTooltip, 'pointer-events', 'all');
                        }
                    }

                }

                // apply modification only if decal >= 1
                if (decalTop >= 1 || this.divTooltip.style.top === '') this.divTooltip.style.top = newTop + 'px';
                if (decalLeft >= 1 || this.divTooltip.style.left === '') this.divTooltip.style.left = newLeft + 'px';

                if (this.isTour) {
                    this.scrollToElement();
                }
            } else {
                if ((this.step) < (this.tourConfig.length - 1)) {
                    let hasRedirect = false;
                    if (this.clonedConfig.redirect !== undefined && this.clonedConfig.redirect !== '') {
                        hasRedirect = true;
                    }
                    if (hasRedirect) {
                        // do same thing Done button + redirect
                        this._ngRedux.dispatch(clearAppliedHighlight());
                        clearTimeout(this.autoNextTimeout);
                        this.isAutoNext = false;
                        this.step += 1;
                        this.hideTooltip();
                        this.divBackgroundTour.remove();
                        this._router.navigate([this.clonedConfig.redirect]);
                    } else {
                        this._ngRedux.dispatch(clearAppliedHighlight());
                        clearTimeout(this.autoNextTimeout);
                        this.isAutoNext = false;
                        this.nextStep();
                    }
                } else {
                    this.cleanAll(true);
                    if (this.clonedConfig.redirect !== undefined && this.clonedConfig.redirect !== '') {
                        this._router.navigate([this.clonedConfig.redirect]);
                    }
                }
            }
        }
    }

    applyArrowClass(className): void {
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            if (className !== 'tooltips-top') {
                if (this.divTooltip.classList.contains('tooltips-top')) this.divTooltip.classList.remove('tooltips-top');
                if (this.divTooltip.classList.contains('tooltips-top-text')) this.divTooltip.classList.remove('tooltips-top-text');
            } else {
                this.divTooltip.classList.add('tooltips-top');
                for (let i = 0; i <= 100; i += 5) {
                    if (this.divTooltip.classList.contains('tooltips-top' + i)) this.divTooltip.classList.remove('tooltips-top' + i);
                }
            }
            if (className !== 'tooltips-left') {
                if (this.divTooltip.classList.contains('tooltips-left')) this.divTooltip.classList.remove('tooltips-left');
                for (let i = 0; i <= 100; i += 5) {
                    if (this.divTooltip.classList.contains('tooltips-left' + i)) this.divTooltip.classList.remove('tooltips-left' + i);
                }
            } else {
                this.divTooltip.classList.add('tooltips-left');
            }
            if (className !== 'tooltips-right') {
                if (this.divTooltip.classList.contains('tooltips-right')) this.divTooltip.classList.remove('tooltips-right');
                for (let i = 0; i <= 100; i += 5) {
                    if (this.divTooltip.classList.contains('tooltips-right' + i)) this.divTooltip.classList.remove('tooltips-right' + i);
                }
            } else {
                this.divTooltip.classList.add('tooltips-right');
            }
            if (className !== 'tooltips-bottom') {
                if (this.divTooltip.classList.contains('tooltips-bottom')) this.divTooltip.classList.remove('tooltips-bottom');
                for (let i = 0; i <= 100; i += 5) {
                    if (this.divTooltip.classList.contains('tooltips-bottom' + i)) this.divTooltip.classList.remove('tooltips-bottom' + i);
                }
            } else {
                this.divTooltip.classList.add('tooltips-bottom');
            }
        }
    }

    scrollToElement() {
        if (!this.clonedConfig.scrolled) {
            const pageSize = this.getPageSize();
            const topBarSizeHeight = 75;
            let here = 0;
            const newTop = this.getOffset(this.el).top - this.divTooltip.offsetHeight - (this.arrowSize * 2);
            if ((this.getOffset(this.el).top - this.scrollTop - topBarSizeHeight) > pageSize.height) {
                here = newTop;
            } else {
                here = newTop > 0 ? newTop : 0;
            }
            const ids = this.parentDiv.querySelectorAll('*[id]');
            let found = false;
            [].forEach.call(ids, (div) => {
                if (div.id === this.clonedConfig.target) {
                    found = true;
                }
            });
            if (found) {
                this.parentDiv.scrollTo(0, here);
            }
            this.clonedConfig.scrolled = true;
        }
    }

    getPageSize() {
        const w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        return { width: x, height: y };
    }

    getScroll(event): void {
        this.scrollTop = event.target.scrollTop;
        this.moveTooltip();
    }

    getOffset(el) {
        let _x = 0;
        let _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }

    hideTooltip(): void {
        // console.log('hideTooltip');
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            // hide
            const strPCases = this.pCases.join();
            switch (strPCases) {
            case '0,0,0,1': // middle left
                this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(20px, 0, 0)');
                break;
            case '0,1,0,0': // middle right
                this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, -20px, 0)');
                break;
            case '1,0,0,0': // middle top
                this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, 20px, 0)');
                break;
            default:    // default - bottom
                this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, -20px, 0)');
                break;
            }
            this.renderer.setStyle(this.divTooltip, 'opacity', '0');
            this.renderer.setStyle(this.divTooltip, 'pointer-events', 'none'); // allow click through transparent tooltips
            if (this.clonedConfig.autoshow === undefined || this.clonedConfig.autoshow === false || this.tourConfig.length > 0) {
                setTimeout(() => {
                    this.cleanAll(false);
                },         300);
            }
        }
    }

    generateID(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    cleanAll(forced): void {
        if (this.parentDiv) {
            this.parentDiv.removeEventListener('scroll', (event) => {
                this.getScroll(event);
            },                                 true);
        }
        // remove div tooltip
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            this.divTooltip.remove();
            this.divTooltip = null;
        }
        if (forced) {
            if (this.isTour) {
                this.step = 0;
                this.saveUserTour();    // save UserTour done
                this._ngRedux.dispatch(clearAppliedHighlight());
                clearTimeout(this.autoNextTimeout);
                this.isAutoNext = false;
                this.hideTooltip();
                if (this.divBackgroundTour) this.divBackgroundTour.remove();
                this._ngRedux.dispatch({ type: SET_USERTOUR_INPROGRESS, data: false }); // reset highlight
                this._ngRedux.dispatch({ type: SET_USER_TOURS, data: null }); // reset usertour datas
                // this.isTour = false;
                // this.userTourName = '';
                // this.clonedConfig = [];
                // this.tourConfig = [];
                // this.userTourDatas = [];
            }
        } else {
            if (this.tourConfig.length > 1 && this.step < this.tourConfig.length) {
                this.autoshowTooltip();
            }
        }
    }

    setConfig(index) {
        // this.clonedConfig
        this.clonedConfig = {
            usertourName: (this.tourConfig[index].usertourName) ? this.tourConfig[index].usertourName : '',
            title: this.tourConfig[index].title,
            text: this.tourConfig[index].text,
            target: this.tourConfig[index].target,
            redirect: this.tourConfig[index].redirect,
            autoshow: true,
            scrolled: false,
            duration: (this.tourConfig[index].duration) ? this.tourConfig[index].duration : this.tourDuration,
        };
    }

    nextStep() {
        // console.log('nextStep');
        this.step += 1;
        if ((this.step) < this.tourConfig.length) {
            this.setConfig(this.step);
            this.hideTooltip();
        }
    }

    prevStep() {
        // console.log('nextStep');
        if (this.step > 0) {
            this.step -= 1;
            this.setConfig(this.step);
            this.hideTooltip();
        }
    }

    isChild(parent, child) {
        let node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }

        this.cleanAll(true);
    }
}
