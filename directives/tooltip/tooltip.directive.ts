import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[tooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy, AfterViewInit {

    private el: HTMLInputElement;
    @Input('tooltip') config: any;
    divTooltip: any;
    divTooltipTitle: any;
    divTooltipText: any;
    divTooltipCloseBtn: any;
    arrowSize = 10; // arrow size
    scrollTop = 0;
    parentDiv: any;
    pCases = [0, 0, 0, 0]; // top - right - bottom - left

    constructor(
        private _el: ElementRef,
        private renderer: Renderer2,
    ) {
        this.el = this._el.nativeElement;
        this.parentDiv = document.getElementsByClassName('content-area')[0];
        this.renderer.setStyle(this.el, 'cursor', 'pointer');
    }

    ngOnInit() {
        // this.config.autoshow = (this.el.id !== 'bug') ? false : true;   // debug: keep auto only if id="bug"
        this.autoshowTooltip();
    }

    ngAfterViewInit() {
        if (this.config.autoshow !== undefined && this.config.autoshow === true) {
            this.moveTooltip();
        }
    }

    @HostListener('click') onClick(): void {
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            this.hideTooltip();
        }
        this.config.autoshow = !this.config.autoshow;
        setTimeout(() => {
            this.autoshowTooltip();
        }, 350);
    }

    @HostListener('mouseenter') onMouseEnter(): void {
        this.checkIfTooltipExists();
        if (this.parentDiv) {
            this.parentDiv.addEventListener('scroll', (event) => {
                this.getScroll(event);
            }, false);
            if (this.scrollTop === 0) {
                this.scrollTop = this.parentDiv.scrollTop;
            }
        }
        this.showTooltip();
    }

    @HostListener('mousemove', ['$event']) onMouseOver(event: MouseEvent): void {
        if (this.config.autoshow === undefined || this.config.autoshow === false) {
            if (this.el === event.target) {
                this.moveTooltip();
            }
        }
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        if (this.config.autoshow === undefined || this.config.autoshow === false) {
            this.hideTooltip();
        }
    }

    @HostListener('window:resize') onWindowResize(): void {
        this.checkIfTooltipExists();
        this.moveTooltip();
    }

    autoshowTooltip() {
        if (this.config.autoshow !== undefined && this.config.autoshow === true) {
            this.checkIfTooltipExists();
            if (this.parentDiv) {
                this.parentDiv.addEventListener( 'scroll', (event) => {
                    this.getScroll(event);
                }, false);
                if (this.scrollTop === 0) {
                    this.scrollTop = this.parentDiv.scrollTop;
                }
            }
            this.showTooltip();
        }
    }

    checkIfTooltipExists() {
        if (this.divTooltip === null || this.divTooltip === undefined) {
            const newDiv = document.createElement('div');
            newDiv.className = 'tooltips';
            const randomID = this.generateID(50);
            newDiv.id = 'tooltip_' + randomID;
            let addCloseButton = '<i class="fa fa-times tooltipCloseBtnTitle" id="tooltipCloseBtn_' + randomID + '"></i>';
            // add default title
            newDiv.innerHTML = '<div id="tooltipTitle_' + randomID + '" class="title"></div>';
            // if autoshow
            if (this.config.autoshow !== undefined && this.config.autoshow === true) {
                // if title
                if (this.config.title !== undefined || this.config.title !== '') {
                    newDiv.innerHTML = '<div id="tooltipTitle_' + randomID + '" class="title">' + addCloseButton + '</div>';
                }
            }
            // add default text
            let tmpInnerHTML = '<div id="tooltipText_' + randomID + '" class="text"></div>';
            if (this.config.autoshow !== undefined && this.config.autoshow === true) {
                // if title
                if (this.config.title === undefined || this.config.title === '') {
                    // change button if no title
                    addCloseButton = '<i class="fa fa-times tooltipCloseBtnText" id="tooltipCloseBtn_' + randomID + '"></i>';
                    tmpInnerHTML = '<div id="tooltipText_' + randomID + '" class="text">' + addCloseButton + '</div>';
                }
            }
            newDiv.innerHTML += tmpInnerHTML;
            document.body.appendChild(newDiv);
            // reset
            this.divTooltip = null;
            this.divTooltipTitle = null;
            this.divTooltipText = null;
            this.divTooltipCloseBtn = null;
            // assign
            this.divTooltip = document.getElementById('tooltip_' + randomID);
            this.divTooltipTitle = document.getElementById('tooltipTitle_' + randomID);
            this.divTooltipText = document.getElementById('tooltipText_' + randomID);
            this.divTooltipCloseBtn = document.getElementById('tooltipCloseBtn_' + randomID);
            // add click function
            if (this.divTooltip) {
                this.divTooltip.onclick = (event) => {
                    if (event.target.id === 'tooltipCloseBtn_' + randomID) {
                        this.config.autoshow = false;
                        this.hideTooltip();
                    }
                };
            }
            // add title + text
            this.divTooltipTitle.innerHTML += this.config.title;
            this.divTooltipText.innerHTML += this.config.text;
        }
    }

    showTooltip(): void {
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            const elRect = this.el.getBoundingClientRect();

            // reset css
            this.divTooltip.className = 'tooltips';
            // no title case
            if (this.config.title === undefined || this.config.title === '') {
                this.divTooltipTitle.classList.add('hideTitle');
                this.divTooltipText.classList.add('hideTitle');
            } else {
                this.divTooltipTitle.classList.remove('hideTitle');
                this.divTooltipText.classList.remove('hideTitle');
            }

            // size rules
            if (!this.config.size) {
                if ((this.config.title === undefined || this.config.title === '') && this.config.text.length <= 50) {
                    this.divTooltip.classList.add('t-small');
                } else {
                    this.divTooltip.classList.add('t-medium');
                }
            } else {
                if (this.config.size === 'small') {
                    if (this.config.text.length > 50) { // small no max-width
                        this.divTooltip.classList.add('t-medium'); // force max-width
                    } else {
                        this.divTooltip.classList.add('t-' + this.config.size);
                    }
                } else {
                    // force small if no title & <50 chars
                    if (this.config.title === undefined || this.config.title === '') {
                        if (this.config.text.length <= 50) {
                            this.divTooltip.classList.add('t-small');
                        } else {
                            this.divTooltip.classList.add('t-medium');
                        }
                    } else {
                        this.divTooltip.classList.add('t-' + this.config.size);
                    }
                }
            }

            this.moveTooltip();

            setTimeout(() => {
                if (this.divTooltip !== null && this.divTooltip !== undefined) {
                    this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, 0, 0)');
                    this.renderer.setStyle(this.divTooltip, 'opacity', '1');
                }
            }, 50);
        }
    }

    moveTooltip(): void {
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            // reset array
            this.pCases = [0, 0, 0, 0];

            // default direction
            this.applyArrowClass('tooltips-bottom');

            const elRect = this.el.getBoundingClientRect();

            // position absolute fix
            const elPosition = window.getComputedStyle(this.el,null).getPropertyValue('position');
            if (elPosition === 'absolute') {
                this.scrollTop = 0;
            }
            // tooltip position
            let newTop: any = Number(this.getOffset(this.el).top - this.divTooltip.offsetHeight - this.arrowSize - this.scrollTop);
            let newLeft: any = Number((elRect.left + (this.el.offsetWidth / 2)) - (this.divTooltip.offsetWidth / 2));

            // console.log(this.getOffset(this.el).top);

            // check if tooltip is in screen
            const pageSize = this.getPageSize();
            // console.log('top', newTop + ' / ' + pageSize.height);
            // console.log('left', newLeft + ' / ' + pageSize.width);
            // too high
            if (newTop < 0) {
                this.pCases[0] = 1;
            }
            // too low
            if ((newTop + this.divTooltip.offsetHeight) > pageSize.height) {
                this.pCases[2] = 1;
            }
            // too left
            if (newLeft < 0) {
                this.pCases[3] = 1;
            }
            // too right
            if ((newLeft + this.divTooltip.offsetWidth) > pageSize.width) {
                this.pCases[1] = 1;
            }

            const strPCases = this.pCases.join();
            // console.log(strPCases);
            switch (strPCases) {
                case '0,0,0,1': // middle left
                    // tooltip position
                    newLeft = Number(this.getOffset(this.el).left + this.el.offsetWidth + this.arrowSize);
                    newTop = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                    if (Number(newTop + this.divTooltip.offsetHeight) >= pageSize.height) {
                        newTop = Number(pageSize.height - this.arrowSize - this.divTooltip.offsetHeight);
                        const posYTooltip = newTop;
                        const posYMiddleEl = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2));
                        const tooltipSize = this.divTooltip.offsetHeight;
                        const percent = (posYMiddleEl - posYTooltip) / tooltipSize * 100;
                        // change arrow direction
                        this.applyArrowClass('tooltips-left');
                        // move arrow position
                        const roundPercent = (5 * Math.round(percent / 5));
                        if (roundPercent !== 50) {
                            this.divTooltip.classList.add('tooltips-left' + roundPercent);
                        }
                    } else {
                        // change arrow direction
                        this.applyArrowClass('tooltips-left');
                    }
                    break;
                case '0,1,0,0': // middle right
                    // tooltip position
                    newLeft = Number(this.getOffset(this.el).left - this.arrowSize - this.divTooltip.offsetWidth);
                    newTop = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                    if (Number(newTop + this.divTooltip.offsetHeight) >= pageSize.height) {
                        newTop = Number(pageSize.height - this.arrowSize - this.divTooltip.offsetHeight);
                        const posYTooltip = newTop;
                        const posYMiddleEl = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2));
                        const tooltipSize = this.divTooltip.offsetHeight;
                        const percent = (posYMiddleEl - posYTooltip) / tooltipSize * 100;
                        // change arrow direction
                        this.applyArrowClass('tooltips-right');
                        // move arrow position
                        const roundPercent = (5 * Math.round(percent / 5));
                        if (roundPercent !== 50) {
                            this.divTooltip.classList.add('tooltips-right' + roundPercent);
                        }
                    } else {
                        // change arrow direction
                        this.applyArrowClass('tooltips-right');
                    }
                    break;
                case '1,0,0,1': // corner top-left
                    newLeft = Number(this.getOffset(this.el).left + this.el.offsetWidth + this.arrowSize);
                    newTop = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                    if (Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2)) <= 0) {
                        newTop = this.arrowSize;
                        const posYTooltip = newTop;
                        const posYMiddleEl = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2));
                        const tooltipSize = this.divTooltip.offsetHeight;
                        const percent = (posYMiddleEl - posYTooltip) / tooltipSize * 100;
                        // change arrow direction
                        this.applyArrowClass('tooltips-left');
                        // move arrow position
                        const roundPercent = (5 * Math.round(percent / 5));
                        if (roundPercent !== 50) {
                            this.divTooltip.classList.add('tooltips-left' + roundPercent);
                        }
                    } else {
                        // change arrow direction
                        this.applyArrowClass('tooltips-left');
                    }
                    break;
                case '1,1,0,0': // corner top-right
                    newLeft = Number(this.getOffset(this.el).left - this.arrowSize - this.divTooltip.offsetWidth);
                    newTop = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                    if (Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2)) <= 0) {
                        newTop = this.arrowSize;
                        const posYTooltip = newTop;
                        const posYMiddleEl = Number(this.getOffset(this.el).top + (this.el.offsetHeight / 2));
                        const tooltipSize = this.divTooltip.offsetHeight;
                        const percent = (posYMiddleEl - posYTooltip) / tooltipSize * 100;
                        // change arrow direction
                        this.applyArrowClass('tooltips-right');
                        // move arrow position
                        const roundPercent = (5 * Math.round(percent / 5));
                        if (roundPercent !== 50) {
                            this.divTooltip.classList.add('tooltips-right' + roundPercent);
                        }
                    } else {
                        // change arrow direction
                        this.applyArrowClass('tooltips-right');
                    }
                    break;
                case '1,0,0,0': // middle top
                    newTop = Number(this.getOffset(this.el).top + this.el.offsetHeight + this.arrowSize);
                    // change arrow direction
                    this.applyArrowClass('tooltips-top');
                    if (this.config.title === undefined || this.config.title === '') {
                        this.divTooltip.classList.add('tooltips-top-text');
                    }
                    break;
            }

            // calcul decal from previous position - first time decal = new
            let decalTop = (this.divTooltip.style.top !== '') ? parseInt(newTop) - parseInt(this.divTooltip.style.top) : newTop;
            decalTop = (decalTop < 0) ? decalTop * -1 : decalTop;
            let decalLeft = (this.divTooltip.style.top !== '') ? parseInt(newLeft) - parseInt(this.divTooltip.style.left) : newLeft;
            decalLeft = (decalLeft < 0) ? decalLeft * -1 : decalLeft;

            if (this.config.autoshow !== undefined && this.config.autoshow === true && elPosition !== 'absolute') {
                const topBarSizeHeight = 75;
                if ((this.getOffset(this.el).top - this.scrollTop - topBarSizeHeight - this.divTooltip.offsetHeight - (this.arrowSize * 2)) <= 1) {
                    decalTop = 0; // stop moving
                    this.hideTooltip();
                } else {
                    if (this.divTooltip !== null && this.divTooltip !== undefined) {
                        this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, 0, 0)');
                        this.renderer.setStyle(this.divTooltip, 'opacity', '1');
                    }
                }
            }

            // apply modification only if decal >= 1
            if (decalTop >= 1) this.divTooltip.style.top = newTop + 'px';
            if (decalLeft >= 1) this.divTooltip.style.left = newLeft + 'px';
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

    getPageSize() {
        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth  || e.clientWidth  || g.clientWidth,
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
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            // hide
            const strPCases = this.pCases.join();
            switch (strPCases) {
                case '0,0,0,1': // middle left
                    this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(20px, 0, 0)');
                    break;
                case '0,1,0,0': // middle right
                    this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(-20px, 0, 0)');
                    break;
                case '1,0,0,0': // middle top
                    this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, 20px, 0)');
                    break;
                default:    // default - bottom
                    this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, -20px, 0)');
                    break;
            }
            this.renderer.setStyle(this.divTooltip, 'opacity', '0');
            if (this.config.autoshow === undefined || this.config.autoshow === false) {
                setTimeout(() => {
                    this.cleanAll();
                }, 300);
            }
        }
    }

    generateID(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++)  {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    cleanAll(): void {
        this.parentDiv.removeEventListener( 'scroll', (event) => {
            this.getScroll(event);
        }, true);
        // remove div tooltip
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            this.divTooltip.remove();
            this.divTooltip = null;
        }
    }

    ngOnDestroy(): void {
        this.cleanAll();
    }
}
