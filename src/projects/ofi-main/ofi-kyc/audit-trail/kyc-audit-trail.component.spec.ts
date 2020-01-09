// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Pipe, PipeTransform } from '@angular/core';
// import { of } from 'rxjs/observable/of';
// import { NgRedux } from '@angular-redux/store';
// import { MockNgRedux } from '@angular-redux/store/testing';

// import { KycAuditTrailComponent } from './kyc-audit-trail.component';
// import { KycStatusAuditTrailComponent } from './status-audit-trail/kyc-status-audit-trail.component';
// import { KycInformationAuditTrailComponent } from './information-audit-trail/kyc-information-audit-trail.component';
// import { kycEnums } from '../config';
// import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
// import { ClarityModule } from '@clr/angular';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DpDatePickerModule } from '@setl/utils/index';
// import { ActivatedRoute } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { FileDownloader } from '@setl/utils';
// import { MemberSocketService } from '@setl/websocket-service';
// import { MultilingualService } from '@setl/multilingual';

// const getStatusAuditByKycID = jasmine.createSpy('getStatusAuditByKycID')
//     .and.returnValue(
//         new Promise((resolve, reject) => {
//             resolve();
//         }),
// );
// const fetchInformationAuditByKycID = jasmine.createSpy('fetchInformationAuditByKycID')
//     .and.returnValue(
//         new Promise((resolve, reject) => {
//             resolve();
//         }),
// );
// const ofiKycServiceSpy = {
//     getStatusAuditByKycID,
//     fetchInformationAuditByKycID,
// };

// const fileDownloaderStub = {
//     downLoaderFile: jasmine.createSpy('downLoaderFile'),
// };

// const memberSocketServiceStub = {
//     token: 'fake token',
// };

// const multilingualServiceStub = jasmine.createSpyObj('MultilingualService', ['translate']);

// const fakeKycID = 1;
// const activatedRouteStub = {
//     params: of({
//         kycID: fakeKycID.toString(),
//     }),
// };

// // Stub for translate
// @Pipe({ name: 'translate' })
// export class TranslatePipe implements PipeTransform {
//     transform(value: any): any {
//         return value;
//     }
// }

// describe('KycAuditTrailComponent', () => {

//     let comp: KycAuditTrailComponent;
//     let fixture: ComponentFixture<KycAuditTrailComponent>;

//     const resetTestingModule = TestBed.resetTestingModule;

//     beforeAll(done => (async () => {
//         TestBed.resetTestingModule();
//         TestBed.configureTestingModule({
//             declarations: [
//                 KycAuditTrailComponent,
//                 KycStatusAuditTrailComponent,
//                 KycInformationAuditTrailComponent,
//                 TranslatePipe,
//             ],
//             imports: [
//                 ClarityModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 DpDatePickerModule,
//                 RouterTestingModule,
//             ],
//             providers: [
//                 { provide: OfiKycService, useValue: ofiKycServiceSpy },
//                 { provide: ActivatedRoute, useValue: activatedRouteStub },
//                 { provide: FileDownloader, useValue: fileDownloaderStub },
//                 { provide: MemberSocketService, useValue: memberSocketServiceStub },
//                 { provide: MultilingualService, useValue: multilingualServiceStub },
//                 { provide: 'kycEnums', useValue: kycEnums },
//                 { provide: NgRedux, useFactory: MockNgRedux.getInstance },
//             ],
//         }).compileComponents();
//         TestBed.resetTestingModule = () => TestBed;
//     })().then(done).catch(done.fail));

//     afterAll(() => {
//         TestBed.resetTestingModule = resetTestingModule;
//     });

//     beforeEach(fakeAsync(() => {
//         fixture = TestBed.createComponent(KycAuditTrailComponent);

//         comp = fixture.componentInstance;

//         const kycListStub = MockNgRedux.getSelectorStub([
//             'ofi',
//             'ofiKyc',
//             'myKycList',
//             'kycList',
//         ]);
//         kycListStub.next([
//             {
//                 kycID: fakeKycID,
//             },
//         ]);
//         kycListStub.complete();

//         tick();
//         fixture.detectChanges();
//     }));

//     afterEach(() => {

//     });

//     describe('structure', () => {
//         it('should retrieve the kycID from the route', () => {
//             expect(comp.kycID).toEqual(fakeKycID);
//         });
//     });

// });
