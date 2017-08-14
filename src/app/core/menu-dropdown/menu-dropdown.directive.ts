import {
    Directive,
    ElementRef,
    AfterViewInit
} from '@angular/core';

/**
 * DropDown
 * If placed on an item with a ul as the next sibling, the ul will be shown/hidden on click.
 **/
@Directive({
    selector: '[menu-dropdown]'
})
export class DropdownDirective {
    /* Properties.*/
    public isOpen:boolean = false;

    private list:any;
    private targetHeight:string;

    /* Constructor. */
    constructor (
        private label: ElementRef
    ) {
        /* Check if the isOpen property was set... */
        console.log( " |--- Nav Directive" );
        console.log( " | element: ", label.nativeElement.getAttribute('') );
        let prop = label.nativeElement.getAttribute('isOpen');
        console.log( " | type: ", typeof prop );
        console.log( " | value: '"+ prop +"'" );
        if (prop === true || prop === false) {
            /* It should equal true or false. */
            this.isOpen = prop;
        }
    }

    /**
     * After View Init
     * At this point we can assign click handlers and deal with checking if
     * there is a list nextSlibling.
     */
    ngAfterViewInit () {
        /* Check if we have a list next to us. */
        if ( this.label.nativeElement.nextElementSibling.tagName === "UL" ) {
            /* Set the list reference. */
            this.list = this.label.nativeElement.nextElementSibling;

            /* Assign click handler. */
            this.label.nativeElement.addEventListener('click', () => {
                this.switch();
            });

            /* Workout height. */
            let height = this.list.getElementsByTagName('li').length
                       ? (this.list.getElementsByTagName('li').length * this.list.getElementsByTagName('li')[0].offsetHeight)
                       : 0;

            /* Refer to the target. */
            this.targetHeight = height + "px";

            /* Render. */
            this.render();
        }
    }

    /**
     * Render
     * Re-renders the list element on the dom.
     */
    public render ():void {
        /* If open, add class. */
        if ( this.isOpen ) {
            this.label.nativeElement.classList.add("active");
            this.list.classList.add("active");
            this.list.style.height = this.targetHeight;
        }
        /* Else, remove it. */
        else {
            this.label.nativeElement.classList.remove("active");
            this.list.classList.remove("active");
            this.list.style.height = "0px";
        }
    }

    /**
     * Switch
     * Trigger the state to switch.
     */
    public switch ():void {
        /* Toggle the state, ad update the list class. */
        this.isOpen = this.isOpen ? false : true;

        /* Re-render. */
        this.render();
    }
}
