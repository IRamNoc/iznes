import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';

import { KycAuditTrailComponent } from './kyc-audit-trail.component';
import { KycStatusAuditTrailComponent } from './status-audit-trail/kyc-status-audit-trail.component';
import { KycInformationAuditTrailComponent } from './information-audit-trail/kyc-information-audit-trail.component';
import { kycEnums } from '../config';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { ClarityModule } from '@clr/angular';

const fetchStatusAuditByKycID = jasmine.createSpy('fetchStatusAuditByKycID')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
    );
const ofiKycServiceSpy = {
    fetchStatusAuditByKycID,
};

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

fdescribe('KycAuditTrailComponent', () => {

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
            ],
            providers: [
                { provide: OfiKycService, useValue: ofiKycServiceSpy },
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
    });

});
