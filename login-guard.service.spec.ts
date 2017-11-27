import {TestBed, inject, ComponentFixture} from '@angular/core/testing';
import {NgRedux} from '@angular-redux/store';
import {LoginGuardService} from './login-guard.service';
import {SetlLoginModule} from './login.module';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {RouterModule} from '@angular/router';
import {Routes, Router} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import {MyUserMockService, MyUserService} from '@setl/core-req-services';
import {MemberSocketService} from '@setl/websocket-service';

const ROUTES: Routes = [];

class MemberSocketMockService {
    token: string = '';
}


class NgReduxMock extends NgRedux {
    callback: any;
    state: any;

    constructor() {
        super();
        this.state = {user: {authentication: {isLogin: true}}};
    }

    subscribe(callBack) {
        this.callback = callBack;
    }

    triggerUpdate(data) {
        this.state = data;
        this.callback(data);
    }

    getState() {
        return this.state;
    }
}

class ToasterMock extends ToasterService {
    pop(type, message) {

    }
}


describe('LoginGuardService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ToasterModule,
                RouterModule.forRoot(ROUTES),
            ],
            providers: [
                LoginGuardService,
                {provide: NgRedux, useClass: NgReduxMock},
                AlertsService,
                {provide: ToasterService, useClass: ToasterMock},
                {provide: APP_BASE_HREF, useValue: '/'},
                {provide: MyUserService, useClass: MyUserMockService},
                {provide: MemberSocketService, useClass: MemberSocketMockService}
            ]
        });
    });

    it('should be created', inject([LoginGuardService], (service: LoginGuardService) => {
        expect(service).toBeTruthy();
    }));

    it('when user is login, canActivate should return true',
        inject([LoginGuardService], (service: LoginGuardService) => {
            expect(service.canActivate(<any>{}, <any>{})).toBeTruthy();
        }));

    it('when user is not login, canActivate should return false',
        inject([LoginGuardService, NgRedux], (service: LoginGuardService, ngRedux: NgRedux) => {
            ngRedux.triggerUpdate({user: {authentication: {isLogin: false}}});
            expect(service.canActivate(<any>{}, <any>{})).toBeFalsy();
        }));

    it('when user loged in, isLogin should set to true',
        inject([LoginGuardService, NgRedux], (service: LoginGuardService, ngRedux: NgRedux) => {
            ngRedux.triggerUpdate({user: {authentication: {isLogin: true}}});
            expect(service.isLogin).toBeTruthy();
        }));

    it('when user loged out, isLogin should set to false',
        inject([LoginGuardService, NgRedux], (service: LoginGuardService, ngRedux: NgRedux) => {
            ngRedux.triggerUpdate({user: {authentication: {isLogin: false}}});
            expect(service.isLogin).toBeFalsy();
        }));
});
