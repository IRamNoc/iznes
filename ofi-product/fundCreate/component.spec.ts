import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {DebugElement, Directive, Input} from '@angular/core';
import {By} from '@angular/platform-browser';
import * as _ from 'lodash';


import {NgRedux} from '@angular-redux/store';
import {ToasterService} from 'angular2-toaster';
import {Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule, SelectModule} from '@setl/utils/index';
import {ClarityModule} from '@clr/angular';
import fundItems from '../fundConfig';

const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
const OfiUmbrellaFundServiceSpy = jasmine.createSpyObj('OfiUmbrellaFundService', ['defaultRequestUmbrellaFundList', 'requestUmbrellaFundList']);
const OfiManagementCompanyServiceSpy = jasmine.createSpyObj('OfiManagementCompanyService', ['defaultRequestManagementCompanyList', 'requestManagementCompanyList']);
const ngReduxSpy = jasmine.createSpyObj('NgRedux', ['dispatch']);

import {FundCreateComponent} from './component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OfiFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import {Fund} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service.model';
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import {OfiManagementCompanyService} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';

const iznCreateFund = jasmine.createSpy('iznCreateFund')
    .and.returnValue(
        new Promise((resolve, reject) => {
        resolve();
    })
    );
const fundServiceSpy = {
    iznCreateFund: iznCreateFund,
};


const toasterServiceMock = {
    pop: () => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
};

// Stub for routerLink
@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
class RouterLinkStubDirective {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

describe('FundCreateComponent', () => {

    let comp:    FundCreateComponent;
    let fixture: ComponentFixture<FundCreateComponent>;
    let de:      DebugElement;
    let el:      HTMLElement;

    let linkDes;
    let routerLinks;

    beforeAll((done) => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                FundCreateComponent,
                RouterLinkStubDirective,
            ],
            imports: [
                ReactiveFormsModule,
                SelectModule,
                ClarityModule,
                SelectModule,
                DpDatePickerModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: 'fund-items', useValue: fundItems },
                { provide: Router, useValue: routerSpy },
                { provide: OfiFundService, useValue: fundServiceSpy },
                { provide: OfiUmbrellaFundService, useValue: OfiUmbrellaFundServiceSpy },
                { provide: OfiManagementCompanyService, useValue: OfiManagementCompanyServiceSpy },
                { provide: NgRedux, useValue: ngReduxSpy },
                { provide: ToasterService, useValue: toasterServiceMock }
            ]
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(FundCreateComponent);

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
                investmentManagerID: 0,
                investmentAdvisorID: 0,
                payingAgentID: 0,
                transferAgentID: 0,
                centralisingAgentID: 0,
                giin: '43453',
                delegatedManagementCompanyID: 0,
                auditorID: 0,
                taxAuditorID: 0,
                principlePromoterID: 0,
                legalAdvisorID: 0,
                directors: '0'
            },
        };
        comp.umbrellaItems = [
            { id: '0', text: 'none' },
            { id: 7, text: 'test' },
        ];

        tick();
        fixture.detectChanges();

        linkDes = fixture.debugElement
            .queryAll(By.directive(RouterLinkStubDirective));
        routerLinks = linkDes.map(des => des.injector.get(RouterLinkStubDirective));

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;

    }));

    afterEach(() => {
        routerSpy.navigate.calls.reset();
    });

    describe('structure', () => {
        it('should display a form with 1 select and 3 buttons', () => {

            const selectEls = fixture.debugElement.queryAllNodes(By.css('ng-select'));
            expect(selectEls.length).toEqual(1);

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

        it('should navigate to the umbrella/funds/shares dashboard', () => {
            const buttonEls = fixture.debugElement.query(By.css('.submit-container button:first-child'));
            buttonEls.triggerEventHandler('click', null);

            expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
            expect(routerSpy.navigate).toHaveBeenCalledWith(['product-module', 'home']);
        });

        it('should navigate to the umbrella creation page', () => {
            const anchorEl = fixture.debugElement.query(By.css('.btn-container a.btn'));
            expect(routerLinks[0].navigatedTo).toBeNull();

            anchorEl.triggerEventHandler('click', null);

            expect(routerLinks[0].navigatedTo).toEqual('/product-module/umbrella-fund');
        });

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
            const value = comp.umbrellaItems[1];
            comp.umbrellaControl.setValue([value]);

            comp.submitUmbrellaForm();
            tick();
            fixture.detectChanges();

            const formGroupEls = fixture.debugElement.queryAllNodes(By.css('clr-tree-node:nth-of-type(n+1) div.form-group'));
            expect(formGroupEls.length).toEqual(31);
        }));

        describe('conditionnal inputs', () => {

            beforeEach(fakeAsync(() => {
                const value = comp.umbrellaItems[1];
                comp.umbrellaControl.setValue([value]);

                comp.submitUmbrellaForm();
                tick();
                fixture.detectChanges();

                const caretEl = fixture.debugElement.queryAll(By.css('button.clr-treenode-caret'));
                caretEl[caretEl.length - 1].triggerEventHandler('click', null);
            }));

            describe('umbrellaFundID', () => {
                it('should display the umbrellaFundID input', fakeAsync(() => {
                    const value1 = comp.umbrellaItems[0];
                    comp.umbrellaControl.setValue([value1]);
                    tick();
                    fixture.detectChanges();

                    const umbrellaBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#umbrellaFundID'));
                    expect(umbrellaBeforeEls.length).toEqual(0);

                    const value2 = comp.umbrellaItems[1];
                    comp.umbrellaControl.setValue([value2]);
                    tick();
                    fixture.detectChanges();
                    const umbrellaAfterEls = fixture.debugElement.queryAllNodes(By.css('input#umbrellaFundID'));
                    expect(umbrellaAfterEls.length).toEqual(1);
                }));

                it('should not display the umbrellaFundID input', fakeAsync(() => {
                    const value1 = comp.umbrellaItems[0];
                    comp.umbrellaControl.setValue([value1]);
                    tick();
                    fixture.detectChanges();
                    const umbrellaEls = fixture.debugElement.queryAllNodes(By.css('input#umbrellaFundID'));
                    expect(umbrellaEls.length).toEqual(0);
                }));

            });

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
                it('should display the ucitsVersion input', fakeAsync(() => {
                    const ucitsVersionBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#ucitsVersion'));
                    expect(ucitsVersionBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.YES.toString());
                    comp.fundForm.controls['typeOfEuDirective'].setValue([{ id: comp.enums.typeOfEuDirective.UCITS, text: 'ucits' }]);
                    tick();
                    fixture.detectChanges();
                    const ucitsVersionAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#ucitsVersion'));
                    expect(ucitsVersionAfterEls.length).toEqual(1);
                }));

                it('should not display the ucitsVersion input', fakeAsync(() => {
                    const ucitsVersionBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#ucitsVersion'));
                    expect(ucitsVersionBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.YES.toString());
                    comp.fundForm.controls['typeOfEuDirective'].setValue([{ id: comp.enums.typeOfEuDirective.Other, text: 'Other' }]);
                    tick();
                    fixture.detectChanges();
                    const ucitsVersionAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#ucitsVersion'));
                    expect(ucitsVersionAfterEls.length).toEqual(0);
                }));

                it('should clear the ucitsVersion value on isEuDirective set to \'NO\'', fakeAsync(() => {
                    const testValue = {
                        id: 3,
                        text: 'ucits III',
                    };
                    comp.fundForm.controls['ucitsVersion'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['ucitsVersion'].value).toEqual(testValue);

                    comp.fundForm.controls['isEuDirective'].setValue(comp.enums.isEuDirective.NO.toString());
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['ucitsVersion'].value).toEqual([]);
                }));

                it('should clear the ucitsVersion value on typeOfEuDirective not set to \'ucits\'', fakeAsync(() => {
                    const testValue = {
                        id: 3,
                        text: 'ucits III',
                    };
                    comp.fundForm.controls['ucitsVersion'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['ucitsVersion'].value).toEqual(testValue);

                    comp.fundForm.controls['typeOfEuDirective'].setValue([{ id: comp.enums.typeOfEuDirective.Other, text: 'Other' }]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['ucitsVersion'].value).toEqual([]);
                }));
            });

            describe('homeCountryLegalType', () => {
                it('should display the homeCountryLegalType input', fakeAsync(() => {
                    const homeCountryLegalTypeBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(homeCountryLegalTypeBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{id: 'LU', text: 'Luxembourg'}]);
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

                    comp.fundForm.controls['domicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['homeCountryLegalType'].value).toEqual([]);
                }));
            });

            describe('transferAgent', () => {
                it('should display the transferAgent input when fundDomicile is set to \'IE\'', fakeAsync(() => {
                    const transferAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#transferAgent'));
                    expect(transferAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{id: 'IE', text: 'Ireland'}]);
                    tick();
                    fixture.detectChanges();
                    const transferAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#transferAgent'));
                    expect(transferAgentAfterEls.length).toEqual(1);
                }));

                it('should display the transferAgent input when fundDomicile is set to \'LU\'', fakeAsync(() => {
                    const transferAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#transferAgent'));
                    expect(transferAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{id: 'LU', text: 'Luxembourg'}]);
                    tick();
                    fixture.detectChanges();
                    const transferAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#transferAgent'));
                    expect(transferAgentAfterEls.length).toEqual(1);
                }));

                it('should not display the transferAgent input', fakeAsync(() => {
                    const transferAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#transferAgent'));
                    expect(transferAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    const transferAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#transferAgent'));
                    expect(transferAgentAfterEls.length).toEqual(0);
                }));

                it('should clear the transferAgent value', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['transferAgent'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['transferAgent'].value).toEqual(testValue);

                    comp.fundForm.controls['domicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['transferAgent'].value).toBeNull();
                }));
            });

            describe('centralizingAgent', () => {
                it('should display the centralizingAgent input when fundDomicile is set to \'FR\'', fakeAsync(() => {
                    const centralizingAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#centralizingAgent'));
                    expect(centralizingAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{id: 'FR', text: 'France'}]);
                    tick();
                    fixture.detectChanges();
                    const centralizingAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#centralizingAgent'));
                    expect(centralizingAgentAfterEls.length).toEqual(1);
                }));

                it('should not display the centralizingAgent input', fakeAsync(() => {
                    const centralizingAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#centralizingAgent'));
                    expect(centralizingAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['domicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    const centralizingAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#centralizingAgent'));
                    expect(centralizingAgentAfterEls.length).toEqual(0);
                }));

                it('should clear the centralizingAgent value', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['centralizingAgent'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['centralizingAgent'].value).toEqual(testValue);

                    comp.fundForm.controls['domicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['centralizingAgent'].value).toBeNull();
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

        it('should call fundService.createFund', fakeAsync(() => {

            const value = comp.umbrellaItems[1];
            comp.umbrellaControl.setValue([value]);

            comp.submitUmbrellaForm();
            tick();
            fixture.detectChanges();

            const caretEl = fixture.debugElement.queryAll(By.css('button.clr-treenode-caret'))[1];
            caretEl.triggerEventHandler('click', null);

            const testPayload = {
                isFundStructure: '1',
                fundName: 'test',
                AuMFund: 'test',
                AuMFundDate: '2017-02-02',
                legalEntityIdentifier: null,
                registerOffice: null,
                registerOfficeAddress: null,
                domicile: [{id: 'AF', text: 'Afghanistan'}],
                isEuDirective: '0',
                typeOfEuDirective: null,
                ucitsVersion: null,
                legalForm: [{ id: '0', text: 'Contractual Fund' }],
                nationalNomenclatureOfLegalForm: [{ id: '2', text: 'BE Fonds commun de placement (FCP)' }],
                homeCountryLegalType: null,
                fundCreationDate: null,
                fundLaunchate: null,
                fundCurrency: [{ text: 'Rwanda Franc RWF', id: '124' }],
                openOrCloseEnded: '0',
                fiscalYearEnd: '2017-02',
                isFundOfFund: '0',
                managementCompanyID: [{ id: '0', text: 'test management company' }],
                fundAdministrator: [{ id : '1', text: 'Fund Admin 1' }],
                custodianBank: [{ id : '1', text: 'Custodian Bank 1' }],
                investmentManager: null,
                principalPromoter: null,
                payingAgent: null,
                fundManagers: null,
                transferAgent: null,
                centralizingAgent: null,
                isDedicatedFund: '0',
                portfolioCurrencyHedge: [{ id : '1', text: 'No Hedge' }],
                globalItermediaryIdentification: null,
                delegatedManagementCompany: null,
                investmentAdvisor: null,
                auditor: null,
                taxAuditor: null,
                legalAdvisor: null,
                directors: null,
                pocket: null,
                hasEmbeddedDirective: null,
                hasCapitalPreservation: null,
                capitalPreservationLevel: null,
                capitalPreservationPeriod: null,
                hasCppi: null,
                cppiMultiplier: null,
                hasHedgeFundStrategy: null,
                isLeveraged: null,
                has130Or30Strategy: null,
                isfundTargetingEos: null,
                isFundTargetingSri: null,
                isPassiveFund: null,
                hasSecurityiesLending: null,
                hasSwap: null,
                hasDurationHedge: null,
                investmentObjective: null
            };

            comp.fundForm.setValue(testPayload);

            const submitEl = fixture.debugElement.query(By.css('#submitfund'));
            submitEl.triggerEventHandler('click', null);
            comp.submitFundForm();

            const expectedResult: Fund = Object(_.omit({
                ...testPayload,
                domicile: testPayload.domicile[0].id,
                legalForm: testPayload.legalForm[0].id,
                nationalNomenclatureOfLegalForm: testPayload.nationalNomenclatureOfLegalForm[0].id,
                fundCurrency: testPayload.fundCurrency[0].id,
                portfolioCurrencyHedge: testPayload.portfolioCurrencyHedge[0].id,
                fiscalYearEnd: testPayload.fiscalYearEnd + '-01',
                fundAdministrator: testPayload.fundAdministrator[0].id,
                custodianBank: testPayload.custodianBank[0].id,
                managementCompanyID: testPayload.managementCompanyID[0].id,
                umbrellaFundID: comp.umbrellaControl.value[0].id,
            }, ['AuMFund', 'AuMFundDate']));

            expect(iznCreateFund).toHaveBeenCalledTimes(1);
            expect(iznCreateFund).toHaveBeenCalledWith(expectedResult);
        }));
    });
});
