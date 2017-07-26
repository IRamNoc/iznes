/* Core imports. */
import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

/* Import the translations list. */
import { Translations } from './translations';

/* Decorator. */
@Directive({
    selector: '[mltag]'
})

/* Export directive class. */
export class MultiLingualDirective {
    /* Constructor. */
    constructor(
        private el: ElementRef
    ) {
        /* Stub. */
    }

    public ngAfterViewInit () {
        let
        tag = this.el.nativeElement.getAttribute('mltag'),
        translation = this.getTranslation(tag);
        if ( translation !== tag ) {
            this.el.nativeElement.innerHTML = translation;
        }
    }

    /**
     * Get Translation
     * Looks up a translation in the translations json.
     * @param  {mltag}:string       - The reference tag.
     * @return {translation}:string - The translation.
     */
    private getTranslation (mlcode:string):string {
        /* Look for translation... */
        if ( Translations['eng'][mlcode] ) {
            console.log('translation found: ', Translations['eng'][mlcode]);
            return Translations['eng'][mlcode];
        }

        /* ...otherwise return origin string. */
        return mlcode;
    }
}
