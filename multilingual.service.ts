/* Angular/vendor imports. */
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {select} from '@angular-redux/store';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Translations} from './translations';

/* Service Class. */
@Injectable()
export class MultilingualService {

    language;

    private translations = [];
    private apiUrl = 'http://si-babel01:8080';
    private subscriptionsArray: Array<Subscription> = [];


    @select(['user', 'siteSettings', 'language']) getLanguage;

    /* Constructor. */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: Http,
    ) {
        /* Stub. */
        this.subscriptionsArray.push(this.getLanguage.subscribe((language) => this.language = language));
    }

    public currentLanguage(): string {
        return this.language;
    }

    public updateLanguage(language: string): void {
        // set current language
        this.language = language;
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
            Translations['core'][this.language][mlcode] !== undefined
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
            if (
                Translations &&
                Translations['core'] &&
                Translations['core'][this.language] &&
                Translations['core'][this.language][mlcode]
            ) {
                /* ...and return it, if we have it. */
                return Translations['core'][this.language][mlcode];
            }
        }

        /* ...otherwise return origin string. */
        return str;
    }

    private parseString(value: any, params?: any): string {
        let str = '';
        // console.log('FUNCTION parseString FOR ' + value + ' IN ' + this.language);
        if (value !== '' && value !== undefined) {
            // convert string to mltag
            let mltag = 'txt_' + value.replace(/[^a-z0-9A-Z]/g, '').toLowerCase();
            if (mltag.length > 34) {
                const sha256 = require('sha256');
                const hash = sha256(mltag);
                mltag = mltag.substring(0, 34) + hash.substring(10, 20);
            }

            const foundTag = this.getTranslation(mltag);
            // mltag not found or empty return original value
            str = (foundTag && foundTag !== '') ? foundTag : value;

            // replace placeholders in dynamic strings by values in params
            if (params !== undefined) {
                for (const param in params) {
                    str = str.split('@' + param + '@').join((params[param] !== '') ? params[param] : '[EMPTY]');
                }
            }

            // if (!foundTag) {
            //     console.log('%c *******************************************', 'color: red;');
            //     console.log('%c TranslationByString NOT FOUND : ', 'color: red;');
            //     console.log('%c Language : ' + this.language, 'color: red;');
            //     console.log('%c String : ' + value, 'color: red;');
            //     console.log('%c Translation : ' + str, 'color: red;');
            //     console.log('%c Mltag generated : ' + mltag, 'color: red;');
            //     console.log('%c *******************************************', 'color: red;');
            // } else {
            //     console.log('%c *******************************************', 'color: green;');
            //     console.log('%c TranslationByString FOUND : ', 'color: green;');
            //     console.log('%c Language : ' + this.language, 'color: green;');
            //     console.log('%c String : ' + value, 'color: green;');
            //     console.log('%c Translation : ' + str, 'color: green;');
            //     console.log('%c Mltag generated : ' + mltag, 'color: green;');
            //     console.log('%c *******************************************', 'color: green;');
            // }

            const inTranslationArray = this.translations.find((item) => item.original === value);

            if (!inTranslationArray && foundTag === false) { // only not found
                this.translations.push(
                    {from: this.router.url, original: value, mltag: mltag, translation: str, found: (foundTag) ? true : foundTag}
                );
            }
        }

        return str;
    }

    private process(value: any, params?: any): any {
        let str: any;
        if (value !== '' && value !== undefined) {
            // parse string or array of strings
            if (typeof value !== 'string') {
                str = [];
                if (Array.isArray(value)) {
                    // if array -> loop on each
                    for (let elt of value) {
                        // if object json -> translate
                        if (typeof elt === 'object') {
                            // ng-select
                            if (elt.text) {
                                str.push({id: elt.id, text: this.parseString(elt.text)});
                            }
                        } else {
                            // if array of strings
                            str.push(this.parseString(elt));
                        }
                    }
                } else {
                    // if not array
                    if (typeof value === 'object') {
                        str = {id: value.id, text: this.parseString(value.text)};
                    } else {
                        str = this.parseString(value, params);
                    }
                }
            } else {
                str = this.parseString(value, params);
            }
        } else {
            return value;
        }
        return str;
    }

    public translate(value: any, params?: any) {
        if (value !== '' && value !== undefined) {
            // console.log('FUNCTION TRANSLATE FOR ' + value + ' IN ' + this.language);
            return this.process(value, params);
        } else {
            return value;
        }
    }

    public getTranslations() {
        return this.translations;
    }

    async addNewTranslation(formData): Promise<any> {
        // return {ok: true};
        // this.apiUrl = 'http://10.0.25.87:8000'; // debug on D.D
        this.apiUrl = 'http://10.0.2.72:8000'; // prod
        try {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            const options = new RequestOptions({ headers: myHeaders});
            const response = await this.http
                .post(this.apiUrl + '/api/sites/1/whitelist-translations', formData, options)
                .toPromise();
            return response.json();
        } catch (error) {
            return await this.handleError(error);
        }
    }

    private handleError(error: any): Promise<any> {
        if (!error.ok) {
            return error;
        }
        return;
    }
}
