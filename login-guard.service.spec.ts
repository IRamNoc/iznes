import {TestBed, inject, ComponentFixture, async} from '@angular/core/testing';
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
import {NgReduxTestingModule, MockNgRedux} from '@angular-redux/store/testing';
import {Subject} from "rxjs/Subject";

const ROUTES: Routes = [];

class MemberSocketMockService {
    token: string = '';
}

class ToasterMock extends ToasterService {
    pop(type, message) {

    }
}


describe('LoginGuardService', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ToasterModule,
                RouterModule.forRoot(ROUTES),
                NgReduxTestingModule
            ],
            providers: [
                LoginGuardService,
                // {provide: NgRedux, useClass: NgReduxMock},
                AlertsService,
                {provide: ToasterService, useClass: ToasterMock},
                {provide: APP_BASE_HREF, useValue: '/'},
                {provide: MyUserService, useClass: MyUserMockService},
                {provide: MemberSocketService, useClass: MemberSocketMockService}
            ]
        });

        MockNgRedux.reset();

    }));

    it('should be created', inject([LoginGuardService], (service: LoginGuardService) => {
        expect(service).toBeTruthy();
    }));

    it('when user is login, canActivate should return true',
        inject([LoginGuardService], (service: LoginGuardService) => {
            const isLoginStub: Subject<number> = MockNgRedux.getSelectorStub<any, any>(['user', 'authentication', 'isLogin']);
            isLoginStub.next(true);
            expect(service.canActivate(<any>{}, <any>{})).toBeTruthy();
        }));

    it('when user is not login, canActivate should return false',
        inject([LoginGuardService], (service: LoginGuardService) => {
            const isLoginStub: Subject<number> = MockNgRedux.getSelectorStub<any, any>(['user', 'authentication', 'isLogin']);
            isLoginStub.next(false);
            expect(service.canActivate(<any>{}, <any>{})).toBeFalsy();
        }));

    it('when user logged in, isLogin should set to true',
        inject([LoginGuardService], (service: LoginGuardService) => {
            const isLoginStub: Subject<number> = MockNgRedux.getSelectorStub<any, any>(['user', 'authentication', 'isLogin']);
            isLoginStub.next(true);
            expect(service.isLogin).toBeTruthy();
        }));

    it('when user loged out, isLogin should set to false',
        inject([LoginGuardService], (service: LoginGuardService) => {
            const isLoginStub: Subject<number> = MockNgRedux.getSelectorStub<any, any>(['user', 'authentication', 'isLogin']);
            isLoginStub.next(false);
            expect(service.isLogin).toBeFalsy();
        }));
});
