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

const fetchInformationAuditByKycID = jasmine.createSpy('fetchInformationAuditByKycID')
.and.returnValue(
    new Promise((resolve, reject) => {
        resolve();
    }),
);
const ofiKycServiceSpy = {
    fetchInformationAuditByKycID,
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
        ofiKycServiceSpy.fetchInformationAuditByKycID.calls.reset();
    });

    describe('service calls', () => {
        it('should call the fetchInformationAuditByKycID method of OfiKycService on init', () => {
            expect(ofiKycServiceSpy.fetchInformationAuditByKycID).toHaveBeenCalledTimes(1);
            expect(ofiKycServiceSpy.fetchInformationAuditByKycID).toHaveBeenCalledWith(comp.kycID);
        });

        it('should call the fetchInformationAuditByKycID method of OfiKycService on input change', () => {
            ofiKycServiceSpy.fetchInformationAuditByKycID.calls.reset();

            const newKycID = 2;
            comp.ngOnChanges({
                kycID: new SimpleChange(1, newKycID, null),
            });
            fixture.detectChanges();

            expect(ofiKycServiceSpy.fetchInformationAuditByKycID).toHaveBeenCalledTimes(1);
            expect(ofiKycServiceSpy.fetchInformationAuditByKycID).toHaveBeenCalledWith(newKycID);
        });

        it('should not call the fetchInformationAuditByKycID method of OfiKycService', () => {
            ofiKycServiceSpy.fetchInformationAuditByKycID.calls.reset();

            comp.ngOnChanges({
                kycID: new SimpleChange(1, 1, null),
            });
            fixture.detectChanges();

            expect(ofiKycServiceSpy.fetchInformationAuditByKycID).toHaveBeenCalledTimes(0);
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
