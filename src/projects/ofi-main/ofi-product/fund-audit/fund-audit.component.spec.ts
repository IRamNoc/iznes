import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { FundAuditComponent } from './fund-audit.component';
import { FundAuditDatagridComponent } from './fund-audit-datagrid/fund-audit-datagrid.component';
import {
    DpDatePickerModule,
} from '@setl/utils';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { MultilingualService } from '@setl/multilingual';
import { RouterTestingModule } from '@angular/router/testing';

const ofiFundServiceSpy = {

};

const multilingualServiceSpy = {
    translate: () => { },
};

const activatedRouteStub = {
    params: new Subject(),
};

const locationStub = {
    back: jasmine.createSpy('back'),
};

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('FundAuditComponent', () => {
    let comp: FundAuditComponent;
    let fixture: ComponentFixture<FundAuditComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                FundAuditComponent,
                FundAuditDatagridComponent,
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
                { provide: OfiFundService, useValue: ofiFundServiceSpy },
                { provide: MultilingualService, useValue: multilingualServiceSpy },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Location, useValue: locationStub },
            ],
        });
        await TestBed.compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(FundAuditComponent);

        comp = fixture.componentInstance;
        MockNgRedux.reset();

        tick();
        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('div'));
        el = de.nativeElement;
    }));

    afterEach(() => {
        locationStub.back.calls.reset();
    });

    it('should redirect to the previous location', () => {
        comp.navigateToPreviousLocation();
        expect(locationStub.back).toHaveBeenCalledTimes(1);
    });
});
