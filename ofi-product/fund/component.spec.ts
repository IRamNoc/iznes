import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, Directive, Input, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';

import { ProductHomeComponent } from '@ofi/ofi-main';
import { FundComponent } from './component';

import { NgRedux } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule, SelectModule } from '@setl/utils/index';
import { SetlPipesModule } from '@setl/utils';
import { ClarityModule } from '@clr/angular';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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

const OfiUmbrellaFundServiceStub = jasmine.createSpyObj('OfiUmbrellaFundService', ['defaultRequestUmbrellaFundList', 'requestUmbrellaFundList']);
const OfiManagementCompanyServiceStub = jasmine.createSpyObj('OfiManagementCompanyService', ['defaultRequestManagementCompanyList', 'requestManagementCompanyList']);
const OfiCurrenciesServiceStub = jasmine.createSpyObj('OfiCurrenciesService', ['getCurrencyList']);
const ngReduxSpy = jasmine.createSpyObj('NgRedux', ['dispatch']);
const MultilingualServiceSpy = jasmine.createSpyObj('MultilingualService', ['translate']);
const ConfirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['create']);
const LocationSpy = {
    back: jasmine.createSpy('back'),
};

const iznCreateFund = jasmine.createSpy('iznCreateFund')
    .and.returnValue(
        new Promise((resolve, reject) => {
            const payload =
            {
                "draft": 0,
                "isFundStructure": 0,
                "fundName": "FUND BRANCION",
                "legalEntityIdentifier": null,
                "registerOffice": "lolilol",
                "registerOfficeAddress": null,
                "domicile": "FR",
                "isEuDirective": 0,
                "typeOfEuDirective": null,
                "UcitsVersion": 4,
                "legalForm": 3,
                "nationalNomenclatureOfLegalForm": 4,
                "homeCountryLegalType": null,
                "fundCreationDate": null,
                "fundLaunchate": null,
                "fundCurrency": 0,
                "openOrCloseEnded": 0,
                "fiscalYearEnd": "2018-01-01",
                "isFundOfFund": 0,
                "managementCompanyID": 1,
                "fundAdministratorID": 1,
                "custodianBankID": 1,
                "investmentManagerID": null,
                "principlePromoterID": [
                    2,
                    5
                ],
                "payingAgentID": [
                    2,
                    3
                ],
                "fundManagers": "",
                "transferAgentID": null,
                "centralizingAgentID": null,
                "isDedicatedFund": 0,
                "portfolioCurrencyHedge": 1,
                "globalItermediaryIdentification": null,
                "delegatedManagementCompany": null,
                "investmentAdvisorID": [
                    2,
                    3
                ],
                "auditorID": 2,
                "taxAuditorID": 1,
                "legalAdvisorID": 2,
                "directors": null,
                "hasEmbeddedDirective": 0,
                "hasCapitalPreservation": 0,
                "capitalPreservationLevel": null,
                "capitalPreservationPeriod": null,
                "hasCppi": 1,
                "cppiMultiplier": "6",
                "hasHedgeFundStrategy": 0,
                "isLeveraged": 1,
                "has130Or30Strategy": 1,
                "isFundTargetingEos": 1,
                "isFundTargetingSri": 1,
                "isPassiveFund": 0,
                "hasSecurityiesLending": 0,
                "hasSwap": 1,
                "hasDurationHedge": 0,
                "useDefaultHolidayMgmt": 1,
                "holidayMgmtConfig": "[]",
                "investmentObjective": null,
                "internalReference": "",
                "additionnalNotes": "",
                "umbrellaFundID": "0"
            }

                ;
            resolve([null, { Data: [{ ...payload }] }]);
        }),
);
const iznUpdateFund = jasmine.createSpy('iznUpdateFund')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
);
const defaultRequestIznesFundList = jasmine.createSpy('defaultRequestIznesFundList')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
);
const requestIznesFundList = jasmine.createSpy('requestIznesFundList')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
);

const fundServiceSpy = {
    iznCreateFund,
    iznUpdateFund,
    defaultRequestIznesFundList,
    requestIznesFundList,
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

describe('FundComponent', () => {

    let comp: FundComponent;
    let fixture: ComponentFixture<FundComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    let locationSpy;
    let router;
    let activatedRoute;
    let linkDes;
    let routerLinks;

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
                { provide: NgRedux, useValue: ngReduxSpy },
                { provide: ToasterService, useValue: toasterServiceMock },
                { provide: MultilingualService, useValue: MultilingualServiceSpy },
                { provide: ConfirmationService, useValue: ConfirmationServiceSpy },
                { provide: ActivatedRoute, useValue: ActivatedRouteStub },
                { provide: Location, useValue: LocationSpy },
                LogService,
                NumberConverterService,
                { provide: APP_CONFIG, useValue: { numberDivider: 1 } },
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

        linkDes = fixture.debugElement
            .queryAll(By.directive(RouterLinkDirectiveStub));

        // get attached link directive instances
        // using each DebugElement's injector
        routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));

        router = TestBed.get(Router);
        locationSpy = TestBed.get(Location);

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;

        router.initialNavigation();
        router.navigate(['product-module', 'product', 'fund', 'new']);

        tick();
        fixture.detectChanges();
    }));

    afterEach(() => {
        fundServiceSpy.iznCreateFund.calls.reset();
    });

    describe('structure', () => {
        it('should display a form with 2 select and 3 buttons', () => {

            const selectEls = fixture.debugElement.queryAllNodes(By.css('ng-select'));
            expect(selectEls.length).toEqual(2);

            const anchorEl = fixture.debugElement.queryAllNodes(By.css('a.btn'))[0];
            expect(anchorEl.nativeNode.innerText).toEqual('Add a new Umbrella Fund');

            const buttonEls = fixture.debugElement.queryAllNodes(By.css('button'));
            expect(buttonEls.length).toEqual(3);

            expect(buttonEls[1].nativeNode.innerText).toEqual('Cancel');
            expect(buttonEls[2].nativeNode.innerText).toEqual('Next');

        });
    });

    describe('interface', () => {
        it('should display 3 read-only inputs with umbrella informations', fakeAsync(() => {
            const value = comp.umbrellaItems[1];
            comp.umbrellaControl.setValue([value]);

            tick();
            fixture.detectChanges();

            const inputEls = fixture.debugElement.queryAllNodes(By.css('input'));
            expect(inputEls.length).toEqual(3);
            expect(inputEls[0].nativeNode.value).toEqual(value.text);
        }));

        it('should navigate to the umbrella/funds/shares dashboard', fakeAsync(() => {
            const buttonEls = fixture.debugElement.query(By.css('.submit-container button:first-child'));
            buttonEls.triggerEventHandler('click', null);
            tick();
            expect(router.url).toEqual('/product-module/product');
        }));

        it('should navigate to the umbrella creation page', fakeAsync(() => {
            expect(routerLinks[0].linkParams[0]).toEqual('/product-module/product/umbrella-fund/new');
        }));

        it('should enable the next button', fakeAsync(() => {
            const submitEl = fixture.debugElement.query(By.css('button[type="submit"]'));

            expect(submitEl.nativeElement.disabled).toBe(true);

            const value = comp.umbrellaItems[1];
            comp.umbrellaForm.controls['umbrellaFund'].setValue([value]);

            tick();
            fixture.detectChanges();

            expect(submitEl.nativeElement.disabled).toBe(false);
        }));

        it('should display the fund creation form', fakeAsync(() => {
            const value = comp.umbrellaItems[0];
            comp.umbrellaControl.setValue([value]);

            comp.submitUmbrellaForm();
            tick();
            fixture.detectChanges();

            // Fund Main Informations
            const formGroupMainEls = fixture.debugElement.queryAllNodes(
                By.css('form.fundForm > .well + .well .well:first-child div.form-group'),
            );
            expect(formGroupMainEls.length).toEqual(26);

            // Fund Optionnal Informations (these are still rendered but with display: none from the expandable)
            const formGroupOptionEls = fixture.debugElement.queryAllNodes(
                By.css('form.fundForm > .well + .well .well:last-child div.form-group'),
            );
            expect(formGroupOptionEls.length).toEqual(22);
        }));

        describe('conditionnal inputs', () => {

            beforeEach(fakeAsync(() => {
                const value = comp.umbrellaItems[1];
                comp.umbrellaControl.setValue([value]);

                comp.submitUmbrellaForm();
                tick();
                fixture.detectChanges();

            }));

            describe('typeOfEuDirective', () => {
                it('should display the typeOfEuDirective input', fakeAsync(() => {
                    const typeOfEuDirectiveBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#typeOfEuDirective'));
                    expect(typeOfEuDirectiveBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.YES.toString());
                    tick();
                    fixture.detectChanges();
                    const typeOfEuDirectiveAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#typeOfEuDirective'));
                    expect(typeOfEuDirectiveAfterEls.length).toEqual(1);
                }));

                it('should not display the typeOfEuDirective input', fakeAsync(() => {
                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.NO.toString());
                    tick();
                    fixture.detectChanges();
                    const typeOfEuDirectiveEls = fixture.debugElement.queryAllNodes(By.css('ng-select#typeOfEuDirective'));
                    expect(typeOfEuDirectiveEls.length).toEqual(0);
                }));

                it('should clear the typeOfEuDirective value on isEuDirective set to \'NO\'', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['typeOfEuDirective'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['typeOfEuDirective'].value).toEqual(testValue);

                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.NO.toString());
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['typeOfEuDirective'].value).toEqual([]);
                }));
            });

            describe('ucitsVersion', () => {
                it('should display the UcitsVersion input', fakeAsync(() => {
                    const ucitsVersionBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#UcitsVersion'));
                    expect(ucitsVersionBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.YES.toString());
                    comp.fundForm.controls['typeOfEuDirective'].setValue([{
                        id: comp.enums.typeOfEuDirective.UCITS,
                        text: 'ucits',
                    }]);
                    tick();
                    fixture.detectChanges();
                    const ucitsVersionAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#UcitsVersion'));
                    expect(ucitsVersionAfterEls.length).toEqual(1);
                }));

                it('should not display the ucitsVersion input', fakeAsync(() => {
                    const ucitsVersionBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#ucitsVersion'));
                    expect(ucitsVersionBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.YES.toString());
                    comp.fundForm.controls['typeOfEuDirective'].setValue([{
                        id: comp.enums.typeOfEuDirective.Other,
                        text: 'Other',
                    }]);
                    tick();
                    fixture.detectChanges();
                    const ucitsVersionAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#ucitsVersion'));
                    expect(ucitsVersionAfterEls.length).toEqual(0);
                }));

                it('should clear the UcitsVersion value on isEuDirective set to \'NO\'', fakeAsync(() => {
                    const testValue = {
                        id: 3,
                        text: 'ucits III',
                    };
                    comp.fundForm.controls['UcitsVersion'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['UcitsVersion'].value).toEqual(testValue);

                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.NO.toString());
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['UcitsVersion'].value).toEqual([]);
                }));

                it('should clear the UcitsVersion value on typeOfEuDirective not set to \'ucits\'', fakeAsync(() => {
                    const testValue = {
                        id: 3,
                        text: 'ucits III',
                    };
                    comp.fundForm.controls['UcitsVersion'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['UcitsVersion'].value).toEqual(testValue);

                    comp.fundForm.controls['typeOfEuDirective'].setValue([{
                        id: comp.enums.typeOfEuDirective.Other,
                        text: 'Other',
                    }]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['UcitsVersion'].value).toEqual([]);
                }));
            });

            describe('homeCountryLegalType', () => {
                it('should display the homeCountryLegalType input', fakeAsync(() => {
                    const homeCountryLegalTypeBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(homeCountryLegalTypeBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{ id: 'LU', text: 'Luxembourg' }]);
                    tick();
                    fixture.detectChanges();
                    const homeCountryLegalTypeAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(homeCountryLegalTypeAfterEls.length).toEqual(1);
                }));

                it('should not display the homeCountryLegalType input', fakeAsync(() => {
                    const homeCountryLegalTypeBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(homeCountryLegalTypeBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([comp.domicileItems[0]]);
                    tick();
                    fixture.detectChanges();
                    const homeCountryLegalTypeAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(homeCountryLegalTypeAfterEls.length).toEqual(0);
                }));

                it('should clear the homeCountryLegalType value on fundDomicile set to any homeCountryLegalTypeItems key', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['homeCountryLegalType'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['homeCountryLegalType'].value).toEqual(testValue);

                    comp.fundForm.controls['domicile'].setValue([{ id: 'AF', text: 'Afghanistan' }]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['homeCountryLegalType'].value).toEqual([]);
                }));
            });

            describe('transferAgent', () => {
                it('should display the transferAgent select when fundDomicile is set to \'IE\'', fakeAsync(() => {
                    const transferAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#transferAgent'));
                    expect(transferAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{ id: 'IE', text: 'Ireland' }]);
                    tick();
                    fixture.detectChanges();
                    const transferAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#transferAgent'));
                    expect(transferAgentAfterEls.length).toEqual(1);
                }));

                it('should display the transferAgent select when fundDomicile is set to \'LU\'', fakeAsync(() => {
                    const transferAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#transferAgent'));
                    expect(transferAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{ id: 'LU', text: 'Luxembourg' }]);
                    tick();
                    fixture.detectChanges();
                    const transferAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#transferAgent'));
                    expect(transferAgentAfterEls.length).toEqual(1);
                }));

                it('should not display the transferAgent select', fakeAsync(() => {
                    const transferAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#transferAgent'));
                    expect(transferAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{ id: 'AF', text: 'Afghanistan' }]);
                    tick();
                    fixture.detectChanges();
                    const transferAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#transferAgent'));
                    expect(transferAgentAfterEls.length).toEqual(0);
                }));

                it('should clear the transferAgent value', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['transferAgentID'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['transferAgentID'].value).toEqual(testValue);

                    comp.fundForm.controls['domicile'].setValue([{ id: 'AF', text: 'Afghanistan' }]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['transferAgentID'].value).toEqual([]);
                }));
            });

            describe('centralizingAgent', () => {
                it('should display the centralizingAgent select when fundDomicile is set to \'FR\'', fakeAsync(() => {
                    const centralizingAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#centralizingAgent'));
                    expect(centralizingAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{ id: 'FR', text: 'France' }]);
                    tick();
                    fixture.detectChanges();
                    const centralizingAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#centralizingAgent'));
                    expect(centralizingAgentAfterEls.length).toEqual(1);
                }));

                it('should not display the centralizingAgent select', fakeAsync(() => {
                    const centralizingAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#centralizingAgent'));
                    expect(centralizingAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{ id: 'AF', text: 'Afghanistan' }]);
                    tick();
                    fixture.detectChanges();
                    const centralizingAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#centralizingAgent'));
                    expect(centralizingAgentAfterEls.length).toEqual(0);
                }));

                it('should clear the centralizingAgent value', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['centralizingAgentID'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['centralizingAgentID'].value).toEqual(testValue);

                    comp.fundForm.controls['domicile'].setValue([{ id: 'AF', text: 'Afghanistan' }]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['centralizingAgentID'].value).toEqual([]);
                }));
            });

            describe('capitalPreservationLevel', () => {
                it('should display the capitalPreservationLevel input when hasCapitalPreservation is set to \'YES\'', fakeAsync(() => {
                    const capitalPreservationLevelBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationLevel'));
                    expect(capitalPreservationLevelBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCapitalPreservation'].setValue(comp.enums.hasCapitalPreservation.YES.toString());
                    tick();
                    fixture.detectChanges();
                    const capitalPreservationLevelAfterEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationLevel'));
                    expect(capitalPreservationLevelAfterEls.length).toEqual(1);
                }));

                it('should not display the capitalPreservationLevel input', fakeAsync(() => {
                    const capitalPreservationLevelBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationLevel'));
                    expect(capitalPreservationLevelBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCapitalPreservation'].setValue(comp.enums.hasCapitalPreservation.NO.toString());
                    tick();
                    fixture.detectChanges();
                    const capitalPreservationLevelAfterEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationLevel'));
                    expect(capitalPreservationLevelAfterEls.length).toEqual(0);
                }));

                it('should clear the capitalPreservationLevel value', fakeAsync(() => {
                    const testValue = 123;
                    comp.fundForm.controls['capitalPreservationLevel'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['capitalPreservationLevel'].value).toEqual(testValue);

                    comp.fundForm.controls['hasCapitalPreservation'].setValue(comp.enums.hasCapitalPreservation.NO.toString());
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['capitalPreservationLevel'].value).toBeNull();
                }));
            });

            describe('capitalPreservationPeriod', () => {
                it('should display the capitalPreservationPeriod select when hasCapitalPreservation is set to \'YES\'', fakeAsync(() => {
                    const capitalPreservationPeriodBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#capitalPreservationPeriod'));
                    expect(capitalPreservationPeriodBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCapitalPreservation'].setValue(comp.enums.hasCapitalPreservation.YES.toString());
                    tick();
                    fixture.detectChanges();
                    const capitalPreservationPeriodAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#capitalPreservationPeriod'));
                    expect(capitalPreservationPeriodAfterEls.length).toEqual(1);
                }));

                it('should not display the capitalPreservationPeriod select', fakeAsync(() => {
                    const capitalPreservationPeriodBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#capitalPreservationPeriod'));
                    expect(capitalPreservationPeriodBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCapitalPreservation'].setValue(comp.enums.hasCapitalPreservation.NO.toString());
                    tick();
                    fixture.detectChanges();
                    const capitalPreservationPeriodAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#capitalPreservationPeriod'));
                    expect(capitalPreservationPeriodAfterEls.length).toEqual(0);
                }));

                it('should clear the capitalPreservationPeriod value', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['capitalPreservationPeriod'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['capitalPreservationPeriod'].value).toEqual(testValue);

                    comp.fundForm.controls['hasCapitalPreservation'].setValue(comp.enums.hasCapitalPreservation.NO.toString());
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['capitalPreservationPeriod'].value).toBeNull();
                }));
            });

            describe('cppiMultiplier', () => {
                it('should display the cppiMultiplier input when hasCppi is set to \'YES\'', fakeAsync(() => {
                    const cppiMultiplierBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#cppiMultiplier'));
                    expect(cppiMultiplierBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCppi'].setValue(comp.enums.hasCppi.YES.toString());
                    tick();
                    fixture.detectChanges();
                    const cppiMultiplierAfterEls = fixture.debugElement.queryAllNodes(By.css('input#cppiMultiplier'));
                    expect(cppiMultiplierAfterEls.length).toEqual(1);
                }));

                it('should not display the cppiMultiplier input', fakeAsync(() => {
                    const cppiMultiplierBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#cppiMultiplier'));
                    expect(cppiMultiplierBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCppi'].setValue(comp.enums.hasCppi.NO.toString());
                    tick();
                    fixture.detectChanges();
                    const cppiMultiplierAfterEls = fixture.debugElement.queryAllNodes(By.css('input#cppiMultiplier'));
                    expect(cppiMultiplierAfterEls.length).toEqual(0);
                }));

                it('should clear the cppiMultiplier value', fakeAsync(() => {
                    const testValue = 123;
                    comp.fundForm.controls['cppiMultiplier'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['cppiMultiplier'].value).toEqual(testValue);

                    comp.fundForm.controls['hasCppi'].setValue(comp.enums.hasCppi.NO.toString());
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['cppiMultiplier'].value).toBeNull();
                }));
            });
        });

        describe('network calls', () => {
            const testPayload = {
                fundName: 'FUND BRANCION',
                legalEntityIdentifier: null,
                registerOffice: 'lolilol',
                registerOfficeAddress: null,
                domicile: [
                    {
                        id: 'FR',
                        text: 'France',
                    },
                ],
                isEuDirective: '0',
                isFundStructure: '0',
                typeOfEuDirective: [
                ],
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
                homeCountryLegalType: [
                ],
                fundCreationDate: null,
                fundLaunchate: null,
                fundCurrency: [
                    {
                        id: 0,
                        text: 'EUR',
                    },
                ],
                openOrCloseEnded: '0',
                fiscalYearEnd: '2018-01',
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
                investmentManagerID: [
                ],
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
                transferAgentID: [
                ],
                centralizingAgentID: [
                ],
                isDedicatedFund: '0',
                portfolioCurrencyHedge: [
                    {
                        id: 1,
                        text: 'No Hedge',
                    },
                ],
                globalItermediaryIdentification: null,
                delegatedManagementCompany: [
                ],
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
                capitalPreservationPeriod: [
                ],
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
                holidayMgmtConfig: [
                ],
                investmentObjective: null,
                internalReference: '',
                additionnalNotes: '',
            };
            describe('create mode', () => {
                beforeEach(fakeAsync(() => {
                    const value = comp.umbrellaItems[0];
                    comp.umbrellaControl.setValue([value]);
                    comp.viewMode = 'FUND';
                    comp.fundForm.setValue(testPayload);

                    tick();
                    fixture.detectChanges();

                }));

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

                it('should fire the toaster service with a success message', fakeAsync(() => {
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
                beforeEach(fakeAsync(() => {
                    const value = comp.umbrellaItems[0];
                    comp.umbrellaControl.setValue([value]);
                    comp.viewMode = 'FUND';

                    comp.param = '9';
                    comp.fundForm.setValue(testPayload);

                    tick();
                    fixture.detectChanges();

                }));

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

                it('should fire the toaster service with a success message', fakeAsync(() => {
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
    });
});
