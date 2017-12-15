import {TestBed, inject, async} from '@angular/core/testing';
import {LoginGuardService} from './login-guard.service';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {NgReduxTestingModule, MockNgRedux} from '@angular-redux/store/testing';
import {
    CoreTestUtilModule,
    MyUserServiceMock,
    MemberSocketServiceMock,
    AlertsServiceMock,
    ToasterServiceMock
} from '@setl/core-test-util';
import {MyUserService} from '@setl/core-req-services';
import {MemberSocketService} from '@setl/websocket-service';


describe('LoginGuardService', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ToasterModule,
                NgReduxTestingModule,
                CoreTestUtilModule
            ],
            providers: [
                {provide: AlertsService, useClass: AlertsServiceMock},
                {provide: ToasterService, useClass: ToasterServiceMock},
                LoginGuardService,
                {provide: MyUserService, useClass: MyUserServiceMock},
                {provide: MemberSocketService, useClass: MemberSocketServiceMock}
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
