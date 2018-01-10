/* Angular/vendor imports. */
import {Directive, ElementRef, Input, AfterViewInit} from '@angular/core';

/* Package imports. */
import {PersistService} from '../service/service';

/* Decorator. */
@Directive({
    selector: '[persist]'
})

/* Export directive class. */
export class PersistDirective implements AfterViewInit {
    /* Constructor. */
    constructor (
        private _el: ElementRef,
        private _persistService: PersistService
    ) {
        /* Stub. */
    }

    /* After View Init. */
    public ngAfterViewInit () {
        /* Stub. */
    }
}
