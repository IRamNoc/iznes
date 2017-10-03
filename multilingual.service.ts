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
     * @param {mltag} string - The reference tag.
     *
     * @return {translation} string - The translation.
     */
    public getTranslation (mlcode:string):string {
        /* Look for translation... */
        if (
            Translations &&
            Translations['core'] &&
            Translations['core']['fra'] &&
            Translations['core']['fra'][mlcode]
        ) {
            /* and return it if we have it. */
            console.log('translation found: ', Translations['core']['fra'][mlcode]);
            return Translations['core']['fra'][mlcode];
        }

        /* ...otherwise return origin string. */
        return mlcode;
    }

}
