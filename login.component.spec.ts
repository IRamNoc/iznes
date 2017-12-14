import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {NgReduxTestingModule, MockNgRedux} from '@angular-redux/store/testing';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {AlertsService} from '@setl/jaspero-ng2-alerts';

import {SetlLoginComponent} from './login.component';
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
    PermissionGroupServiceMock
} from '@setl/core-test-util';
import {
    MyUserService,
    MyWalletsService,
    ChannelService,
    AccountsService,
    PermissionGroupService,
    ChainService,
    InitialisationService
} from '@setl/core-req-services';
import {MemberSocketService} from '@setl/websocket-service';

describe('SetlLoginComComponent', () => {
    let component: SetlLoginComponent;
    let fixture: ComponentFixture<SetlLoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                NgReduxTestingModule,
                ToasterModule,
                CoreTestUtilModule
            ],
            declarations: [SetlLoginComponent],
            providers: [
                {provide: MyUserService, useClass: MyUserServiceMock},
                {provide: MemberSocketService, useClass: MemberSocketServiceMock},
                {provide: MyWalletsService, useClass: MyWalletsServiceMock},
                {provide: ChannelService, useClass: ChannelServiceMock},
                {provide: AccountsService, useClass: AccountsServiceMock},
                {provide: PermissionGroupService, useClass: PermissionGroupServiceMock},
                {provide: ChainService, useClass: ChainServiceMock},
                {provide: InitialisationService, useClass: InitialisationServiceMock},
                {provide: MemberSocketService, useClass: MemberSocketServiceMock},
                {provide: ToasterService, useClass: ToasterServiceMock},
                {provide: AlertsService, useClass: AlertsServiceMock},
            ]
        })
            .compileComponents();

        MockNgRedux.reset();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SetlLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
