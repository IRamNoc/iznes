import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';

import { KycAuditTrailComponent } from './kyc-audit-trail.component';
import { KycStatusAuditTrailComponent } from './status-audit-trail/kyc-status-audit-trail.component';
import { KycInformationAuditTrailComponent } from './information-audit-trail/kyc-information-audit-trail.component';
import { kycEnums } from '../config';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from '@setl/utils/index';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FileDownloader } from '@setl/utils';
import { MemberSocketService } from '@setl/websocket-service';
import { MultilingualService } from '@setl/multilingual';

const getStatusAuditByKycID = jasmine.createSpy('getStatusAuditByKycID')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
);
const getInformationAuditByKycID = jasmine.createSpy('getInformationAuditByKycID')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
);
const ofiKycServiceSpy = {
    getStatusAuditByKycID,
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

describe('KycAuditTrailComponent', () => {

    let comp: KycAuditTrailComponent;
    let fixture: ComponentFixture<KycAuditTrailComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                KycAuditTrailComponent,
                KycStatusAuditTrailComponent,
                KycInformationAuditTrailComponent,
                TranslatePipe,
            ],
            imports: [
                ClarityModule,
                FormsModule,
                ReactiveFormsModule,
                DpDatePickerModule,
                RouterTestingModule,
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
        fixture = TestBed.createComponent(KycAuditTrailComponent);

        comp = fixture.componentInstance;

        comp.kycListOb.next([
            {
                kycID: fakeKycID,
            },
        ]);

        tick();
        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('div'));
        el = de.nativeElement;
    }));

    afterEach(() => {

    });

    describe('structure', () => {
        it('should have a header with wording: "My Request Audit Trail:"', () => {
            expect(el.innerText).toContain('My Request Audit Trail:');
        });

        it('should have an status audit trail component', () => {
            const statusEl = fixture.debugElement.queryAll(By.css('kyc-information-audit-trail'));
            expect(statusEl.length).toEqual(1);
        });

        it('should have an information audit trail component', () => {
            const informationEl = fixture.debugElement.queryAll(By.css('kyc-information-audit-trail'));
            expect(informationEl.length).toEqual(1);
        });

        it('should retrieve the kycID from the route', () => {
            expect(comp.kycID).toEqual(fakeKycID);
        });

        it('should pass the kycID value to the status audit trail component', () => {
            const statusEl = fixture.debugElement.query(By.css('kyc-status-audit-trail'));
            expect(statusEl.componentInstance.kycID).toEqual(comp.kycID);
        });

        it('should pass the kycID value to the information audit trail component', () => {
            const informationEl = fixture.debugElement.query(By.css('kyc-information-audit-trail'));
            expect(informationEl.componentInstance.kycID).toEqual(comp.kycID);
        });
    });

});
