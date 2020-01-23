import { Directive, ElementRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import { fromJS } from 'immutable';

@Directive({
    selector: '[appHighlight]'
})
export class HighlightDirective implements OnDestroy {

    elmtList: any = [];
    highlightApplied: boolean = false;
    originalValues = [];

    /* Private properties. */
    private subscriptions: Array<any> = [];

    /* Observables. */
    @select(['highlight', 'applied']) requestHighlightObj;
    @select(['highlight', 'highlightList']) requestHighlightListObj;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {
        this.subscriptions.push(this.requestHighlightObj.subscribe((applied) => this.getApplied(applied)));
        this.subscriptions.push(this.requestHighlightListObj.subscribe((list) => this.getListFromRedux(list)));
    }

    doHighlight() {
        if (this.highlightApplied) {
            if (!this.originalValues[this.el.nativeElement.id]) {
                const computedStyles = getComputedStyle(this.el.nativeElement);
                this.originalValues[this.el.nativeElement.id] = {
                    position: computedStyles.position,
                    zIndex: computedStyles.zIndex,
                    backgroundColor: computedStyles.backgroundColor,
                    boxShadow: computedStyles.boxShadow,
                };
            }
            if (this.elmtList.length > 0) {
                for (const elt of this.elmtList) {
                    if (elt.id === this.el.nativeElement.id) {
                        if (this.originalValues[this.el.nativeElement.id].position.toString() !== 'relative') this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
                        // clr-modal use z-index 1040 for overlay & 1050 for modal
                        if (this.originalValues[this.el.nativeElement.id].zIndex.toString() !== '3000') this.renderer.setStyle(this.el.nativeElement, 'z-index', '3000');
                        // to avoid background transparent on black overlay
                        //  && this.el.nativeElement.tagName !== 'IMG'
                        if (this.originalValues[this.el.nativeElement.id].backgroundColor.toString() === 'rgba(0, 0, 0, 0)') this.renderer.setStyle(this.el.nativeElement, 'background-color', 'white');
                        // add blur effect
                        if (this.originalValues[this.el.nativeElement.id].boxShadow.toString() === 'none') this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 30px white');
                    }
                }
            }
        } else {
            if (this.originalValues[this.el.nativeElement.id]) {
                this.renderer.setStyle(this.el.nativeElement, 'position', this.originalValues[this.el.nativeElement.id].position);
                this.renderer.setStyle(this.el.nativeElement, 'z-index', this.originalValues[this.el.nativeElement.id].zIndex);
                // if (this.el.nativeElement.tagName !== 'IMG')
                this.renderer.setStyle(this.el.nativeElement, 'background-color', this.originalValues[this.el.nativeElement.id].backgroundColor);
                this.renderer.setStyle(this.el.nativeElement, 'box-shadow', this.originalValues[this.el.nativeElement.id].boxShadow);
            }
        }
    }

    getApplied(applied): void {
        this.highlightApplied = applied;
        this.doHighlight();
    }

    getListFromRedux(list) {
        const listImu = fromJS(list);
        this.elmtList = listImu.reduce((result, item) => {
            result.push({
                id: item.get('id', ''),
            });
            return result;
        }, []);
        this.doHighlight();
    }


    /* On Destroy. */
    ngOnDestroy(): void {
        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }
}
