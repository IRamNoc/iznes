import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {select} from "@angular-redux/store";

@Injectable()
export class MenuSpecService {

    @select(['user', 'siteSettings', 'siteMenu']) getSiteMenu: Observable<any>;

    constructor() {

    }

    getMenuSpec() {
        return this.getSiteMenu.filter(m => !!Object.keys(m).length);
    }
}
