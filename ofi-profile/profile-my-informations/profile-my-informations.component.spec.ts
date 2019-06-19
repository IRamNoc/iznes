// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Pipe, PipeTransform, Directive } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ClarityModule } from '@clr/angular';
// import { NgRedux } from '@angular-redux/store';
// import { MockNgRedux } from '@angular-redux/store/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ToasterService } from 'angular2-toaster';
// import { convertToParamMap, ActivatedRoute } from '@angular/router';

// import { OfiProfileMyInformationsComponent } from './component';
// import { OfiMyInformationsModule } from '../../ofi-my-informations/module';
// import { SetlComponentsModule, APP_CONFIG } from '@setl/utils';
// import { MyUserService } from '@setl/core-req-services';
// import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
// import { AlertsService } from '@setl/jaspero-ng2-alerts';
// import { MultilingualService } from '@setl/multilingual';
// import { MemberSocketService } from '@setl/websocket-service';

// const saveMyUserDetails = jasmine.createSpy('saveMyUserDetails')
//     .and.returnValue(
//         new Promise((resolve, reject) => {
//             resolve();
//         })
//     );

// const myUserServiceStub = {
//     statusNotifications: () => { },
//     saveMyUserDetails,
// };
// const ofiKycServiceStub = {
//     fetchInvestor: () => { },
// };
// const multilingualServiceStub = {
//     translate: () => { },
// };
// const memberSocketServiceStub = {
// };

// const pop = jasmine.createSpy('pop')
//     .and.returnValue(
//         new Promise((resolve, reject) => {
//             resolve();
//         }),
//     );
// const toasterServiceStub = {
//     pop,
// };

// const setHomePage = '/home';
// const paramMapStub = {
//     snapshot: {
//         paramMap: convertToParamMap({ sethomepage: setHomePage }),
//     }
// }

// @Pipe({ name: 'translate' })
// export class TranslatePipe implements PipeTransform {
//     transform(value: any): any {
//         return value;
//     }
// }

// @Directive({
//     selector: 'app-external-notifications',
// })
// class AppExternalNotificationsStub {
// }

// describe('OfiProfileMyInformationsComponent', () => {

//     let comp: OfiProfileMyInformationsComponent;
//     let fixture: ComponentFixture<OfiProfileMyInformationsComponent>;

//     const resetTestingModule = TestBed.resetTestingModule;


//     beforeAll(done => (async () => {
//         TestBed.resetTestingModule();
//         TestBed.configureTestingModule({
//             declarations: [
//                 OfiProfileMyInformationsComponent,
//                 TranslatePipe,
//                 AppExternalNotificationsStub,
//             ],
//             imports: [
//                 FormsModule,
//                 ReactiveFormsModule,
//                 ClarityModule,
//                 OfiMyInformationsModule,
//                 SetlComponentsModule,
//                 RouterTestingModule,
//             ],
//             providers: [
//                 { provide: NgRedux, useFactory: MockNgRedux.getInstance },
//                 { provide: MyUserService, useValue: myUserServiceStub },
//                 { provide: OfiKycService, useValue: ofiKycServiceStub },
//                 AlertsService,
//                 { provide: MultilingualService, useValue: multilingualServiceStub },
//                 { provide: ToasterService, useValue: toasterServiceStub },
//                 { provide: MemberSocketService, useValue: memberSocketServiceStub },
//                 { provide: APP_CONFIG, useValue: { MEMBER_NODE_CONNECTION: { port: 1234 } } },
//                 { provide: ActivatedRoute, useValue: paramMapStub }
//             ],
//         });
//         await TestBed.compileComponents();
//         TestBed.resetTestingModule = () => TestBed;
//     })().then(done).catch(done.fail));

//     afterAll(() => {
//         TestBed.resetTestingModule = resetTestingModule;
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(OfiProfileMyInformationsComponent);
//         comp = fixture.componentInstance;
//     });

//     afterEach(() => {
//         saveMyUserDetails.calls.reset();
//     });

//     describe('saveUserInformations', () => {
//         it('should call the saveMyUserDetails method of MyUserService with the setHomePage as parameter', fakeAsync(() => {
//             tick();
//             fixture.detectChanges();
//             comp.saveUserInformations({});
//             expect(saveMyUserDetails).toHaveBeenCalledTimes(1);
//             expect(saveMyUserDetails.calls.first().args[0].defaultHomePage).toEqual(setHomePage);
//         }));

//         it('should call the saveMyUserDetails method of MyUserService with the setHomePage as null parameter', fakeAsync(() => {
//             const activatedRouteInstance = fixture.debugElement.injector.get(ActivatedRoute);
//             // @ts-ignore: overiding paramMap which is supposed to be read-only on runtime
//             activatedRouteInstance.snapshot.paramMap = convertToParamMap(null);
//             comp.ngOnDestroy();
//             comp.ngOnInit();

//             tick();
//             fixture.detectChanges();

//             comp.saveUserInformations({});
//             expect(saveMyUserDetails).toHaveBeenCalledTimes(1);
//             expect(saveMyUserDetails.calls.first().args[0].defaultHomePage).toEqual('');
//         }));
//     });
// });
