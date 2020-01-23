import { Directive, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';

@Directive({
    selector: '[appBackToTop]'
})
export class BackToTopDirective {

    target = null;
    isScroll = false;

    divParent: any;
    divBackToTop: any;
    innerDiv: any;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {

    }

    @HostListener('scroll', ['$event']) public onScroll(event: Event): void {
        if (event.srcElement.scrollTop > 80) {
            this.isScroll = true;
            this.createBacktToTopElmt();
            this.renderer.setStyle(this.divBackToTop, 'opacity', 1);
        } else {
            this.isScroll = false;
            if (this.divBackToTop !== undefined) {
                this.renderer.setStyle(this.divBackToTop, 'opacity', 0);
            }
            this.removeBackToTopElmt();
        }
    }

    @HostListener('document:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
        this.target = event.target;
        if (this.target && this.target.getAttribute('allowBackToTop') && this.isScroll) {
            this.isScroll = false;
            this.el.nativeElement.scrollTop = 0;
            this.renderer.setStyle(this.divBackToTop, 'opacity', 0);
        }
    }

    private createBacktToTopElmt() {
        if (this.divBackToTop === undefined) {
            this.divBackToTop = this.renderer.createElement('div');
            this.renderer.setAttribute(this.divBackToTop , "allowBackToTop", "true");
            this.renderer.addClass(this.divBackToTop, 'backToTop');

            this.innerDiv = this.renderer.createElement('i');
            this.renderer.setAttribute(this.innerDiv , "allowBackToTop", "true");
            this.renderer.setAttribute(this.innerDiv , "aria-hidden", "true");
            this.renderer.addClass(this.innerDiv, 'fa');
            this.renderer.addClass(this.innerDiv, 'fa-arrow-circle-up');

            this.divParent = this.el.nativeElement;

            this.renderer.appendChild(this.divBackToTop, this.innerDiv);
            this.renderer.appendChild(this.divParent, this.divBackToTop);
        }
    }

    private removeBackToTopElmt() {
        if (this.divBackToTop !== undefined) {
            this.renderer.removeChild(this.divParent, this.divBackToTop);
            this.divBackToTop = undefined;
        }
    }
}
