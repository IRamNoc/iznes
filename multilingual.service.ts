/* Angular/vendor imports. */
import {Injectable} from '@angular/core';

/* Package Imports. */
import {Translations} from './translations';

import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';

/* Service Class. */
@Injectable()
export class MultilingualService {

    @select(['user', 'siteSettings', 'language']) getLanguage;

    language;
    subscriptionsArray: Array<Subscription> = [];

    /* Constructor. */
    constructor() {
        /* Stub. */
        this.subscriptionsArray.push(
            this.getLanguage.subscribe(
                (language) => {
                    this.language = language;
                }
            )
        );
    }

    /**
     * Get Translation
     * ---------------
     * Looks up a translation in the translations json using an mlcode.
     *
     * @param {string} mltag - The reference tag.
     *
     * @return {string|boolean} - The translation or false.
     */
    public getTranslation(mlcode: string): string | boolean {
        /* Look for translation... */
        if (
            Translations &&
            Translations['core'] &&
            Translations['core'][this.language] &&
            Translations['core'][this.language][mlcode]
        ) {
            /* ...and return it, if we have it. */
            return Translations['core'][this.language][mlcode];
        }

        /* ...otherwise return origin string. */
        return false;
    }

}
