import { Directive, ElementRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import { fromJS } from 'immutable';

@Directive({
    selector: '[appClicked]'
})
export class ClickedDirective implements OnDestroy {

    /* Private properties. */
    private subscriptions: Array<any> = [];

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {
    }

    @HostListener('document:mouseup', ['$event'])
    public mouseUp(event: MouseEvent): void {
        const clickedInsideElmt = this.el.nativeElement.contains(event.target);
        const elmtHasClassOpen = this.el.nativeElement.classList.contains('open');

        const child = this.el.nativeElement.firstElementChild;

        if (!clickedInsideElmt && child && elmtHasClassOpen) {
            if (child instanceof HTMLElement) {
                child.click();
            } else {
                (<any>child).triggerEventHandler('click', event);
            }
        }
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }
}
