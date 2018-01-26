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
            Translations['core'][this.language][mlcode] &&
            Translations['core'][this.language][mlcode] !== ''
        ) {
            /* ...and return it, if we have it. */
            return Translations['core'][this.language][mlcode];
        }

        /* ...otherwise return origin string. */
        return false;
    }

    /**
     * Get Translation by string
     * ---------------
     * Convert string into mlcode then :
     * Looks up a translation in the translations json using an mlcode.
     *
     * @param {string} str - The string to translate.
     *
     * @return {string|boolean} - The translation or false.
     */
    public getTranslationByString(str: string): string | boolean {
        if (str !== '') {
            let mlcode = 'txt_' + str.replace(/[^a-z0-9A-Z]/g, '').toLowerCase();
            if (mlcode.length > 34) {
                const sha256 = require('sha256');
                const hash = sha256(mlcode);
                mlcode = mlcode.substring(0, 34) + hash.substring(10, 20);
            }
            /* Look for translation... */
            // console.log('multilingual service to found', this.language, mlcode, Translations['core'][this.language][mlcode]);
            if (
                Translations &&
                Translations['core'] &&
                Translations['core'][this.language] &&
                Translations['core'][this.language][mlcode] &&
                Translations['core'][this.language][mlcode] !== ''
            ) {
                /* ...and return it, if we have it. */
                // console.log('multilingual service found', this.language, mlcode, Translations['core'][this.language][mlcode]);
                return Translations['core'][this.language][mlcode];
            } else {
                console.log('*******************************************');
                console.log('TranslationByString NOT FOUND : ');
                console.log('Language : ' + this.language);
                console.log('String : ' + str);
                console.log('Mltag generated : ' + mlcode);
                console.log('*******************************************');
            }
        }

        /* ...otherwise return origin string. */
        return str;
    }

}
