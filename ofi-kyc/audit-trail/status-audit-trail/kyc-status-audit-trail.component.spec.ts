// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { DebugElement, Pipe, PipeTransform, SimpleChange } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { of } from 'rxjs/observable/of';
// import { Subject } from 'rxjs/Subject';

// import { KycStatusAuditTrailComponent } from './kyc-status-audit-trail.component';
// import { kycEnums } from '../../config';
// import { OfiKycService } from '../../../ofi-req-services/ofi-kyc/service';
// import { ClarityModule } from '@clr/angular';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DpDatePickerModule } from '@setl/utils/index';
// import { ActivatedRoute } from '@angular/router';
// import { FileDownloader } from '@setl/utils';
// import { MemberSocketService } from '@setl/websocket-service';
// import { MultilingualService } from '@setl/multilingual';

// const getStatusAuditByKycID = jasmine.createSpy('getStatusAuditByKycID')
// .and.returnValue(
//     new Promise((resolve, reject) => {
//         resolve();
//     }),
// );
// const ofiKycServiceSpy = {
//     getStatusAuditByKycID,
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

// describe('KycStatusAuditTrailComponent', () => {

//     let comp: KycStatusAuditTrailComponent;
//     let fixture: ComponentFixture<KycStatusAuditTrailComponent>;
//     let de: DebugElement;
//     let el: HTMLElement;

//     const resetTestingModule = TestBed.resetTestingModule;

//     beforeAll(done => (async () => {
//         TestBed.resetTestingModule();
//         TestBed.configureTestingModule({
//             declarations: [
//                 KycStatusAuditTrailComponent,
//                 TranslatePipe,
//             ],
//             imports: [
//                 ClarityModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 DpDatePickerModule,
//             ],
//             providers: [
//                 { provide: OfiKycService, useValue: ofiKycServiceSpy },
//                 { provide: ActivatedRoute, useValue: activatedRouteStub },
//                 { provide: FileDownloader, useValue: fileDownloaderStub },
//                 { provide: MemberSocketService, useValue: memberSocketServiceStub },
//                 { provide: MultilingualService, useValue: multilingualServiceStub },
//                 { provide: 'kycEnums', useValue: kycEnums },
//             ],
//         }).compileComponents();
//         TestBed.resetTestingModule = () => TestBed;
//     })().then(done).catch(done.fail));

//     afterAll(() => {
//         TestBed.resetTestingModule = resetTestingModule;
//     });

//     beforeEach(fakeAsync(() => {
//         fixture = TestBed.createComponent(KycStatusAuditTrailComponent);

//         comp = fixture.componentInstance;
//         comp.kycID = 1;
//         comp.myDetails = {
//             userId: 11,
//         };

//         tick();
//         fixture.detectChanges();

//         de = fixture.debugElement.query(By.css('div'));
//         el = de.nativeElement;
//     }));

//     afterEach(() => {
//         ofiKycServiceSpy.getStatusAuditByKycID.calls.reset();
//     });

//     describe('structure', () => {
//         it('should have a header with wording: "Request Status Audit Trail"', () => {
//             const headerEl = fixture.debugElement.query(By.css('h2')).nativeElement;
//             expect(headerEl.innerText).toContain('Request Status Audit Trail');
//         });

//         it('should have a datagrid with the columns: Old Status, New Status, Modified By, Date', () => {
//             const datagridEl = fixture.debugElement.queryAll(By.css('clr-datagrid'));
//             expect(datagridEl.length).toEqual(1);

//             const columnEls = fixture.debugElement.queryAll(By.css('clr-dg-column'));
//             expect(columnEls.length).toEqual(4);

//             expect(columnEls[0].nativeElement.innerText).toContain('Old Status');
//             expect(columnEls[1].nativeElement.innerText).toContain('New Status');
//             expect(columnEls[2].nativeElement.innerText).toContain('Modified By');
//             expect(columnEls[3].nativeElement.innerText).toContain('Date');
//         });
//     });

//     describe('behaviour', () => {
//         it('should call the getStatusAuditByKycID method of OfiKycService on init', () => {
//             expect(ofiKycServiceSpy.getStatusAuditByKycID).toHaveBeenCalledTimes(1);
//             expect(ofiKycServiceSpy.getStatusAuditByKycID).toHaveBeenCalledWith(comp.kycID);
//         });

//         it('should call the getStatusAuditByKycID method of OfiKycService on input change', () => {
//             ofiKycServiceSpy.getStatusAuditByKycID.calls.reset();

//             const newKycID = 2;
//             comp.ngOnChanges({
//                 kycID: new SimpleChange(1, newKycID, null),
//             });
//             fixture.detectChanges();

//             expect(ofiKycServiceSpy.getStatusAuditByKycID).toHaveBeenCalledTimes(1);
//             expect(ofiKycServiceSpy.getStatusAuditByKycID).toHaveBeenCalledWith(newKycID);
//         });

//         it('should not call the getStatusAuditByKycID method of OfiKycService', () => {
//             ofiKycServiceSpy.getStatusAuditByKycID.calls.reset();

//             comp.ngOnChanges({
//                 kycID: new SimpleChange(1, 1, null),
//             });
//             fixture.detectChanges();

//             expect(ofiKycServiceSpy.getStatusAuditByKycID).toHaveBeenCalledTimes(0);
//         });

//         it('should call the downLoaderFile method of FileDownloader with the kycId ', () => {
//             comp.exportCsv();
//             expect(fileDownloaderStub.downLoaderFile).toHaveBeenCalledTimes(1);
//             expect(fileDownloaderStub.downLoaderFile).toHaveBeenCalledWith({
//                 method: 'getKycStatusAudit',
//                 token: memberSocketServiceStub.token,
//                 userId: comp.myDetails.userId,
//                 kycID: comp.kycID,
//                 timezoneoffset: new Date().getTimezoneOffset(),
//             });
//         });
//     });

// });
