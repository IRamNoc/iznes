/* Angular/vendor imports. */
import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

/* Package imports. */
import { MultilingualService } from './multilingual.service';

/* Decorator. */
@Directive({
    selector: '[mltag]'
})

/* Export directive class. */
export class MultilingualDirective {
    /* Constructor. */
    constructor(
        private el: ElementRef,
        private multilingualService:MultilingualService
    ) {
        /* Stub. */

    }

    public ngAfterViewInit () {
        /* TODO
         * 1. We need to filter the tags by tagname, inputs will need their
         * placeholders changed, most things innerHTML and other things will vary.
         *
         * 2. We need to figure out where the translations will be stored, at the
         * moment, they're in a object export as a constant in `translations.ts`.
         */
        let
        tagname = this.el.nativeElement.tagName.toLowerCase(),
        mltag = this.el.nativeElement.getAttribute('mltag'),
        translation = this.multilingualService.getTranslation(mltag);

        console.log('looking up translation: ', mltag);

        /* First, check that the tag was translated... */
        if ( translation !== mltag ) {
            /* ...next, switch to figure out what tag we're translating. */
            switch ( tagname ) {
                /* Inputs need their placeholder changed. */
                case 'input':
                    this.el.nativeElement.setAttribute('placeholder', translation);
                    break;

                /* Non specific tags are probably innerHTML. */
                default:
                    this.el.nativeElement.innerHTML = translation;
                    break;
            }
        }
    }
}
