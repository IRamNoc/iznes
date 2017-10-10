/* Angular/vendor imports. */
import {Injectable} from '@angular/core';

/* Package Imports. */
import { Translations } from './translations';

/* Service Class. */
@Injectable()
export class MultilingualService {

    /* Constructor. */
    constructor () {
        /* Stub. */
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
    public getTranslation (mlcode:string):string|boolean {
        /* Look for translation... */
        if (
            Translations &&
            Translations['core'] &&
            Translations['core']['fra'] &&
            Translations['core']['fra'][mlcode]
        ) {
            /* ...and return it, if we have it. */
            return Translations['core']['fra'][mlcode];
        }

        /* ...otherwise return origin string. */
        return false;
    }

}
