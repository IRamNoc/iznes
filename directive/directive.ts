/* Angular/vendor imports. */
import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
/* Package imports. */
import {PersistService} from '../service/service';

/* Decorator. */
@Directive({
    selector: '[persist]'
})

/* Export directive class. */
export class PersistDirective implements AfterViewInit {
    /* Constructor. */
    constructor(private _el: ElementRef,
                private _persistService: PersistService) {
        /* Stub. */
    }

    /* After View Init. */
    public ngAfterViewInit() {
        /* Stub. */
        console.log('Persis init.');
        let name = this._el.nativeElement.getAttribute('persist');
        if (name) {
            this._persistService.registerForm(name);
        }
    }
}
