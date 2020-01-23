import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
    selector: '[tooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {

    @Input('tooltip') config: any;
    @Input('disable') disable: any = false;
    divTooltip: any;
    arrowSize = 10;
    scrollTop = 0;
    parentDiv: any;
    pCases = [0, 0, 0, 0]; // top - right - bottom - left
    randID: string;
    scrollEl = document.querySelector('ng-sidebar-container');

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {
        this.parentDiv = document.getElementsByClassName('content-area')[0];
        if (!this.parentDiv) this.parentDiv = document.getElementsByClassName('router-container')[0];
    }

    ngOnInit() {
        document.body.style.overflow = 'hidden'; // force overflow hidden to prevent scroll outside website
        this.config.toggleOn = !this.config.toggleOn ? false : this.config.toggleOn;
        if (!this.config.hasOwnProperty('allowClick')) this.config.allowClick = true;
        this.buildTooltip();
    }

    @HostListener('click') onClick(): void {
        this.hideTooltip();

        if (!this.disable && this.config.allowClick) {
            setTimeout(
                () => {
                    this.config.toggleOn = true;
                    this.showTooltip();
                },
                350,
            );
        }
    }

    @HostListener('mouseover') onMouseOver(): void {
        if (!this.disable) {
            this.showTooltip();
        } else {
            this.hideTooltip();
        }
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        if (!this.config.toggleOn) {
            this.hideTooltip();
        }
    }

    @HostListener('window:resize') onWindowResize(): void {
        if (!this.disable) this.moveTooltip();
    }

    buildTooltip() {
        this.divTooltip = document.createElement('div');
        this.divTooltip.className = 'tooltips';
        this.randID = this.generateID(50);
        this.divTooltip.id = `tooltip_${this.randID}`;
        let addCloseButton = `<i class="fa fa-times tooltipCloseBtnTitle" id="tooltipCloseBtn_${this.randID}"></i>`;
        let tmpInnerHTML = `<div id="tooltipText_${this.randID}" class="text"></div>`;

        // add default title
        if (this.config.title !== undefined && this.config.title !== '') {
            this.divTooltip.innerHTML =
                `<div class="title" style="opacity:${this.config.toggleOn ? 1 : 0};">${addCloseButton}</div>`;
        } else {
            addCloseButton = `<i class="fa fa-times tooltipCloseBtnText" id="tooltipCloseBtn_${this.randID}"
                              style="opacity:${this.config.toggleOn ? 1 : 0};"></i>`;
            tmpInnerHTML = `<div id="tooltipText_${this.randID}" class="text">${addCloseButton}</div>`;
        }

        this.divTooltip.innerHTML += tmpInnerHTML;
        document.body.appendChild(this.divTooltip);

        this.divTooltip.onclick = (event) => {
            if (event.target.id === `tooltipCloseBtn_${this.randID}`) {
                this.config.toggleOn = false;
                this.hideTooltip();
            }
        };
        document.getElementById(`tooltipText_${this.randID}`).innerHTML += this.config.text;

        this.applyDefaultSize();
    }

    applyDefaultSize() {
        const isTitle = this.config.title !== undefined && this.config.title !== '';
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
        if (this.scrollEl) this.scrollEl.addEventListener('scroll', (event) => { this.getScroll(event); }, true);
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
            const isChildContainer = this.isChild(this.parentDiv, this.el.nativeElement);
            const elPosition = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('position');
            const pageSize = this.getPageSize();

            this.applyArrowClass('tooltips-bottom');

            if (!isChildContainer || elPosition === 'absolute') this.scrollTop = 0;

            let newTop: any = Number(this.getOffset(this.el.nativeElement).top - this.divTooltip.offsetHeight
                - this.arrowSize - this.scrollTop);
            let newLeft: any = Number((this.el.nativeElement.getBoundingClientRect().left +
                (this.el.nativeElement.offsetWidth / 2)) - (this.divTooltip.offsetWidth / 2));

            if (newTop <= 75) this.pCases[0] = 1; // too high - 75 to account for top nav bar
            if (Number(newTop + this.divTooltip.offsetHeight) > pageSize.height) this.pCases[2] = 1; // too low
            if (newLeft < 0) this.pCases[3] = 1; // too left
            if (Number(newLeft + this.divTooltip.offsetWidth) > pageSize.width) this.pCases[1] = 1; // too right

            switch (this.pCases.join()) {
                case '0,0,0,1': // middle left
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
                    }
                    this.applyArrowClass('tooltips-left');
                    break;
                case '0,1,0,0': // middle right
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

            if (this.config.toggleOn) {
                this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(0, 0, 0)');
                this.renderer.setStyle(this.divTooltip, 'opacity', '1');
                this.renderer.setStyle(document.querySelector(`#tooltipCloseBtn_${this.randID}`), 'opacity', '1');
                this.renderer.setStyle(this.divTooltip, 'pointer-events', 'all');
            }

            if (newLeft >= 0) this.divTooltip.style.left = `${newLeft}px`;
            newTop >= 75 ? this.divTooltip.style.top = `${newTop}px` : this.hideTooltip(); // Hide if above top nav bar
        }
    }

    applyArrowClass(className): void {
        if (this.divTooltip) {
            ['tooltips-top', 'tooltips-top-text', 'tooltips-left', 'tooltips-left', 'tooltips-bottom']
            .forEach(classToRemove => this.divTooltip.classList.remove(classToRemove));

            this.divTooltip.classList.add(className);
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
        switch (this.pCases.join()) {
            case '0,0,0,1': // middle left
                this.renderer.setStyle(this.divTooltip, 'transform', 'translate3d(20px, 0, 0)');
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

    generateID(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i += 1) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    cleanAll(): void {
        if (this.scrollEl) this.scrollEl.removeEventListener('scroll', (event) => { this.getScroll(event); }, true);
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
