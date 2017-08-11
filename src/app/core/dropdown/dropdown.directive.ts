import {
    Directive,
    ElementRef,
    Input,
    AfterViewInit
} from '@angular/core';

/**
 * DropDown
 * If placed on an item with a ul as the next sibling, the ul will be shown/hidden on click.
 *
 **/
@Directive({
    selector: '[dropdown]'
})
export class DropdownDirective {
    /* Properties.*/
    @Input()
    public isOpen:boolean = false;

    private list:any;

    /* Constructor. */
    constructor (
        private label: ElementRef
    ) {
        /* Assign click handler. */
        this.label.nativeElement.addEventListener('click', function (event) {
            /* Toggle the state. */
            this.isOpen = this.isOpen ? false : true;
        });

        this.list = this.label.nativeElement.nextElementSibling;
    }

    ngAfterViewInit () {

    }
}
