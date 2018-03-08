import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule, SelectModule} from '@setl/utils/index';
import {ClarityModule} from '@clr/angular';
import fundItems from './config';

const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
import {FundComponent} from './component';

import {Directive, Input} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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

describe('FundComponent', () => {

    let comp:    FundComponent;
    let fixture: ComponentFixture<FundComponent>;
    let de:      DebugElement;
    let el:      HTMLElement;

    let linkDes;
    let routerLinks;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FundComponent,
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
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(FundComponent);

        comp = fixture.componentInstance;

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
            comp.umbrellaForm.controls['umbrellaFund'].setValue([value]);

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
            comp.umbrellaForm.controls['umbrellaFund'].setValue([value]);

            comp.submitUmbrellaForm();
            tick();
            fixture.detectChanges();

            const formGroupEls = fixture.debugElement.queryAllNodes(By.css('form div.form-group'));
            expect(formGroupEls.length).toEqual(30);
        }));

        describe('conditionnal inputs', () => {

            beforeEach(fakeAsync(() => {
                const value = comp.umbrellaItems[1];
                comp.umbrellaForm.controls['umbrellaFund'].setValue([value]);

                comp.submitUmbrellaForm();
                tick();
                fixture.detectChanges();

                const caretEl = fixture.debugElement.queryAll(By.css('button.clr-treenode-caret'))[1];
                caretEl.triggerEventHandler('click', null);
            }));

            describe('umbrellaName', () => {
                it('should display the umbrellaName input', fakeAsync(() => {
                    const umbrellaBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#umbrellaName'));
                    expect(umbrellaBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['fundStructure'].setValue('UMBRELLA');
                    tick();
                    fixture.detectChanges();
                    const umbrellaAfterEls = fixture.debugElement.queryAllNodes(By.css('input#umbrellaName'));
                    expect(umbrellaAfterEls.length).toEqual(1);
                }));

                it('should not display the umbrellaName input', () => {
                    const umbrellaEls = fixture.debugElement.queryAllNodes(By.css('input#umbrellaName'));
                    expect(umbrellaEls.length).toEqual(0);
                });

                it('should clear the umbrellaName value on fundStructure set to \'FUND\'', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['umbrellaName'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['umbrellaName'].value).toEqual(testValue);

                    comp.fundForm.controls['fundStructure'].setValue('FUND');
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['umbrellaName'].value).toEqual('');
                }));
            });

            describe('euDirectiveType', () => {
                it('should display the euDirectiveType input', fakeAsync(() => {
                    const euDirectiveTypeBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#euDirectiveType'));
                    expect(euDirectiveTypeBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['isEuDirectiveRelevant'].setValue('YES');
                    tick();
                    fixture.detectChanges();
                    const euDirectiveTypeAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#euDirectiveType'));
                    expect(euDirectiveTypeAfterEls.length).toEqual(1);
                }));

                it('should not display the euDirectiveType input', fakeAsync(() => {
                    comp.fundForm.controls['isEuDirectiveRelevant'].setValue('NO');
                    tick();
                    fixture.detectChanges();
                    const euDirectiveTypeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#euDirectiveType'));
                    expect(euDirectiveTypeEls.length).toEqual(0);
                }));

                it('should clear the euDirectiveType value on isEuDirectiveRelevant set to \'NO\'', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['euDirectiveType'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['euDirectiveType'].value).toEqual(testValue);

                    comp.fundForm.controls['isEuDirectiveRelevant'].setValue('NO');
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['euDirectiveType'].value).toEqual('');
                }));
            });

            describe('UCITSVersion', () => {
                it('should display the UCITSVersion input', fakeAsync(() => {
                    const UCITSVersionBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#UCITSVersion'));
                    expect(UCITSVersionBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['isEuDirectiveRelevant'].setValue('YES');
                    comp.fundForm.controls['euDirectiveType'].setValue([{ id: 'UCITS', text: 'UCITS' }]);
                    tick();
                    fixture.detectChanges();
                    const UCITSVersionAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#UCITSVersion'));
                    expect(UCITSVersionAfterEls.length).toEqual(1);
                }));

                it('should not display the UCITSVersion input', fakeAsync(() => {
                    const UCITSVersionBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#UCITSVersion'));
                    expect(UCITSVersionBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['isEuDirectiveRelevant'].setValue('YES');
                    comp.fundForm.controls['euDirectiveType'].setValue([{ id: 'Other', text: 'Other' }]);
                    tick();
                    fixture.detectChanges();
                    const UCITSVersionAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#UCITSVersion'));
                    expect(UCITSVersionAfterEls.length).toEqual(0);
                }));

                it('should clear the UCITSVersion value on isEuDirectiveRelevant set to \'NO\'', fakeAsync(() => {
                    const testValue = {
                        id: 3,
                        text: 'UCITS III',
                    };
                    comp.fundForm.controls['UCITSVersion'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['UCITSVersion'].value).toEqual(testValue);

                    comp.fundForm.controls['isEuDirectiveRelevant'].setValue('NO');
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['UCITSVersion'].value).toEqual('');
                }));

                it('should clear the UCITSVersion value on euDirectiveType not set to \'UCITS\'', fakeAsync(() => {
                    const testValue = {
                        id: 3,
                        text: 'UCITS III',
                    };
                    comp.fundForm.controls['UCITSVersion'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['UCITSVersion'].value).toEqual(testValue);

                    comp.fundForm.controls['euDirectiveType'].setValue([{ id: 'Other', text: 'Other' }]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['UCITSVersion'].value).toEqual('');
                }));
            });

            describe('homeCountryLegalType', () => {
                it('should display the homeCountryLegalType input', fakeAsync(() => {
                    const euDirectiveTypeBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(euDirectiveTypeBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'LU', text: 'Luxembourg'}]);
                    tick();
                    fixture.detectChanges();
                    const euDirectiveTypeAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(euDirectiveTypeAfterEls.length).toEqual(1);
                }));

                it('should not display the homeCountryLegalType input', fakeAsync(() => {
                    const euDirectiveTypeBeforeEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(euDirectiveTypeBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['fundDomicile'].setValue([comp.fundDomicileItems[0]]);
                    tick();
                    fixture.detectChanges();
                    const euDirectiveTypeAfterEls = fixture.debugElement.queryAllNodes(By.css('ng-select#homeCountryLegalType'));
                    expect(euDirectiveTypeAfterEls.length).toEqual(0);
                }));

                it('should clear the homeCountryLegalType value on fundDomicile set to any homeCountryLegalTypeItems key', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['homeCountryLegalType'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['homeCountryLegalType'].value).toEqual(testValue);

                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['homeCountryLegalType'].value).toEqual('');
                }));
            });

            describe('transfertAgent', () => {
                it('should display the transfertAgent input when fundDomicile is set to \'IE\'', fakeAsync(() => {
                    const transfertAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#transfertAgent'));
                    expect(transfertAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'IE', text: 'Ireland'}]);
                    tick();
                    fixture.detectChanges();
                    const transfertAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#transfertAgent'));
                    expect(transfertAgentAfterEls.length).toEqual(1);
                }));

                it('should display the transfertAgent input when fundDomicile is set to \'LU\'', fakeAsync(() => {
                    const transfertAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#transfertAgent'));
                    expect(transfertAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'LU', text: 'Luxembourg'}]);
                    tick();
                    fixture.detectChanges();
                    const transfertAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#transfertAgent'));
                    expect(transfertAgentAfterEls.length).toEqual(1);
                }));

                it('should not display the transfertAgent input', fakeAsync(() => {
                    const transfertAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#transfertAgent'));
                    expect(transfertAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    const transfertAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#transfertAgent'));
                    expect(transfertAgentAfterEls.length).toEqual(0);
                }));

                it('should clear the transfertAgent value', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['transfertAgent'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['transfertAgent'].value).toEqual(testValue);

                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['transfertAgent'].value).toEqual('');
                }));
            });

            describe('centralizingAgent', () => {
                it('should display the centralizingAgent input when fundDomicile is set to \'FR\'', fakeAsync(() => {
                    const centralizingAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#centralizingAgent'));
                    expect(centralizingAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'FR', text: 'France'}]);
                    tick();
                    fixture.detectChanges();
                    const centralizingAgentAfterEls = fixture.debugElement.queryAllNodes(By.css('input#centralizingAgent'));
                    expect(centralizingAgentAfterEls.length).toEqual(1);
                }));

                it('should not display the centralizingAgent input', fakeAsync(() => {
                    const centralizingAgentBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#centralizingAgent'));
                    expect(centralizingAgentBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
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

                    comp.fundForm.controls['fundDomicile'].setValue([{id: 'AF', text: 'Afghanistan'}]);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['centralizingAgent'].value).toEqual('');
                }));
            });

            describe('capitalPreservationLevel', () => {
                it('should display the capitalPreservationLevel input when hasCapitalPreservation is set to \'YES\'', fakeAsync(() => {
                    const capitalPreservationLevelBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationLevel'));
                    expect(capitalPreservationLevelBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCapitalPreservation'].setValue('YES');
                    tick();
                    fixture.detectChanges();
                    const capitalPreservationLevelAfterEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationLevel'));
                    expect(capitalPreservationLevelAfterEls.length).toEqual(1);
                }));

                it('should not display the capitalPreservationLevel input', fakeAsync(() => {
                    const capitalPreservationLevelBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationLevel'));
                    expect(capitalPreservationLevelBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCapitalPreservation'].setValue('NO');
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

                    comp.fundForm.controls['hasCapitalPreservation'].setValue('NO');
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['capitalPreservationLevel'].value).toEqual('');
                }));
            });

            describe('capitalPreservationPeriod', () => {
                it('should display the capitalPreservationPeriod input when hasCapitalPreservation is set to \'YES\'', fakeAsync(() => {
                    const capitalPreservationPeriodBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationPeriod'));
                    expect(capitalPreservationPeriodBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCapitalPreservation'].setValue('YES');
                    tick();
                    fixture.detectChanges();
                    const capitalPreservationPeriodAfterEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationPeriod'));
                    expect(capitalPreservationPeriodAfterEls.length).toEqual(1);
                }));

                it('should not display the capitalPreservationPeriod input', fakeAsync(() => {
                    const capitalPreservationPeriodBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationPeriod'));
                    expect(capitalPreservationPeriodBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCapitalPreservation'].setValue('NO');
                    tick();
                    fixture.detectChanges();
                    const capitalPreservationPeriodAfterEls = fixture.debugElement.queryAllNodes(By.css('input#capitalPreservationPeriod'));
                    expect(capitalPreservationPeriodAfterEls.length).toEqual(0);
                }));

                it('should clear the capitalPreservationPeriod value', fakeAsync(() => {
                    const testValue = 'test test test';
                    comp.fundForm.controls['capitalPreservationPeriod'].setValue(testValue);
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['capitalPreservationPeriod'].value).toEqual(testValue);

                    comp.fundForm.controls['hasCapitalPreservation'].setValue('NO');
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['capitalPreservationPeriod'].value).toEqual('');
                }));
            });

            describe('cppiMultiplier', () => {
                it('should display the cppiMultiplier input when hasCppi is set to \'YES\'', fakeAsync(() => {
                    const cppiMultiplierBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#cppiMultiplier'));
                    expect(cppiMultiplierBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCppi'].setValue('YES');
                    tick();
                    fixture.detectChanges();
                    const cppiMultiplierAfterEls = fixture.debugElement.queryAllNodes(By.css('input#cppiMultiplier'));
                    expect(cppiMultiplierAfterEls.length).toEqual(1);
                }));

                it('should not display the cppiMultiplier input', fakeAsync(() => {
                    const cppiMultiplierBeforeEls = fixture.debugElement.queryAllNodes(By.css('input#cppiMultiplier'));
                    expect(cppiMultiplierBeforeEls.length).toEqual(0);
                    comp.fundForm.controls['hasCppi'].setValue('NO');
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

                    comp.fundForm.controls['hasCppi'].setValue('NO');
                    tick();
                    fixture.detectChanges();
                    expect(comp.fundForm.controls['cppiMultiplier'].value).toEqual('');
                }));
            });
        });
    });
});
