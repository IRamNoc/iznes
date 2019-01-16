import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Directive, Input, Pipe, PipeTransform } from '@angular/core';
import { of, Subject } from 'rxjs';

import { ProductHomeComponent } from '@ofi/ofi-main';
import { FundComponent } from './component';

import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ToasterService } from 'angular2-toaster';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule, SelectModule } from '@setl/utils/index';
import { SetlPipesModule } from '@setl/utils';
import { ClarityModule } from '@clr/angular';
import { ActivatedRoute } from '@angular/router';
import productConfig from '../productConfig';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Fund } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service.model';
import { OfiProductConfigService } from '@ofi/ofi-main/ofi-req-services/ofi-product/configuration/service';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { MultilingualService } from '@setl/multilingual';
import { ConfirmationService, SetlComponentsModule } from '@setl/utils';
import { MemberSocketService } from '@setl/websocket-service';
import { MemberSocketServiceMock } from "@setl/core-test-util/mock/member-socket-service/index";
import { NumberConverterService, LogService, APP_CONFIG } from '@setl/utils';
import { LeiService } from '@ofi/ofi-main/ofi-req-services/ofi-product/lei/lei.service';

const OfiUmbrellaFundServiceStub = jasmine.createSpyObj('OfiUmbrellaFundService', ['fetchUmbrellaList']);
const OfiManagementCompanyServiceStub = jasmine.createSpyObj('OfiManagementCompanyService', ['getManagementCompanyList']);
const OfiCurrenciesServiceStub = jasmine.createSpyObj('OfiCurrenciesService', ['getCurrencyList']);
const MultilingualServiceSpy = jasmine.createSpyObj('MultilingualService', ['translate']);
const ConfirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['create']);
const LocationSpy = {
    back: jasmine.createSpy('back'),
};

const iznCreateFund = jasmine.createSpy('iznCreateFund')
    .and.returnValue(
        new Promise((resolve, reject) => {
            const payload = {
                draft: 0,
                isFundStructure: 0,
                fundName: 'FUND BRANCION',
                legalEntityIdentifier: null,
                registerOffice: 'lolilol',
                registerOfficeAddress: null,
                registerOfficeAddressLine2: null,
                registerOfficeAddressZipCode: null,
                registerOfficeAddressCity: null,
                registerOfficeAddressCountry: null,
                domicile: 'FR',
                isEuDirective: 0,
                typeOfEuDirective: null,
                UcitsVersion: 4,
                legalForm: 3,
                nationalNomenclatureOfLegalForm: 4,
                homeCountryLegalType: null,
                fundCreationDate: null,
                fundLaunchate: null,
                fundCurrency: 0,
                openOrCloseEnded: 0,
                fiscalYearEnd: '01-01',
                isFundOfFund: 0,
                managementCompanyID: 1,
                fundAdministratorID: 1,
                custodianBankID: 1,
                investmentManagerID: null,
                principlePromoterID: [
                    2,
                    5,
                ],
                payingAgentID: [
                    2,
                    3,
                ],
                fundManagers: '',
                transferAgentID: null,
                centralizingAgentID: null,
                isDedicatedFund: 0,
                portfolioCurrencyHedge: 1,
                globalItermediaryIdentification: null,
                delegatedManagementCompany: null,
                investmentAdvisorID: 'lol',
                auditorID: 2,
                taxAuditorID: 1,
                legalAdvisorID: 2,
                directors: null,
                hasEmbeddedDirective: 0,
                hasCapitalPreservation: 0,
                capitalPreservationLevel: null,
                capitalPreservationPeriod: null,
                capitalisationDate: null,
                hasCppi: 1,
                cppiMultiplier: '6',
                hasHedgeFundStrategy: 0,
                isLeveraged: 1,
                has130Or30Strategy: 1,
                isFundTargetingEos: 1,
                isFundTargetingSri: 1,
                isPassiveFund: 0,
                hasSecurityiesLending: 0,
                hasSwap: 1,
                hasDurationHedge: 0,
                useDefaultHolidayMgmt: 1,
                holidayMgmtConfig: '[]',
                investmentObjective: null,
                internalReference: '',
                additionnalNotes: '',
                umbrellaFundID: '0',
            };
            resolve([null, { Data: [{ ...payload }] }]);
        }),
    );
const iznUpdateFund = jasmine.createSpy('iznUpdateFund')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
    );
const getFundList = jasmine.createSpy('getFundList')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
    );
const fetchFundList = jasmine.createSpy('fetchFundList')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
    );

const fundServiceSpy = {
    iznCreateFund,
    iznUpdateFund,
    getFundList,
    fetchFundList,
};

const leiServiceStub = {
    fetchLEIs: () => { },
};

const ActivatedRouteStub = {
    params: of({
        id: null,
    }),
    setParams: (id: string) => {
        this.params = of({
            id,
        });
    },
    queryParams: new Subject(),
};

const pop = jasmine.createSpy('pop')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
    );
const toasterServiceMock = {
    pop,
};

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

// Stub for routerLink
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

const testPayload = {
    fundName: 'FUND BRANCION',
    legalEntityIdentifier: null,
    registerOffice: 'lolilol',
    registerOfficeAddress: null,
    registerOfficeAddressLine2: null,
    registerOfficeAddressZipCode: null,
    registerOfficeAddressCity: null,
    registerOfficeAddressCountry: null,
    domicile: [
        {
            id: 'FR',
            text: 'France',
        },
    ],
    isEuDirective: '0',
    isFundStructure: '0',
    typeOfEuDirective: [],
    UcitsVersion: [
        {
            id: 4,
            text: 'UCITS IV',
        },
    ],
    legalForm: [
        {
            id: 3,
            text: 'Open-ended Investment Company (OEIC)'
        },
    ],
    nationalNomenclatureOfLegalForm: [
        {
            id: 4,
            text: 'ID Open-ended investment company (OEIC)'
        },
    ],
    homeCountryLegalType: [],
    fundCreationDate: null,
    fundLaunchate: null,
    fundCurrency: [
        {
            id: 0,
            text: 'EUR',
        },
    ],
    openOrCloseEnded: '0',
    fiscalYearEnd: '01-01',
    isFundOfFund: '0',
    managementCompanyID: [
        {
            id: 1,
            text: 'Management Company',
        },
    ],
    fundAdministratorID: [
        {
            id: 1,
            text: 'Fund Admin 1',
        },
    ],
    custodianBankID: [
        {
            id: 1,
            text: 'Custodian Bank 1',
        },
    ],
    investmentManagerID: [],
    principlePromoterID: [
        {
            id: 2,
            text: 'Principal Promoter 2',
        },
        {
            id: 5,
            text: 'Principal Promoter 5',
        },
    ],
    payingAgentID: [
        {
            id: 2,
            text: 'Paying Agent 2',
        },
        {
            id: 3,
            text: 'Paying Agent 3',
        },
    ],
    fundManagers: '',
    transferAgentID: [],
    centralizingAgentID: [],
    isDedicatedFund: '0',
    portfolioCurrencyHedge: [
        {
            id: 1,
            text: 'No Hedge',
        },
    ],
    globalItermediaryIdentification: null,
    delegatedManagementCompany: [],
    investmentAdvisorID: [
        {
            id: 2,
            text: 'Investment Advisor 2',
        },
        {
            id: 3,
            text: 'Investment Advisor 3',
        },
    ],
    auditorID: [
        {
            id: 2,
            text: 'Auditor 2',
        },
    ],
    taxAuditorID: [
        {
            id: 1,
            text: 'Tax Auditor 1',
        },
    ],
    legalAdvisorID: [
        {
            id: 2,
            text: 'Legal Advisor 2',
        },
    ],
    directors: null,
    hasEmbeddedDirective: '0',
    hasCapitalPreservation: '0',
    capitalPreservationLevel: null,
    capitalPreservationPeriod: [],
    capitalisationDate: null,
    hasCppi: '1',
    cppiMultiplier: '6',
    hasHedgeFundStrategy: '0',
    isLeveraged: '1',
    has130Or30Strategy: '1',
    isFundTargetingEos: '1',
    isFundTargetingSri: '1',
    isPassiveFund: '0',
    hasSecurityiesLending: '0',
    hasSwap: '1',
    hasDurationHedge: '0',
    useDefaultHolidayMgmt: '1',
    holidayMgmtConfig: [],
    investmentObjective: null,
    internalReference: '',
    additionnalNotes: '',
    tradingAccount: ''
};

describe('FundComponent', () => {

    let comp: FundComponent;
    let fixture: ComponentFixture<FundComponent>;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll((done) => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                FundComponent,
                ProductHomeComponent,
                TranslatePipe,
                RouterLinkDirectiveStub,
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                SelectModule,
                ClarityModule,
                SetlComponentsModule,
                DpDatePickerModule,
                BrowserAnimationsModule,
                SetlPipesModule,
                RouterTestingModule.withRoutes([
                    {
                        path: '',
                        redirectTo: 'product-module/product/fund/new',
                        pathMatch: 'full',
                    },
                    {
                        path: 'product-module',
                        children: [
                            {
                                path: 'product',
                                component: ProductHomeComponent,
                            },
                            {
                                path: 'product/fund/new',
                                component: FundComponent,
                            },
                            {
                                path: 'product/fund/:id',
                                component: FundComponent,
                            },
                        ],
                    },
                ]),
            ],
            providers: [
                { provide: 'product-config', useValue: productConfig },
                { provide: MemberSocketService, useValue: MemberSocketServiceMock },
                OfiProductConfigService,
                { provide: OfiFundService, useValue: fundServiceSpy },
                { provide: OfiUmbrellaFundService, useValue: OfiUmbrellaFundServiceStub },
                { provide: OfiManagementCompanyService, useValue: OfiManagementCompanyServiceStub },
                { provide: OfiCurrenciesService, useValue: OfiCurrenciesServiceStub },
                { provide: NgRedux, useFactory: MockNgRedux.getInstance },
                { provide: ToasterService, useValue: toasterServiceMock },
                { provide: MultilingualService, useValue: MultilingualServiceSpy },
                { provide: ConfirmationService, useValue: ConfirmationServiceSpy },
                { provide: ActivatedRoute, useValue: ActivatedRouteStub },
                { provide: Location, useValue: LocationSpy },
                LogService,
                NumberConverterService,
                { provide: APP_CONFIG, useValue: { numberDivider: 1 } },
                { provide: LeiService, useValue: leiServiceStub },
            ],
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(FundComponent);

        comp = fixture.componentInstance;
        comp.managementCompanyItems = [{ id: '0', text: 'test management company' }];
        comp.umbrellaList = {
            7: {
                umbrellaFundID: 7,
                umbrellaFundName: 'test',
                registerOffice: '4',
                registerOfficeAddress: 'sdΩ',
                registerOfficeAddressLine2: 'registerOffice',
                registerOfficeAddressZipCode: 'registerOffice',
                registerOfficeAddressCity: 'registerOffice',
                registerOfficeAddressCountry: 'LU',
                legalEntityIdentifier: '`xzcd',
                domicile: 'frfr',
                umbrellaFundCreationDate: '2017-01-010:0: 00',
                managementCompanyID: 24,
                fundAdministratorID: 0,
                custodianBankID: 0,
                investmentAdvisorID: [0],
                payingAgentID: [0],
                transferAgentID: '0',
                centralisingAgentID: '0',
                giin: 43453,
                delegatedManagementCompanyID: 0,
                auditorID: '0',
                taxAuditorID: '0',
                principlePromoterID: [0],
                legalAdvisorID: '0',
                directors: '0',
                internalReference: '',
                additionnalNotes: '',
                draft: null,
            },
        };
        comp.umbrellaItems = [
            { id: '0', text: 'none' },
            { id: 7, text: 'test' },
        ];

        comp.fundCurrencyItems = [
            { id: 0, text: 'EUR' },
            { id: 1, text: 'USD' },
            { id: 2, text: 'GBP' },
            { id: 3, text: 'CHF' },
            { id: 4, text: 'JPY' },
            { id: 5, text: 'AUD' },
            { id: 6, text: 'NOK' },
            { id: 7, text: 'SEK' },
            { id: 8, text: 'ZAR' },
            { id: 9, text: 'RUB' },
            { id: 10, text: 'SGD' },
            { id: 11, text: 'AED' },
            { id: 12, text: 'CNY' },
            { id: 13, text: 'PLN' },
        ];

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
        });
    });


    describe('submitFundForm', () => {
        beforeEach(() => {
            comp.fundForm.setValue(testPayload);
            comp.param = '';
        });

        afterEach(() => {
            iznCreateFund.calls.reset();
            pop.calls.reset();
        });

        it('should call fundService.createFund', fakeAsync(() => {
            const expectedResult: Fund = Object({
                ...comp.fundFormValue(),
                draft: 0,
            });
            comp.submitFundForm();
            tick();

            expect(iznCreateFund).toHaveBeenCalledTimes(1);
            expect(iznCreateFund).toHaveBeenCalledWith(expectedResult);
        }));

        xit('should fire the toaster service with a success message', fakeAsync(() => {
            const expectedResult = [
                'success',
                `${testPayload.fundName} has been successfully created.`,
            ];
            comp.submitFundForm();
            tick();

            expect(pop).toHaveBeenCalledTimes(1);
            expect(pop).toHaveBeenCalledWith(...expectedResult);
        }));
    });

    describe('edit mode', () => {
        beforeEach(() => {
            comp.param = '9';
            comp.fundForm.setValue(testPayload);
        });

        afterEach(() => {
            iznUpdateFund.calls.reset();
            pop.calls.reset();
        });

        it('should call fundService.updateFund', fakeAsync(() => {

            const expectedResult: Fund = Object({
                ...comp.fundFormValue(),
                draft: 0,
            });

            comp.submitFundForm();

            tick();

            expect(iznUpdateFund).toHaveBeenCalledTimes(1);
            expect(iznUpdateFund).toHaveBeenCalledWith(comp.param, expectedResult);
        }));

        xit('should fire the toaster service with a success message', fakeAsync(() => {
            const expectedResult = [
                'success',
                `${testPayload.fundName} has been successfully updated.`,
            ];
            comp.submitFundForm();
            tick();

            expect(pop).toHaveBeenCalledTimes(1);
            expect(pop).toHaveBeenCalledWith(...expectedResult);
        }));
    });
});