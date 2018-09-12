import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { AlertsService } from '@setl/jaspero-ng2-alerts';

import { SetlLoginComponent } from './login.component';
import {
    CoreTestUtilModule,
    MyUserServiceMock,
    MemberSocketServiceMock,
    AlertsServiceMock,
    ToasterServiceMock,
    AccountsServiceMock,
    ChainServiceMock,
    ChannelServiceMock,
    InitialisationServiceMock,
    MyWalletsServiceMock,
    PermissionGroupServiceMock,
    RouterMock,
} from '@setl/core-test-util';
import { APP_CONFIG, LogServiceMock, LogService, ConfirmationService } from '@setl/utils';
import {
    MyUserService,
    MyWalletsService,
    ChannelService,
    AccountsService,
    PermissionGroupService,
    ChainService,
    InitialisationService,
} from '@setl/core-req-services';
import { MemberSocketService } from '@setl/websocket-service';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ClarityModule } from '@clr/angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { LoginGuardService } from './login-guard.service';
import { MenuSpecService } from '@setl/utils/services/menuSpec/service';

import { MultilingualService } from '@setl/multilingual';
const MultilingualServiceSpy = jasmine.createSpyObj('MultilingualService', ['translate']);

const environment = {
    logoID: '',
    logoUrl: '',
    platform: '',
};

const ActivatedRouteStub = {
    params: Observable.of({ token: '' }),
    queryParams: Observable.of({ email: '', error: '' }),
    snapshot: {
        params: {
            email: '',
        },
    },
};

@Component({
    selector: 'app-password-tooltip',
    template: '<p>Mock Password tooltip</p>',
})
class MockPasswordTooltip {}

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('SetlLoginComComponent', () => {
    let component: SetlLoginComponent;
    let fixture: ComponentFixture<SetlLoginComponent>;
    let element: Element;
    const memberSocketService = new MemberSocketService();
    const myUserServiceMock = new MyUserServiceMock(memberSocketService);
    const alertServiceMock = new AlertsServiceMock();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                NgReduxTestingModule,
                ToasterModule,
                CoreTestUtilModule,
                ClarityModule,
            ],
            declarations: [
                SetlLoginComponent,
                TranslatePipe,
                MockPasswordTooltip,
            ],
            providers: [
                { provide: MyUserService, useValue: myUserServiceMock },
                { provide: MemberSocketService, useValue: memberSocketService },
                { provide: MyWalletsService, useClass: MyWalletsServiceMock },
                { provide: ChannelService, useClass: ChannelServiceMock },
                { provide: AccountsService, useClass: AccountsServiceMock },
                { provide: PermissionGroupService, useClass: PermissionGroupServiceMock },
                { provide: ChainService, useClass: ChainServiceMock },
                { provide: InitialisationService, useClass: InitialisationServiceMock },
                { provide: MemberSocketService, useClass: MemberSocketServiceMock },
                { provide: ToasterService, useClass: ToasterServiceMock },
                { provide: AlertsService, useValue: alertServiceMock },
                { provide: Router, useValue: RouterMock },
                { provide: ActivatedRoute, useValue: ActivatedRouteStub },
                { provide: MultilingualService, useValue: MultilingualServiceSpy },
                ConfirmationService,
                {
                    provide: APP_CONFIG,
                    useValue: environment,
                },
                LoginGuardService,
                { provide: LogService, useClass: LogServiceMock },
                MenuSpecService,
            ],
        })
            .compileComponents();

        MockNgRedux.reset();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SetlLoginComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should has the correct input fields', async(() => {
        fixture.whenStable().then(() => {
            expect(element.querySelector('#username-field')).toBeTruthy();
            expect(element.querySelector('#password-field')).toBeTruthy();
            expect(element.querySelector('#login-submit')).toBeTruthy();
        });
    }),
    );

    it('update method should be called, when authentication changed', async(() => {
        spyOn(component, 'updateState');
        const authenticationStub: Subject<any> = MockNgRedux.getSelectorStub<any, any>(['user', 'authentication']);
        authenticationStub.next({ isLogin: true });
        expect(component.updateState).toHaveBeenCalled();
    }));

    it('Initialisation memberInitialisation static method should be call, when updateState is call', async(() => {
        component.isLogin = false;
        const authenticationStub: Subject<any> = MockNgRedux.getSelectorStub<any, any>(['user', 'authentication']);
        spyOn(InitialisationService, 'membernodeInitialisation');
        authenticationStub.next({ isLogin: true, token: 'token' });

        expect(InitialisationService.membernodeInitialisation).toHaveBeenCalled();
    }));

    it('If Login button click, login method should be called', async(() => {
        // Fill username and password
        component.loginForm.controls.username.setValue('sample name');
        component.loginForm.controls.password.setValue('sample password');
        fixture.detectChanges();

        // click on login button
        spyOn(component, 'login');

        const button = fixture.debugElement.nativeElement.querySelector('#login-submit');
        button.click();

        fixture.whenStable().then(() => {
            expect(component.login).toHaveBeenCalled();
        });

        // Now login method should be called now.
        expect(component.login).toHaveBeenCalled();

    }));

    it('If Login button click, login method should be called', async(() => {
        // Fill username and password
        component.loginForm.controls.username.setValue('sample name');
        component.loginForm.controls.password.setValue('sample password');
        fixture.detectChanges();

        // click on login button
        spyOn(component, 'login');

        const button = fixture.debugElement.nativeElement.querySelector('#login-submit');
        button.click();

        fixture.whenStable().then(() => {
            expect(component.login).toHaveBeenCalled();
        });

        // Now login method should be called now.
        expect(component.login).toHaveBeenCalled();

    }));

    it('handleLoginFailMessage should handle response correctly',
       async(() => {

            // status: fail
           let response = [
               '', { Data: [{ Status: 'fail' }] },
           ];

           spyOn(component, 'showLoginErrorMessage');
           component.handleLoginFailMessage(response);
           expect(component.showLoginErrorMessage).toHaveBeenCalledWith(
                'warning',
                '<span mltag="txt_loginerror" class="text-warning">Invalid email address or password!</span>',
            );

            // status: locked
           response = [
               '', { Data: [{ Status: 'locked' }] },
           ];

           component.handleLoginFailMessage(response);
           expect(component.showLoginErrorMessage).toHaveBeenCalledWith(
                'info',
                '<span mltag="txt_accountlocked" class="text-warning">Sorry, your account has been locked. ' +
                'Please contact Setl support.</span>',
            );

            // status:
           response = [
               '', { Data: [{ Status: 'random' }] },
           ];

           component.handleLoginFailMessage(response);
           expect(component.showLoginErrorMessage).toHaveBeenCalledWith(
                'error',
                '<span mltag="txt_loginproblem" class="text-warning">Sorry, there was a problem logging in, please try again.</span>',
            );
       }),
    );

    it('AlertsService should called with error type', () => {
        spyOn(alertServiceMock, 'create');

        const response = [
            '', { Data: [{ Status: 'fail' }] },
        ];

        component.showLoginErrorMessage('error', response);

        expect(alertServiceMock.create).toHaveBeenCalledWith(
            'error',
            response,
            { buttonMessage: 'Please try again to log in' },
        );

    });

    it('login method: if form is valid, loginRequest should be called', () => {
        spyOn(myUserServiceMock, 'loginRequest');

        const formValue = {
            username: 'user name',
            password: 'user password',
        };

        component.loginForm.controls['username'].setValue(formValue.username);
        component.loginForm.controls['password'].setValue(formValue.password);
        component.login(formValue);
        expect(myUserServiceMock.loginRequest).toHaveBeenCalledWith({
            username: 'user name',
            password: 'user password',
        });
    });

    it('login method: if form is invalid, loginRequest should be not be called', () => {
        spyOn(myUserServiceMock, 'loginRequest');

        const formValue = {
            username: 'user name',
            password: '',
        };

        component.loginForm.controls['username'].setValue(formValue.username);
        component.loginForm.controls['password'].setValue(formValue.password);
        component.login(formValue);
        expect(myUserServiceMock.loginRequest).not.toHaveBeenCalled();
    });
});
