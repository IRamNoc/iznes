import { Directive, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';

@Directive({
    selector: '[appBackToTop]'
})
export class BackToTopDirective {

    target = null;
    isScroll = false;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {

    }

    @HostListener('scroll', ['$event'])
    public onScroll(event: Event): void {
        const divBackToTop = this.el.nativeElement.querySelector('.backToTop');
        if (event.srcElement.scrollTop > 80) {
            this.renderer.setStyle(divBackToTop, 'opacity', 1);
            this.isScroll = true;
        } else {
            this.renderer.setStyle(divBackToTop, 'opacity', 0);
            this.isScroll = false;
        }
    }

    @HostListener('document:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
        const divBackToTop = this.el.nativeElement.querySelector('.backToTop');
        this.target = event.target;
        if (this.target && this.target.getAttribute('allowBackToTop') && divBackToTop && this.isScroll){
            this.isScroll = false;
            this.renderer.setStyle(divBackToTop, 'opacity', 0);
            this.el.nativeElement.scrollTop = 0;
        }
    }
}
