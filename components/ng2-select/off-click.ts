import {Directive, HostListener, Input, OnInit, OnDestroy, ElementRef, Output, EventEmitter} from '@angular/core';

@Directive({
    selector: '[offClick]'
})

export class OffClickDirective {
    constructor(private el: ElementRef) {
    }

    @Output()
    public clickOutside = new EventEmitter();

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        const clickedInside = this.el.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(null);
        }
    }
}
