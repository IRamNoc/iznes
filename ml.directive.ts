/* Angular/vendor imports. */
import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

/* Package imports. */
import { MultilingualService } from './multilingual.service';

/* Decorator. */
@Directive({
    selector: '[mltag]'
})

/* Export directive class. */
export class MultiLingualDirective {
    /* Constructor. */
    constructor(
        private el: ElementRef,
        private multilingualService:MultilingualService
    ) {
        /* Stub. */
    }

    public ngAfterViewInit () {
        let
        tag = this.el.nativeElement.getAttribute('mltag'),
        translation = this.multilingualService.getTranslation(tag);
        if ( translation !== tag ) {
            this.el.nativeElement.innerHTML = translation;
        }
    }
}
