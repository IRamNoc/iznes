import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,

} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NgRedux, select} from '@angular-redux/store';
import {getAuthentication} from '@setl/core-store';
import {ToasterService} from 'angular2-toaster';
import {MyUserService} from '@setl/core-req-services';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class LoginGuardService implements CanActivate {
    isLogin: boolean;
    redirect: string;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    @select(['user', 'authentication', 'isLogin']) isLoginOb;

    constructor(private ngRedux: NgRedux<any>,
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
        }
        return this.isLogin;
    }

}
