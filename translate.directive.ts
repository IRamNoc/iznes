import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

/* Package imports. */
import {MultilingualService} from './multilingual.service';

@Directive({
    selector: '[translate]'
})
export class TranslateDirective implements AfterViewInit {
    private subscription: any;
    private translationsOrigin = <any>[];

    constructor(
        private el: ElementRef,
        private _translate: MultilingualService
    ) {

    }

    public ngAfterViewInit() {
        // this.subscription = this._translate.getLanguage.subscribe((data) => {
        //     this.translate();
        // });
        console.log('ngAfterViewInit TRANSLATE DIRECTIVE');
        if (this.el.nativeElement.hasAttribute('placeholder')) {
            console.log('placeholder found');
            // check in all translations saved if we found the translated version
            const placeholder = this.el.nativeElement.getAttribute('placeholder');
            const trFound = this.translationsOrigin.find((item) => item.origin === placeholder);
            if (this._translate.currentLanguage() !== 'en-Latn' && trFound !== undefined) { // found
                // placeholder = english string
                console.log('found placeholder = ' + trFound.origin);
                this.el.nativeElement.setAttribute('placeholder', trFound.origin);
            } else {
                // placeholder = placeholder attribute
                const translation = this.translate(placeholder);
                console.log(placeholder, translation);
                if (translation) {
                    console.log('not found placeholder = ' + translation);
                    // push into saved translations if not english
                    if (placeholder !== translation) {
                        this.translationsOrigin.push({origin: placeholder, translation: translation});
                    }
                    // update placeholder
                    this.el.nativeElement.setAttribute('placeholder', translation);
                }
            }
        }

    }

    translate(value: string): any {
        console.log('translate TRANSLATE DIRECTIVE');
        return this._translate.translate(value, null);
    }

}
