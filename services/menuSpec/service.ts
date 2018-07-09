import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {select} from "@angular-redux/store";
import {filter} from "rxjs/operators"

@Injectable()
export class MenuSpecService {

    @select(['user', 'siteSettings', 'siteMenu']) getSiteMenu: Observable<any>;

    constructor() {

    }

    getMenuSpec() {
        return this.getSiteMenu.pipe(filter(m => !!Object.keys(m).length));
    }
}
