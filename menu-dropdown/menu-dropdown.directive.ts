import {Directive, ElementRef} from "@angular/core";

import {MenuDropdownService} from "./menu-dropdown.service";

/**
 * DropDown
 * If placed on an item with a ul as the next sibling, the ul will be shown/hidden on click.
 **/
@Directive({
    selector: '[menu-dropdown]'
})
export class DropdownDirective {
    /* Properties.*/
    public isOpen: boolean = false;

    private list: any;
    private identifier: number;
    private targetHeight: string;

    /* Constructor. */
    constructor(private label: ElementRef,
                private menuDropdownService: MenuDropdownService) {
        /* Check if the isOpen property was set... */
        let prop = label.nativeElement.getAttribute('isOpen');
        if (prop === true) {
            /*Set it, if it was true. */
            this.isOpen = prop;
        }

        /* Register this dropdown, this returns an ID and lets the service know
         who we are. */
        this.identifier = this.menuDropdownService.registerDropdown();

        /* Listen to the event, and call switch whenever it's broadcast. */
        this.menuDropdownService.activationEvent.subscribe((event) => {
            this.switch(event);
        })
    }

    getTotalHeight(htmlCollection: HTMLCollectionOf<HTMLLIElement>): number {
        if (!htmlCollection.length) {
            return 0;
        }
        let total = 0;
        for (let i = 0; i < htmlCollection.length; i++) {
            total += htmlCollection.item(i).offsetHeight;
        }
        return total;
    }

    /**
     * After View Init
     * At this point we can assign click handlers and deal with checking if
     * there is a list nextSlibling.
     */
    ngAfterViewInit() {
        /* Check if we have a list next to us. */
        if (this.label.nativeElement.nextElementSibling.tagName === "UL") {
            /* Set the list reference. */
            this.list = this.label.nativeElement.nextElementSibling;

            /* Assign click handler. */
            this.label.nativeElement.addEventListener('click', () => {
                if (!this.isOpen) {
                    this.menuDropdownService.requestActivation(this.identifier);
                } else {
                    this.menuDropdownService.requestDeactivation(this.identifier);
                }
            });

            /* Workout height. */
            const height = this.getTotalHeight(this.list.getElementsByTagName('li'));

            /* Refer to the target. */
            this.targetHeight = height + 'px';

            /* Render. */
            this.render();
        }
    }

    /**
     * Render
     * Re-renders the list element on the dom.
     */
    public render(): void {
        /* If open, add class. */
        if (this.isOpen) {
            //this.label.nativeElement.classList.add("active");
            this.list.classList.add("active");
            this.list.style.height = this.targetHeight;
        }
        /* Else, remove it. */
        else {
            //this.label.nativeElement.classList.remove("active");
            this.list.classList.remove("active");
            this.list.style.height = "0px";
        }
    }

    /**
     * Switch
     * Trigger the state to switch.
     */
    public switch(activated): void {
        /* Toggle the state, ad update the list class. */
        this.isOpen = activated.id === this.identifier ? true : false;

        /* Re-render. */
        this.render();
    }
}
