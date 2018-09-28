import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { ProductCharacteristicComponent } from './product-characteristic.component';

import {
    NumberConverterService,
    APP_CONFIG,
} from '@setl/utils';
import { ClarityModule } from '@clr/angular';
import { MultilingualService } from '@setl/multilingual';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
    ProductCharacteristicsService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/product-characteristics/service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import productConfig from '../productConfig';

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

@Component({
    selector: 'setl-file-viewer',
    template: '<input type="file" />',
})
class SetlFileViewerMockComponent {
    @Input() fileHash;
}

@Component({
    selector: 'setl-file-drop',
    template: '<input type="file" />',
})
class SetlFileDropMockComponent {
    @Input() inline;
    @Input() preset;
}

const activatedRouteStub = {
    params: of({
        isin: 'fakeISIN',
    }),
};

const locationStub = {
    back: jasmine.createSpy('back'),
};

const routerStub = {
    navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(null),
}

const productCharacteristicsServiceStub = {
    getProductCharacteristics: jasmine.createSpy('getProductCharacteristics'),
    fetchProductCharacteristics: jasmine.createSpy('fetchProductCharacteristics'),
};

const ofiCurrenciesServiceStub = jasmine.createSpyObj('OfiCurrenciesService', ['getCurrencyList']);
const multilingualServiceStub = jasmine.createSpyObj('MultilingualService', ['translate']);

describe('ProductCharacteristicComponent', () => {
    let comp: ProductCharacteristicComponent;
    let fixture: ComponentFixture<ProductCharacteristicComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                ProductCharacteristicComponent,
                TranslatePipe,
                SetlFileViewerMockComponent,
                SetlFileDropMockComponent,
            ],
            imports: [
                ClarityModule,
            ],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Location, useValue: locationStub },
                { provide: ProductCharacteristicsService, useValue: productCharacteristicsServiceStub },
                { provide: OfiCurrenciesService, useValue: ofiCurrenciesServiceStub },
                NumberConverterService,
                { provide: APP_CONFIG, useValue: { numberDivider: 1 } },
                { provide: MultilingualService, useValue: multilingualServiceStub },
                { provide: 'product-config', useValue: productConfig },
                { provide: Router, useValue: routerStub },
            ],
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(ProductCharacteristicComponent);

        comp = fixture.componentInstance;

        comp.currentProduct = {
            umbrellaFundName: 'fake umbrella',
            fundShareName: 'fake share name',
            isin: 'fake isin',
            prospectus: {
                fileID: 'fake propectus id',
                hash: '',
                name: '',
            },
            kiid: {
                fileID: 'fake kiid id',
                hash: '',
                name: '',
            },
            shareClassCurrency: 'fake currency',
        };

        de = fixture.debugElement.query(By.css('clr-tabs'));
        el = de.nativeElement;

        tick();
        fixture.detectChanges();
    }));

    afterEach(() => {
        productCharacteristicsServiceStub.getProductCharacteristics.calls.reset();
        locationStub.back.calls.reset();
        routerStub.navigateByUrl.calls.reset();
    });

    describe('structure', () => {
        it('should have a header with wording: "Product Characteristics: [Share Name]"', () => {
            const header = fixture.debugElement.query(By.css('h1'));
            expect(header.nativeElement.textContent).toContain('Product Characteristics:');
            expect(header.nativeElement.textContent).toContain(comp.currentProduct.fundShareName);
        });

        it('should have chart icon beside the header"', () => {
            const header = fixture.debugElement.query(By.css('h1'));
            const icon = header.query(By.css('i'));
            expect(icon.attributes.class).toContain('fa-bar-chart');
        });

        it('should have a wording: "Please find below the main information regarding [Share Name]"', () => {
            const p = fixture.debugElement.query(By.css('p'));
            expect(p.nativeElement.textContent).toContain('Please find below the main information regarding');
        });

        it('should display 4 tabs', () => {
            const panelHeaders = fixture.debugElement.queryAll(By.css('.panel-header'));
            const panelbodies = fixture.debugElement.queryAll(By.css('.panel-body'));
            expect(panelHeaders.length).toEqual(4);
            expect(panelbodies.length).toEqual(4);
        });

        it('should have only the first panel opened by default', () => {
            const panelbodies = fixture.debugElement.queryAll(By.css('.panel-body'));
            expect(panelbodies[0].classes.hidden).toEqual(false);
            expect(panelbodies[1].classes.hidden).toEqual(true);
            expect(panelbodies[2].classes.hidden).toEqual(true);
            expect(panelbodies[3].classes.hidden).toEqual(true);
        });

        it('should have a button with wording "close"', () => {
            const closeBtn = fixture.debugElement.query(By.css('#close-btn'));
            expect(closeBtn.nativeElement.textContent).toContain('Close');
        });

        it('should have a datagrid in the 3 first panels with columns "Information" and "Value"', () => {
            comp.panels = {
                1: true,
                2: true,
                3: true,
                4: true,
            };
            const datagrids = fixture.debugElement.queryAll(By.css('clr-datagrid'));
            const datagridColumns1 = datagrids[0].queryAll(By.css('clr-dg-column'));
            const datagridColumns2 = datagrids[1].queryAll(By.css('clr-dg-column'));
            const datagridColumns3 = datagrids[2].queryAll(By.css('clr-dg-column'));
            expect(datagridColumns1[0].nativeElement.textContent).toContain('Information');
            expect(datagridColumns1[1].nativeElement.textContent).toContain('Value');
            expect(datagridColumns2[0].nativeElement.textContent).toContain('Information');
            expect(datagridColumns2[1].nativeElement.textContent).toContain('Value');
            expect(datagridColumns3[0].nativeElement.textContent).toContain('Information');
            expect(datagridColumns3[1].nativeElement.textContent).toContain('Value');
        });

        it('should have a button with wording "More details"', () => {
            const closeBtn = fixture.debugElement.query(By.css('#more-details-btn'));
            expect(closeBtn.nativeElement.textContent).toContain('More details');
        });
    });

    describe('behaviour', () => {
        it('should redirect to the previous location when clicking on the close button', () => {
            expect(locationStub.back).toHaveBeenCalledTimes(0);
            const closeBtn = fixture.debugElement.query(By.css('#close-btn'));
            closeBtn.triggerEventHandler('click', null);
            expect(locationStub.back).toHaveBeenCalledTimes(1);
        });

        it('should call the getProductCharacteristics method of productCharacteristicsService', () => {
            expect(productCharacteristicsServiceStub.getProductCharacteristics).toHaveBeenCalledTimes(1);
        });

        it('should redirect to the share details location', () => {
            // expect(routerStub.navigateByUrl).toHaveBeenCalledTimes(0);
            // const closeBtn = fixture.debugElement.query(By.css('#more-details-btn'));
            // closeBtn.triggerEventHandler('click', null);
            // expect(routerStub.navigateByUrl).toHaveBeenCalledTimes(1);
        });
    });
});
