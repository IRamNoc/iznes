import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UmbrellaFundComponent } from './component';

import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    SetlComponentsModule,
    DpDatePickerModule,
    APP_CONFIG,
    LogService,
} from '@setl/utils';
import productConfig from '../productConfig';
import { ToasterService } from 'angular2-toaster';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MultilingualService } from '@setl/multilingual';
import { LeiService } from '@ofi/ofi-main/ofi-req-services/ofi-product/lei/lei.service';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import {
    OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';

const ofiManagementCompanyServiceSpy = {
    getManagementCompanyList: () => { },
};

const ofiUmbrellaFundServiceSpy = {
    fetchUmbrellaList: () => { },
};

const multilingualServiceSpy = {
    translate: () => { },
};

const leiServiceStub = {
    fetchLEIs: () => { },
};

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('UmbrellaFundComponent', () => {
    let comp: UmbrellaFundComponent;
    let fixture: ComponentFixture<UmbrellaFundComponent>;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                UmbrellaFundComponent,
                TranslatePipe,
            ],
            imports: [
                SetlComponentsModule,
                ClarityModule,
                FormsModule,
                ReactiveFormsModule,
                DpDatePickerModule,
                RouterTestingModule,
            ],
            providers: [
                AlertsService,
                ToasterService,
                LogService,
                { provide: APP_CONFIG, useValue: { MEMBER_NODE_CONNECTION: { port: 1234 } } },
                { provide: 'product-config', useValue: productConfig },
                { provide: NgRedux, useFactory: MockNgRedux.getInstance },
                { provide: OfiUmbrellaFundService, useValue: ofiUmbrellaFundServiceSpy },
                { provide: OfiManagementCompanyService, useValue: ofiManagementCompanyServiceSpy },
                { provide: MultilingualService, useValue: multilingualServiceSpy },
                { provide: LeiService, useValue: leiServiceStub },
            ],
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(UmbrellaFundComponent);

        comp = fixture.componentInstance;

        tick();
        fixture.detectChanges();
    }));

    afterEach(() => {
        const leiStub = MockNgRedux.getSelectorStub([
            'ofi',
            'ofiProduct',
            'lei',
            'lei',
        ]);
        leiStub.next([]);
        leiStub.complete();
    });

    describe('isLeiAlreadyExisting', () => {
        it('should return true', () => {
            const leiStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'lei',
                'lei',
            ]);
            leiStub.next(['lol', 'lul']);
            leiStub.complete();

            expect(comp.isLeiAlreadyExisting('lul')).toEqual(true);
        });

        it('should return false', () => {
            const leiStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'lei',
                'lei',
            ]);
            leiStub.next(['lol', 'lul']);
            leiStub.complete();

            expect(comp.isLeiAlreadyExisting('lel')).toEqual(false);
        });

        it('should return false if leiList is empty', () => {
            expect(comp.isLeiAlreadyExisting('lul')).toEqual(false);
        });

        it('should return false if argument is falsy', () => {
            const leiStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'lei',
                'lei',
            ]);
            leiStub.next(['lol', 'lul']);
            leiStub.complete();

            expect(comp.isLeiAlreadyExisting('')).toEqual(false);
        })
    });
});