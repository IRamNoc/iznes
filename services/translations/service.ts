import {Injectable} from '@angular/core';

@Injectable()
export class TranslationService {
    private static instance: TranslationService;
    translationList: any;

    constructor() {
    }

    /* Singleton */
    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    /* Getter */
    getTranslationList() {
        return this.translationList;
    }

    /* Setter */
    setTranslationList(translations: any): any {
        this.translationList = translations;
    }
}
