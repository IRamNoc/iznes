import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
    selector: '[tooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {

    @Input('tooltip') config: any;
    divTooltip: any;
    divTooltipTitle: any;
    divTooltipText: any;
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

    connectedWalletId = 0;

    userTourDatas = [];
    userTourInProgress = false;
    userTourName = '';
    randID: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {
        this.parentDiv = document.getElementsByClassName('content-area')[0];
        if (!this.parentDiv) this.parentDiv = document.getElementsByClassName('router-container')[0];
    }

    ngOnInit() {
        this.config.toggleOn = !this.config.toggleOn ? false : this.config.toggleOn;
        this.buildTooltip();
    }

    @HostListener('click') onClick(): void {
        this.hideTooltip();

        setTimeout(
            () => {
                this.config.toggleOn = true;
                this.showTooltip();
            },
            350,
        );
    }

    @HostListener('mouseover') onMouseOver(): void {
        this.showTooltip();
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        if (!this.config.toggleOn) {
            this.hideTooltip();
        }
    }

    buildTooltip() {
        if (!this.divTooltip) {
            const isTitle = (this.config.title !== undefined && this.config.title !== '');
            this.divTooltip = document.createElement('div');
            this.divTooltip.className = 'tooltips';
            this.randID = this.generateID(50);
            this.divTooltip.id = `tooltip_${this.randID}`;
            let addCloseButton = `<i class="fa fa-times tooltipCloseBtnTitle" id="tooltipCloseBtn_${this.randID}"></i>`;
            // add default title
            if (isTitle) {
                this.divTooltip.innerHTML = `<div id="tooltipTitle_${this.randID}" class="title"
                                             style="opacity:${this.config.toggleOn ? 1 : 0};">${addCloseButton}</div>`;
            }
            let tmpInnerHTML = `<div id="tooltipText_${this.randID}" class="text"></div>`;
            if (!isTitle) {
                // change button if no title
                addCloseButton = `<i class="fa fa-times tooltipCloseBtnText" id="tooltipCloseBtn_${this.randID}"
                                  style="opacity:${this.config.toggleOn ? 1 : 0};"></i>`;
                tmpInnerHTML = `<div id="tooltipText_${this.randID}" class="text">${addCloseButton}</div>`;
            }
            this.divTooltip.innerHTML += tmpInnerHTML;
            document.body.appendChild(this.divTooltip);
            // assign
            if (isTitle) this.divTooltipTitle = document.getElementById(`tooltipTitle_${this.randID}`);
            this.divTooltipText = document.getElementById(`tooltipText_${this.randID}`);
            // add click function
            this.divTooltip.onclick = (event) => {
                if (event.target.id === `tooltipCloseBtn_${this.randID}`) {
                    this.config.toggleOn = false;
                    this.hideTooltip();
                }
            };
            this.divTooltipText.innerHTML += this.config.text;

            // size rules
            if (!this.config.size) {
                if (!isTitle && this.config.text.length <= 50) {
                    this.divTooltip.classList.add('t-small');
                } else {
                    this.divTooltip.classList.add('t-medium');
                }
            } else {
                if (this.config.size === 'small') {
                    if (this.config.text.length > 50) { // small no max-width
                        this.divTooltip.classList.add('t-medium'); // force max-width
                    } else {
                        this.divTooltip.classList.add(`t-${this.config.size}`);
                    }
                } else {
                    // force small if no title & <50 chars
                    if (!isTitle) {
                        if (this.config.text.length <= 50) {
                            this.divTooltip.classList.add('t-small');
                        } else {
                            this.divTooltip.classList.add('t-medium');
                        }
                    } else {
                        this.divTooltip.classList.add(`t-${this.config.size}`);
                    }
                }
            }
        }
    }

    showTooltip(): void {
        this.moveTooltip();

        if (this.config.toggleOn) {
            this.renderer.setStyle(document.querySelector(`#tooltipCloseBtn_${this.randID}`), 'opacity', '1');
        }
        this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, 0, 0)');
        this.renderer.setStyle(this.divTooltip, 'opacity', '1');
    }

    moveTooltip(): void {
        if (this.divTooltip) {
            this.scrollTop = this.parentDiv.scrollTop;
            this.pCases = [0, 0, 0, 0];

            // default direction
            this.applyArrowClass('tooltips-bottom');

            if (this.el.nativeElement) {
                const elRect = this.el.nativeElement.getBoundingClientRect();

                const isChildContainer = this.isChild(this.parentDiv, this.el.nativeElement);
                const elPosition = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('position');
                if (!isChildContainer) {
                    this.scrollTop = 0;
                } else if (elPosition === 'absolute') {
                    this.scrollTop = 0;
                }

                // tooltip position
                let newTop: any = Number(this.getOffset(this.el.nativeElement).top - this.divTooltip.offsetHeight
                    - this.arrowSize - this.scrollTop);
                let newLeft: any = Number((elRect.left + (this.el.nativeElement.offsetWidth / 2)) -
                    (this.divTooltip.offsetWidth / 2));

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
                        newLeft = Number(this.getOffset(this.el.nativeElement).left +
                            this.el.nativeElement.offsetWidth + this.arrowSize);
                        newTop = Number((this.getOffset(this.el.nativeElement).top - this.scrollTop) +
                            (this.el.nativeElement.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                        if (Number(newTop + this.divTooltip.offsetHeight) >= pageSize.height) {
                            newTop = Number(pageSize.height - this.arrowSize - this.divTooltip.offsetHeight);
                            const posYTooltip = newTop;
                            const posYMiddleEl = Number(this.getOffset(this.el.nativeElement).top +
                                (this.el.nativeElement.offsetHeight / 2));
                            const tooltipSize = this.divTooltip.offsetHeight;
                            const percent = (posYMiddleEl - posYTooltip) / tooltipSize * 100;
                            // change arrow direction
                            this.applyArrowClass('tooltips-left');
                            // move arrow position
                            let roundPercent = (5 * Math.round(percent / 5));
                            roundPercent = (roundPercent > 95) ? 95 : roundPercent;
                            roundPercent = (roundPercent < 5) ? 5 : roundPercent;
                            this.divTooltip.classList.add(`tooltips-left${roundPercent}`);
                        } else {
                            // change arrow direction
                            this.applyArrowClass('tooltips-left');
                        }
                        break;
                    case '0,1,0,0': // middle right
                        // tooltip position
                        newLeft = Number(this.getOffset(this.el.nativeElement).left - this.arrowSize -
                            this.divTooltip.offsetWidth);
                        newTop = Number((this.getOffset(this.el.nativeElement).top - this.scrollTop) +
                            (this.el.nativeElement.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                        this.applyArrowClass('tooltips-right');
                        break;
                    case '1,0,0,1': // corner top-left
                        newLeft = Number(this.getOffset(this.el.nativeElement).left +
                            this.el.nativeElement.offsetWidth + this.arrowSize);
                        newTop = Number((this.getOffset(this.el.nativeElement).top - this.scrollTop) +
                            (this.el.nativeElement.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                        this.applyArrowClass('tooltips-left');
                        break;
                    case '1,1,0,0': // corner top-right
                        newLeft = Number(this.getOffset(this.el.nativeElement).left - this.arrowSize -
                            this.divTooltip.offsetWidth);
                        newTop = Number(this.getOffset(this.el.nativeElement).top +
                            (this.el.nativeElement.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2) -
                            this.scrollTop);
                        this.applyArrowClass('tooltips-right');
                        break;
                    case '1,0,0,0': // middle top
                        newTop = Number(this.getOffset(this.el.nativeElement).top +
                            this.el.nativeElement.offsetHeight + this.arrowSize - this.scrollTop);
                        // change arrow direction
                        this.applyArrowClass('tooltips-top');
                        if (this.config.title === undefined || this.config.title === '') {
                            this.divTooltip.classList.add('tooltips-top-text');
                        }
                        break;
                    case '0,1,1,0': // corner bottom right
                        newLeft = Number(this.getOffset(this.el.nativeElement).left - this.arrowSize -
                            this.divTooltip.offsetWidth);
                        newTop = Number((this.getOffset(this.el.nativeElement).top - this.scrollTop) +
                            (this.el.nativeElement.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                    case '0,0,1,1': // corner bottom left
                        newLeft = Number(this.getOffset(this.el.nativeElement).left +
                            this.el.nativeElement.offsetWidth + this.arrowSize);
                        newTop = Number((this.getOffset(this.el.nativeElement).top - this.scrollTop) +
                            (this.el.nativeElement.offsetHeight / 2) - (this.divTooltip.offsetHeight / 2));
                }

                // calcul decal from previous position - first time decal = new
                let decalTop = (this.divTooltip.style.top !== '') ? parseInt(newTop) -
                    parseInt(this.divTooltip.style.top) : newTop;
                decalTop = (decalTop < 0) ? decalTop * -1 : decalTop;
                let decalLeft = (this.divTooltip.style.top !== '') ? parseInt(newLeft) -
                    parseInt(this.divTooltip.style.left) : newLeft;
                decalLeft = (decalLeft < 0) ? decalLeft * -1 : decalLeft;

                // hide only scrollable tooltips
                if (this.config.toggleOn !== undefined && this.config.toggleOn === true && isChildContainer &&
                    elPosition !== 'absolute' && this.config.target === undefined) {
                    const topBarSizeHeight = 75;
                    const arrowSize = (this.divTooltip.classList.contains('tooltips-left') ||
                        this.divTooltip.classList.contains('tooltips-right')) ? 0 : (this.arrowSize * 2);
                    const tooltipSize = (this.divTooltip.classList.contains('tooltips-left') ||
                        this.divTooltip.classList.contains('tooltips-right')) ? ((this.getOffset(this.el.nativeElement)
                        .top - (this.getOffset(this.el.nativeElement).top + (this.el.nativeElement.offsetWidth / 2) -
                        (this.divTooltip.offsetHeight / 2)))) : this.divTooltip.offsetHeight;
                    if ((this.getOffset(this.el.nativeElement).top - this.scrollTop - topBarSizeHeight - tooltipSize -
                        arrowSize) <= 1) {
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
                if (decalTop >= 1 || this.divTooltip.style.top === '') this.divTooltip.style.top = `${newTop}px`;
                if (decalLeft >= 1 || this.divTooltip.style.left === '') this.divTooltip.style.left = `${newLeft}px`;
            } else {
                this.cleanAll();
            }
        }
    }

    applyArrowClass(className): void {
        if (this.divTooltip !== null && this.divTooltip !== undefined) {
            if (className !== 'tooltips-top') {
                if (this.divTooltip.classList.contains('tooltips-top')) {
                    this.divTooltip.classList.remove('tooltips-top');
                }
                if (this.divTooltip.classList.contains('tooltips-top-text')) {
                    this.divTooltip.classList.remove('tooltips-top-text');
                }
            } else {
                this.divTooltip.classList.add('tooltips-top');
                for (let i = 0; i <= 100; i += 5) {
                    if (this.divTooltip.classList.contains(`tooltips-top${i}`)) {
                        this.divTooltip.classList.remove(`tooltips-top${i}`);
                    }
                }
            }
            if (className !== 'tooltips-left') {
                if (this.divTooltip.classList.contains('tooltips-left')) {
                    this.divTooltip.classList.remove('tooltips-left');
                }
                for (let i = 0; i <= 100; i += 5) {
                    if (this.divTooltip.classList.contains(`tooltips-left${i}`)) {
                        this.divTooltip.classList.remove(`tooltips-left${i}`);
                    }
                }
            } else {
                this.divTooltip.classList.add('tooltips-left');
            }
            if (className !== 'tooltips-right') {
                if (this.divTooltip.classList.contains('tooltips-right')) {
                    this.divTooltip.classList.remove('tooltips-right');
                }
                for (let i = 0; i <= 100; i += 5) {
                    if (this.divTooltip.classList.contains(`tooltips-right${i}`)) {
                        this.divTooltip.classList.remove(`tooltips-right${i}`);
                    }
                }
            } else {
                this.divTooltip.classList.add('tooltips-right');
            }
            if (className !== 'tooltips-bottom') {
                if (this.divTooltip.classList.contains('tooltips-bottom')) {
                    this.divTooltip.classList.remove('tooltips-bottom');
                }
                for (let i = 0; i <= 100; i += 5) {
                    if (this.divTooltip.classList.contains(`tooltips-bottom${i}`)) {
                        this.divTooltip.classList.remove(`tooltips-bottom${i}`);
                    }
                }
            } else {
                this.divTooltip.classList.add('tooltips-bottom');
            }
        }
    }

    getPageSize() {
        const w = window;
        const d = document;
        const e = d.documentElement;
        const g = d.getElementsByTagName('body')[0];
        const x = w.innerWidth || e.clientWidth || g.clientWidth;
        const y = w.innerHeight || e.clientHeight || g.clientHeight;
        return { width: x, height: y };
    }

    getScroll(event): void {
        this.scrollTop = event.target.scrollTop;
        this.moveTooltip();
    }

    getOffset(el) {
        let x = 0;
        let y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: y, left: x };
    }

    hideTooltip(): void {
        if (this.divTooltip) {
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
            this.renderer.setStyle(this.divTooltip, 'pointer-events', 'none'); // allow click through tooltips
            this.renderer.setStyle(document.querySelector(`#tooltipCloseBtn_${this.randID}`), 'opacity', '0');
        }
    }

    generateID(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i += 1) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    cleanAll(): void {
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
    }

    isChild(parent, child) {
        let node = child.parentNode;
        while (node != null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    ngOnDestroy(): void {
        this.cleanAll();
    }
}
