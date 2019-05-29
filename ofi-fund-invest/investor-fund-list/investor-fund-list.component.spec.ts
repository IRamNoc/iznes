import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { Directive, Input, Pipe, PipeTransform } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { OfiInvestorFundListComponent } from './component';
import { FundViewComponent } from '../fund-view/component';
import { InvestFundComponent } from '../invest-fund/component';

import {
    SelectModule,
    DpDatePickerModule,
    SetlPipesModule,
    SetlDirectivesModule,
    NumberConverterService,
    APP_CONFIG,
} from '@setl/utils';
import { RouterMock } from '@setl/core-test-util';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { OfiFundInvestService } from '../../ofi-req-services/ofi-fund-invest/service';
import { MultilingualService } from '@setl/multilingual';
import { InitialisationService, WalletNodeRequestService } from '@setl/core-req-services';

const multilingualServiceStub = jasmine.createSpyObj('MultilingualService', ['translate']);

const activatedRouteStub = {
    params: of({
        tabid: '0',
    }),
};

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' },
})
class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

@Directive({
    selector: 'setl-file-viewer',
})
class SetlFileViewerStub {
    @Input('fileHash') fileHash;
    @Input('viewType') viewType;
}

describe('OfiInvestorFundListComponent', () => {
    let comp: OfiInvestorFundListComponent;
    let fixture: ComponentFixture<OfiInvestorFundListComponent>;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                OfiInvestorFundListComponent,
                TranslatePipe,
                FundViewComponent,
                RouterLinkDirectiveStub,
                InvestFundComponent,
                SetlFileViewerStub,
            ],
            imports: [
                ClarityModule,
                SetlPipesModule,
                SelectModule,
                FormsModule,
                ReactiveFormsModule,
                DpDatePickerModule,
                SetlDirectivesModule,
            ],
            providers: [
                { provide: NgRedux, useFactory: MockNgRedux.getInstance },
                NumberConverterService,
                { provide: APP_CONFIG, useValue: { numberDivider: 1 } },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Router, useValue: RouterMock },
                AlertsService,
                { provide: OfiFundInvestService, useValue: {} },
                { provide: MultilingualService, useValue: multilingualServiceStub },
                { provide: InitialisationService, useValue: {} },
                { provide: WalletNodeRequestService, useValue: {} },
            ],
        });
        await TestBed.compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(OfiInvestorFundListComponent);
        comp = fixture.componentInstance;

        spyOn(comp, 'resizeDatagrid').and.returnValue(undefined);

        MockNgRedux.reset();

        tick();
        fixture.detectChanges();
    }));

    afterEach(() => {
    });

    describe('init', () => {
        it('should run', () => {
            expect(comp.routeTabId).toEqual(0);
        });
    });
});
