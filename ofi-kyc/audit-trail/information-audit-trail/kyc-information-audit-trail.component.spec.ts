import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';

import { KycInformationAuditTrailComponent } from './kyc-information-audit-trail.component';
import { kycEnums } from '../../config';
import { OfiKycService } from '../../../ofi-req-services/ofi-kyc/service';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from '@setl/utils/index';
import { ActivatedRoute } from '@angular/router';
import { FileDownloader } from '@setl/utils';
import { MemberSocketService } from '@setl/websocket-service';
import { MultilingualService } from '@setl/multilingual';

const getInformationAuditByKycID = jasmine.createSpy('getInformationAuditByKycID')
.and.returnValue(
    new Promise((resolve, reject) => {
        resolve();
    }),
);
const ofiKycServiceSpy = {
    getInformationAuditByKycID,
};

const fileDownloaderStub = {
    downLoaderFile: jasmine.createSpy('downLoaderFile'),
};

const memberSocketServiceStub = {
    token: 'fake token',
};

const multilingualServiceStub = jasmine.createSpyObj('MultilingualService', ['translate']);

const fakeKycID = 1;
const activatedRouteStub = {
    params: of({
        kycID: fakeKycID.toString(),
    }),
};

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('KycInformationAuditTrailComponent', () => {

    let comp: KycInformationAuditTrailComponent;
    let fixture: ComponentFixture<KycInformationAuditTrailComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                KycInformationAuditTrailComponent,
                TranslatePipe,
            ],
            imports: [
                ClarityModule,
                FormsModule,
                ReactiveFormsModule,
                DpDatePickerModule,
            ],
            providers: [
                { provide: OfiKycService, useValue: ofiKycServiceSpy },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: FileDownloader, useValue: fileDownloaderStub },
                { provide: MemberSocketService, useValue: memberSocketServiceStub },
                { provide: MultilingualService, useValue: multilingualServiceStub },
                { provide: 'kycEnums', useValue: kycEnums },
            ],
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(KycInformationAuditTrailComponent);

        comp = fixture.componentInstance;
        comp.kycID = 1;
        comp.myDetails = {
            userId: 11,
        };

        tick();
        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('div'));
        el = de.nativeElement;
    }));

    afterEach(() => {
        ofiKycServiceSpy.getInformationAuditByKycID.calls.reset();
    });

    describe('structure', () => {
        it('should have a header with wording: "Request Information Audit Trail"', () => {
            const headerEl = fixture.debugElement.query(By.css('h2')).nativeElement;
            expect(headerEl.innerText).toContain('Request Information Audit Trail');
        });

        it('should have a searchField "Search a section or subsection"', () => {
            const inputEl = fixture.debugElement.query(By.css('#searchForm > div > div:nth-child(1)')).nativeElement;
            expect(inputEl.innerText).toContain('Search a section or subsection');
        });

        it('should have a searchField "Date From"', () => {
            const inputEl = fixture.debugElement.query(By.css('#searchForm > div > div:nth-child(2)')).nativeElement;
            expect(inputEl.innerText).toContain('Date From');
        });

        it('should have a searchField "Date To"', () => {
            const inputEl = fixture.debugElement.query(By.css('#searchForm > div > div:nth-child(3)')).nativeElement;
            expect(inputEl.innerText).toContain('Date To');
        });

        it('should have a datagrid with the columns: Section, Subsection, Information, Old Value, New Value, Modified By, Date', () => {
            const datagridEl = fixture.debugElement.queryAll(By.css('clr-datagrid'));
            expect(datagridEl.length).toEqual(1);

            const columnEls = fixture.debugElement.queryAll(By.css('clr-dg-column'));
            expect(columnEls.length).toEqual(7);

            expect(columnEls[0].nativeElement.innerText).toContain('Section');
            expect(columnEls[1].nativeElement.innerText).toContain('Subsection');
            expect(columnEls[2].nativeElement.innerText).toContain('Information');
            expect(columnEls[3].nativeElement.innerText).toContain('Old Value');
            expect(columnEls[4].nativeElement.innerText).toContain('New Value');
            expect(columnEls[5].nativeElement.innerText).toContain('Modified By');
            expect(columnEls[6].nativeElement.innerText).toContain('Date');
        });
    });

    describe('behaviour', () => {
        it('should call the getInformationAuditByKycID method of OfiKycService on init', () => {
            expect(ofiKycServiceSpy.getInformationAuditByKycID).toHaveBeenCalledTimes(1);
            expect(ofiKycServiceSpy.getInformationAuditByKycID).toHaveBeenCalledWith(comp.kycID);
        });

        it('should call the getInformationAuditByKycID method of OfiKycService on input change', () => {
            ofiKycServiceSpy.getInformationAuditByKycID.calls.reset();

            const newKycID = 2;
            comp.ngOnChanges({
                kycID: new SimpleChange(1, newKycID, null),
            });
            fixture.detectChanges();

            expect(ofiKycServiceSpy.getInformationAuditByKycID).toHaveBeenCalledTimes(1);
            expect(ofiKycServiceSpy.getInformationAuditByKycID).toHaveBeenCalledWith(newKycID);
        });

        it('should not call the getInformationAuditByKycID method of OfiKycService', () => {
            ofiKycServiceSpy.getInformationAuditByKycID.calls.reset();

            comp.ngOnChanges({
                kycID: new SimpleChange(1, 1, null),
            });
            fixture.detectChanges();

            expect(ofiKycServiceSpy.getInformationAuditByKycID).toHaveBeenCalledTimes(0);
        });

        it('should call the downLoaderFile method of FileDownloader with the kycId and filters', () => {
            comp.searchForm.controls['search'].setValue('test');

            comp.exportCsv();
            expect(fileDownloaderStub.downLoaderFile).toHaveBeenCalledTimes(1);
            expect(fileDownloaderStub.downLoaderFile).toHaveBeenCalledWith({
                method: 'getKycInformationAudit',
                token: memberSocketServiceStub.token,
                userId: comp.myDetails.userId,
                kycID: comp.kycID,
                timezoneoffset: new Date().getTimezoneOffset(),
                search: comp.searchForm.value.search,
                dateFrom: comp.searchForm.value.startDate,
                dateTo: comp.searchForm.value.endDate,
            });
        });
    });

});
