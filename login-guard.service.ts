import {Injectable} from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,

} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NgRedux} from '@angular-redux/store';
import {getAuthentication} from '@setl/core-store';
import {ToasterService} from 'angular2-toaster';
import {MyUserService} from '@setl/core-req-services';

@Injectable()
export class LoginGuardService implements CanActivate {
    isLogin: boolean;

    constructor(private ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private router: Router,
                private _myUserService: MyUserService) {
        this.isLogin = false;
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.isLogin) {
            this.toasterService.pop('warning', 'Session Expired!');
            this.router.navigateByUrl('');

        } else {
            // refresh token.
            this._myUserService.defaultRefreshToken(this.ngRedux);
        }
        return this.isLogin;
    }

    updateState() {
        const authenData = getAuthentication(this.ngRedux.getState());


        this.isLogin = authenData.isLogin;
    }

}
