import { TestBed, inject, async } from '@angular/core/testing';
import { LoginGuardService } from './login-guard.service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import {
    CoreTestUtilModule,
    MyUserServiceMock,
    MemberSocketServiceMock,
    AlertsServiceMock,
    ToasterServiceMock,
} from '@setl/core-test-util';
import { MyUserService } from '@setl/core-req-services';
import { MemberSocketService } from '@setl/websocket-service';
import { Subject } from 'rxjs/Subject';
import { APP_CONFIG } from '@setl/utils';
import { MenuSpecService } from '@setl/utils/services/menuSpec/service';

const environment = {
    logoID: '',
    logoUrl: '',
    platform: '',
};

describe('LoginGuardService', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ToasterModule,
                NgReduxTestingModule,
                CoreTestUtilModule,
            ],
            providers: [
                { provide: AlertsService, useClass: AlertsServiceMock },
                { provide: ToasterService, useClass: ToasterServiceMock },
                LoginGuardService,
                { provide: MyUserService, useClass: MyUserServiceMock },
                { provide: MemberSocketService, useClass: MemberSocketServiceMock },
                {
                    provide: APP_CONFIG,
                    useValue: environment,
                },
                MenuSpecService,
            ],
        });

        MockNgRedux.reset();

    }));

    it('should be created', inject([LoginGuardService], (service: LoginGuardService) => {
        expect(service).toBeTruthy();
    }));

    it('when user is login, canActivate should return true',
       inject([LoginGuardService], (service: LoginGuardService) => {
            const isLoginStub: Subject<boolean> = MockNgRedux.getSelectorStub<any, any>(['user', 'authentication', 'isLogin']);
            isLoginStub.next(true);
            expect(service.canActivate(<any>{}, <any>{})).toBeTruthy();
        }));

    it('when user is not login, canActivate should return false',
       inject([LoginGuardService], (service: LoginGuardService) => {
            const isLoginStub: Subject<boolean> = MockNgRedux.getSelectorStub<any, any>(['user', 'authentication', 'isLogin']);
            isLoginStub.next(false);
            expect(service.canActivate(<any>{}, <any>{})).toBeFalsy();
        }));

});
