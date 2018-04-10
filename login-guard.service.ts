import {Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,

} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NgRedux, select} from '@angular-redux/store';
import {ToasterService} from 'angular2-toaster';
import {MyUserService} from '@setl/core-req-services';
import {Subscription} from 'rxjs/Subscription';
import {APP_CONFIG, AppConfig, immutableHelper} from '@setl/utils';
import {getMyDetail} from '@setl/core-store';
import * as _ from 'lodash';

@Injectable()
export class LoginGuardService implements CanActivate {
    isLogin: boolean;
    redirect = '';

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    @select(['user', 'authentication', 'isLogin']) isLoginOb;

    constructor(private ngRedux: NgRedux<any>,
                @Inject(APP_CONFIG) public appConfig: AppConfig,
                private toasterService: ToasterService,
                private router: Router,
                private _myUserService: MyUserService) {
        this.isLogin = false;

        // Reduce observable subscription
        this.subscriptionsArray.push(this.isLoginOb.subscribe(isLogin => {
            this.isLogin = isLogin;
        }));
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.isLogin) {
            this.redirect = state['url'];
            this.toasterService.pop('warning', 'Session Expired!');
            this.router.navigateByUrl('');
        } else {
            // refresh token.
            this._myUserService.defaultRefreshToken(this.ngRedux);

            if (this.isMenuDisabled(state['url'])) {
                this.toasterService.pop('warning', 'This page is not available in the current version.');

                return false;
            }
        }
        return this.isLogin;
    }

    isMenuDisabled(url: string): boolean {
        const disabledMenus: Array<string> = _.get(this.appConfig, ['menuSpec', 'disabled'], []);
        return disabledMenus.indexOf(url) !== -1;
    }

}
