import {Injectable} from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NgRedux} from '@angular-redux/store';
import {getAuthentication} from '@setl/core-store';
import {ToasterService} from 'angular2-toaster';

@Injectable()
export class LoginGuardService implements CanActivate {
    isLogin: boolean;

    constructor(private ngRedux: NgRedux<any>,
                private toasterService: ToasterService) {
        this.isLogin = false;
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.isLogin) {
            this.toasterService.pop('warning', 'test');
            console.log('test');
        }
        return this.isLogin;
    }

    updateState() {
        const authenData = getAuthentication(this.ngRedux.getState());


        this.isLogin = authenData.isLogin;
    }

}
