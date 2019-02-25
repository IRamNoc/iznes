import { Inject, Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable ,  Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgRedux, select } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

import { MyUserService } from '@setl/core-req-services';
import { APP_CONFIG, AppConfig, immutableHelper, MenuItem } from '@setl/utils';
import { MenuSpecService } from '@setl/utils/services/menuSpec/service';

@Injectable()
export class LoginGuardService implements CanActivate {

    private isLogin: boolean;
    private menuSpec: {};
    private redirect = '';
    private userTypeStr: string;
    private subscriptionsArray: Subscription[] = [];

    @select(['user', 'authentication', 'isLogin']) isLoginOb;
    @select(['user', 'myDetail', 'userTypeStr']) userTypeOb;

    constructor(private ngRedux: NgRedux<any>,
                @Inject(APP_CONFIG) public appConfig: AppConfig,
                private toasterService: ToasterService,
                private router: Router,
                private menuSpecService: MenuSpecService) {
        this.isLogin = false;

        this.subscriptionsArray.push(this.isLoginOb.subscribe((isLogin) => {
            this.isLogin = isLogin;
        }));

        this.subscriptionsArray.push(this.userTypeOb.subscribe((userTypeStr) => {
            this.userTypeStr = userTypeStr;
        }));
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Promise<boolean> {
        /*
         * isLogin will commonly be false, as it will only be true
         * when coming from the login screen.
         */
        if (!this.isLogin) {
            this.redirect = state['url'];
            this.toasterService.pop('warning', 'Session Expired!');
            this.router.navigateByUrl('');
        } else {
            /*
             * get the menuSpec from redux, then perform the login checks
             */
            return new Promise((resolve) => {
                this.menuSpecService.getMenuSpec().pipe(first()).subscribe((menuSpec) => {
                    this.menuSpec = menuSpec;

                    if (this.isMenuDisabled(state['url'])) {
                        // 01/09/2018 commented out, as using the disable status to disable the menu in rendering.
                        // this.toasterService.pop(
                        //     'warning',
                        //     'This page is not available in the current version.');

                        resolve(false);
                    }
                    // check if the url is allow for the user
                    const applyRestrictUrl = this.appConfig.applyRestrictUrl || false;
                    if (applyRestrictUrl) {
                        const allowedUrls = this.getUserAllowUrl();

                        if (!isUrlAllow(allowedUrls, state['url'])) {
                            resolve(false);
                        }
                    }

                    resolve(true);
                });
            });
        }
    }

    isMenuDisabled(url: string): boolean {
        const disabledMenus: string[] = _.get(this.menuSpec, ['disabled'], []);

        return disabledMenus.indexOf(url) !== -1;
    }

    getUserAllowUrl(): AllowURL[] {
        let allowUrls: AllowURL[] = [];

        const menuSpecs = this.menuSpec;

        const topProfileMenu = _.get(menuSpecs, ['top', 'profile', this.userTypeStr], []);
        const sideMenu = _.get(menuSpecs, ['side', this.userTypeStr], []);
        const disabledMenu = _.get(menuSpecs, 'disabled', []);
        const nonMenuLink = _.get(menuSpecs, ['hidden', this.userTypeStr], []);

        // top profile menu urls
        topProfileMenu.forEach((item) => {
            allowUrls.push({
                static_link: item.router_link,
                dynamic_link: item.dynamic_link,
            });
        });

        // side menu urls
        sideMenu.forEach((item) => {
            allowUrls.push(...getSideMenuUrl(item));
        });

        // non-menu link
        nonMenuLink.forEach((item) => {
            allowUrls.push({
                static_link: '',
                dynamic_link: item,
            });
        });

        // disabled
        allowUrls = allowUrls.filter((item) => {
            return !disabledMenu.includes(item.dynamic_link) &&
                !disabledMenu.includes(item.static_link);
        });

        return allowUrls;
    }

}

/**
 * get side menu url recursively.
 * @param {MenuItem} sideMenu
 * @return {string[]}
 */
function getSideMenuUrl(sideMenu: MenuItem): AllowURL[] {
    const urls: AllowURL[] = [];

    if (typeof sideMenu.children === 'undefined') {
        urls.push({
            static_link: sideMenu.router_link,
            dynamic_link: sideMenu.dynamic_link,
        });
        return urls;
    }

    for (const child of sideMenu.children) {
        urls.push(...getSideMenuUrl(child));
    }

    return urls;
}

/**
 * check if url is allowed.
 * The router_link and dynamic_link will be check.
 * dynamic_link is a regex pattern
 * @param {{static_link: string; dynamic_link: string}[]} allowUrls
 * @param {string} urlToCheck
 * @return {boolean}
 */
function isUrlAllow(allowUrls: AllowURL[],
                    urlToCheck: string): boolean {
    let rVal = false;

    for (const item of allowUrls) {
        // static link match
        if (item.static_link === urlToCheck) {
            rVal = true;
            break;
        }

        // dynamic link match
        const regExStr = _.get(item, 'dynamic_link', false);
        if (regExStr) {
            const dynamicLinkRegex = new RegExp(regExStr);
            if (dynamicLinkRegex.test(urlToCheck)) {
                rVal = true;
                break;
            }
        }
    }

    return rVal;
}

type AllowURL = { static_link: string, dynamic_link: string };
