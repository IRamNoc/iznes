import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UmbrellaAuditComponent } from './umbrella-audit.component';
import { UmbrellaAuditDatagridComponent } from './umbrella-audit-datagrid/umbrella-audit-datagrid.component';
import {
    DpDatePickerModule,
} from '@setl/utils';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { MultilingualService } from '@setl/multilingual';
import {RouterTestingModule} from "@angular/router/testing";

const ofiUmbrellaFundServiceSpy = {

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

describe('UmbrellaAuditComponent', () => {
    let comp: UmbrellaAuditComponent;
    let fixture: ComponentFixture<UmbrellaAuditComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                UmbrellaAuditComponent,
                UmbrellaAuditDatagridComponent,
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
                { provide: OfiUmbrellaFundService, useValue: ofiUmbrellaFundServiceSpy },
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
        fixture = TestBed.createComponent(UmbrellaAuditComponent);

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

    it('should render', () => {
        const headerEl = fixture.debugElement.query(By.css('h1')).nativeElement;
        expect(headerEl.innerText).toContain('Umbrella Audit Trail:');
    });

    it('should have a "back" button', () => {
        const backBtnEl = fixture.debugElement.query(By.css('#back-btn')).nativeElement;
        expect(backBtnEl.innerText).toContain('Back');
    });

    it('should redirect to the previous location on click on the "back" button', () => {
        const backBtnEl = fixture.debugElement.query(By.css('#back-btn'));
        backBtnEl.triggerEventHandler('click', null);
        expect(locationStub.back).toHaveBeenCalledTimes(1);
    });
});
