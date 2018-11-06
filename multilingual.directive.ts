/* Angular/vendor imports. */
import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

/* Package imports. */
import { MultilingualService } from './multilingual.service';

/* Decorator. */
@Directive({
    selector: '[mltag]'
})

/* Export directive class. */
export class MultilingualDirective implements AfterViewInit {
    private subscription: any;

    /* Constructor. */
    constructor(private el: ElementRef,
                private multilingualService: MultilingualService) {
        /* Stub. */
    }

    public ngAfterViewInit() {
        /* Subscribe for language change. */
        this.subscription = this.multilingualService.getLanguage.subscribe((data) => {
            this.translate();
        });

        /* TODO
         * 1. We need to filter the tags by tagname, inputs will need their
         * placeholders changed, most things innerHTML and other things will vary.
         *
         * 2. We need to figure out where the translations will be stored, at the
         * moment, they're in a object export as a constant in `translations.ts`.
         */

        // temp commented for new translation system
        // this.translate();
    }

    public translate() {
        const tagname = this.el.nativeElement.tagName.toLowerCase();
        const mltag = this.el.nativeElement.getAttribute('mltag');
        const translation = this.multilingualService.getTranslation(mltag);
        const element = this.el.nativeElement;

        let hadAttribute = true;

        /* First, check that the tag was translated... */
        if (translation) {
            /* ...let's check for any attributes that differ the way we'll refect the translation... */
            switch (true) {
            /* Has a title attribute. */
            case element.hasAttribute('title'):
                this.el.nativeElement.setAttribute('title', translation);
                break;

            /* if no attribute was found, we'll let the code fall into the next switch. */
            default:
                hadAttribute = false;
            }

            /* ...attribute flag... */
            if (hadAttribute) return;

            /* ...next, switch to figure out what tag we're translating. */
            switch (tagname) {
            /* Inputs need their placeholder changed. */
            case 'input':
            case 'ng-select':
                this.el.nativeElement.setAttribute('placeholder', translation);
                break;

            /* Non specific tags are probably innerHTML. */
            default:
                /* Default behaviour. */
                this.el.nativeElement.innerHTML = translation;
                break;
            }
        }
    }
}
