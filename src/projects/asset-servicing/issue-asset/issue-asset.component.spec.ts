// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
// import {ReactiveFormsModule} from '@angular/forms';
// import {NgReduxTestingModule, MockNgRedux} from '@angular-redux/store/testing';
// import {ToasterModule, ToasterService} from 'angular2-toaster';
// import {AlertsService} from '@setl/jaspero-ng2-alerts';
// import {SelectModule, SetlComponentsModule} from '@setl/utils';
// import {ClarityModule} from 'clarity-angular';

// import {IssueAssetComponent} from './issue-asset.component';
// import {
//     CoreTestUtilModule,
//     MyUserServiceMock,
//     MemberSocketServiceMock,
//     AlertsServiceMock,
//     ToasterServiceMock,
//     AccountsServiceMock,
//     ChainServiceMock,
//     ChannelServiceMock,
//     InitialisationServiceMock,
//     MyWalletsServiceMock,
//     PermissionGroupServiceMock,
//     WalletNodeSocketServiceMock,
//     WalletNodeRequestServiceMock,
//     WalletnodeTxServiceMock
// } from '@setl/core-test-util';
// import {
//     MyUserService,
//     MyWalletsService,
//     ChannelService,
//     AccountsService,
//     PermissionGroupService,
//     ChainService,
//     InitialisationService,
//     WalletNodeRequestService,
//     WalletnodeTxService
// } from '@setl/core-req-services';
// import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';

// describe('IssueAssetComponent', () => {
//     let component: IssueAssetComponent;
//     let fixture: ComponentFixture<IssueAssetComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 ReactiveFormsModule,
//                 NgReduxTestingModule,
//                 ToasterModule,
//                 CoreTestUtilModule,
//                 SelectModule,
//                 SetlComponentsModule,
//                 ClarityModule
//             ],
//             declarations: [IssueAssetComponent],
//             providers: [
//                 {provide: MyUserService, useClass: MyUserServiceMock},
//                 {provide: MemberSocketService, useClass: MemberSocketServiceMock},
//                 {provide: MyWalletsService, useClass: MyWalletsServiceMock},
//                 {provide: ChannelService, useClass: ChannelServiceMock},
//                 {provide: AccountsService, useClass: AccountsServiceMock},
//                 {provide: PermissionGroupService, useClass: PermissionGroupServiceMock},
//                 {provide: ChainService, useClass: ChainServiceMock},
//                 {provide: InitialisationService, useClass: InitialisationServiceMock},
//                 {provide: MemberSocketService, useClass: MemberSocketServiceMock},
//                 {provide: ToasterService, useClass: ToasterServiceMock},
//                 {provide: AlertsService, useClass: AlertsServiceMock},
//                 {provide: WalletNodeSocketService, useClass: WalletNodeSocketServiceMock},
//                 {provide: WalletNodeRequestService, useClass: WalletNodeRequestServiceMock},
//                 {provide: WalletnodeTxService, useClass: WalletnodeTxServiceMock},
//             ]
//         })
//             .compileComponents();

//         MockNgRedux.reset();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(IssueAssetComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should be created', () => {
//         expect(component).toBeTruthy();
//     });
// });
