import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { omit } from 'lodash';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UmbrellaAuditDatagridComponent } from './umbrella-audit-datagrid.component';
import {
    DpDatePickerModule,
} from '@setl/utils';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { MultilingualService } from '@setl/multilingual';

const fetchUmbrellaAuditByUmbrellaID = jasmine.createSpy('fetchUmbrellaAuditByUmbrellaID')
    .and.returnValue(null);

const ofiUmbrellaFundServiceSpy = {
    fetchUmbrellaAuditByUmbrellaID,
};

const multilingualServiceSpy = {
    translate: () => { },
};

const fakeUmbrellaID = 5;
const fakeUmbrellaAuditList = {
    [fakeUmbrellaID]: [
        {
            umbrellaID: fakeUmbrellaID,
            umbrellaName: 'TestUmbrellaFund2',
            field: 'Fund Administrator',
            oldValue: 'Société Générale Securities Services Luxembourg',
            newValue: 'BNP Paribas Securities France',
            modifiedBy: 'Asset Manager',
            dateModified: '2018-09-11 11:59:00',
        },
        {
            umbrellaID: fakeUmbrellaID,
            umbrellaName: 'TestUmbrellaFund2',
            field: 'Custodian Bank',
            oldValue: 'Société Générale Securities Services Luxembourg',
            newValue: 'BNP Paribas Securities Luxembourg',
            modifiedBy: 'Asset Manager',
            dateModified: '2018-09-11 11:59:00',
        },
    ],
};

const fakeUmbrellaAudit = fakeUmbrellaAuditList[fakeUmbrellaID].map((audit) => {
    return omit(audit, ['umbrellaID']);
});

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('UmbrellaAuditDatagridComponent', () => {
    let comp: UmbrellaAuditDatagridComponent;
    let fixture: ComponentFixture<UmbrellaAuditDatagridComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    let filterAuditItemsSpy;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                UmbrellaAuditDatagridComponent,
                TranslatePipe,
            ],
            imports: [
                ClarityModule,
                FormsModule,
                ReactiveFormsModule,
                DpDatePickerModule,
            ],
            providers: [
                { provide: OfiUmbrellaFundService, useValue: ofiUmbrellaFundServiceSpy },
                { provide: MultilingualService, useValue: multilingualServiceSpy },
            ],
        });
        await TestBed.compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(UmbrellaAuditDatagridComponent);

        comp = fixture.componentInstance;
        MockNgRedux.reset();

        comp.umbrellaID = fakeUmbrellaID;

        tick();
        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('div'));
        el = de.nativeElement;

        filterAuditItemsSpy = spyOn(comp, 'filterAuditItems')
                .and.callThrough();
    }));

    afterEach(() => {
        fetchUmbrellaAuditByUmbrellaID.calls.reset();
        filterAuditItemsSpy.calls.reset();
    });

    it('should call the fetchUmbrellaAuditByUmbrellaID method of ofiUmbrellaFundService', () => {
        expect(fetchUmbrellaAuditByUmbrellaID).toHaveBeenCalledTimes(1);
        expect(fetchUmbrellaAuditByUmbrellaID).toHaveBeenCalledWith(fakeUmbrellaID);
    });

    describe('updateUmbrellaAuditItems', () => {
        it('should call filterAuditItems method', fakeAsync(() => {
            const umbrellaAuditListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiUmbrellaFund',
                'umbrellaFundList',
                'audit',
            ]);
            umbrellaAuditListStub.next(fakeUmbrellaAuditList);
            umbrellaAuditListStub.complete();

            const expectedFormValue = {
                startDate: '',
                endDate: '',
            };

            tick();
            fixture.detectChanges();

            expect(filterAuditItemsSpy).toHaveBeenCalledTimes(1);
            expect(filterAuditItemsSpy).toHaveBeenCalledWith(expectedFormValue);
        }));
    });
});
