import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { select } from '@angular-redux/store';
import { filter, switchMap } from 'rxjs/operators';

import { AppConfig } from '../../appConfig/appConfig.model';
import { APP_CONFIG } from '../../appConfig/appConfig';

@Injectable()
export class MenuSpecService {

    @select(['user', 'siteSettings', 'siteMenu']) getSiteMenu: Observable<any>;

    constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) { }

    getMenuSpec() {
        /*
         * get the menuSpec from redux and check if;
         * - it has been retrieved previously (if not, we don't return it)
         * - if it is empty, grab the default menuSpec from appConfig
         */
        return this.getSiteMenu.pipe(filter(m => m.fetched), switchMap((m) => {
            if (this.isMenuSpecEmpty(m)) {
                return of(Object.assign({}, this.appConfig.menuSpec, { hidden: this.appConfig.nonMenuLink }));
            }

            return of(m);
        }));
    }

    private isMenuSpecEmpty(menuSpec): boolean {
        return !menuSpec || Object.keys(menuSpec).length === 1;
    }
}
