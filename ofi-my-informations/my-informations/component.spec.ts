import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {DebugElement, DebugNode} from '@angular/core';
import {OfiMyInformationsComponent, ViewMode} from './component';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from '@setl/utils/index';
import { NgReduxModule } from '@angular-redux/store';
import {KycMyInformations} from '../../ofi-store/ofi-kyc/my-informations';
import {Observable} from 'rxjs/Observable';
import {detectChanges} from '@angular/core/src/render3';

describe('kyc-my-informations', () => {

    let comp:    OfiMyInformationsComponent;
    let fixture: ComponentFixture<OfiMyInformationsComponent>;
    let de:      DebugElement;
    let el:      HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OfiMyInformationsComponent,
            ],
            imports: [
                ReactiveFormsModule,
                SelectModule,
                NgReduxModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OfiMyInformationsComponent);

        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;

        const fakeUser: KycMyInformations = {
            email: '',
            firstName: '',
            lastName: '',
            invitedBy: {
                email: '',
                firstName: '',
                lastName: '',
                companyName: '',
                phoneCode: '+33',
                phoneNumber: '',
            },
            amCompanyName: '',
            companyName: '',
            phoneCode: '+33',
            phoneNumber: '',
            amManagementCompanyID: 0,
            invitationToken: '',
        };

        comp.header = 'header';
        comp.icon = 'user';
        comp.subTitle = 'subTitle';
        comp.userInfo = Observable.of(fakeUser);
    });

    describe('structure', () => {
        it('should render a form with 6 inputs', () => {
            expect(de.name).toBe('form');

            const inputs: DebugNode[] = fixture.debugElement.queryAllNodes(By.css('input'));
            expect(inputs.length).toBe(6);
            expect(fixture.debugElement.queryAllNodes(By.css('#kyc_additionnal_email')).length).toBe(1);
            expect(fixture.debugElement.queryAllNodes(By.css('#kyc_additionnal_invitedBy')).length).toBe(1);
        });
    });

    describe('interface', () => {
        it('should display the header @Input as title', () => {
            const expectedResult = 'Fake Title';
            comp.header = expectedResult;
            fixture.detectChanges();
            const headerEl = fixture.debugElement.query(By.css('#ofi-welcome-additionnal')).nativeElement;
            expect(headerEl.textContent).toContain(expectedResult);
        });

        it('should display the subtitle @Input as subtitle', () => {
            const expectedResult = 'Fake subTitle';
            comp.subTitle = expectedResult;
            fixture.detectChanges();
            const subTitleEl = fixture.debugElement.query(By.css('h5')).nativeElement;
            expect(subTitleEl.textContent).toContain(expectedResult);
        });

        it('should add a class name to the header icon with @Input icon', () => {
            const expectedResult = 'fa-user';
            comp.icon = expectedResult;
            fixture.detectChanges();
            const iconEl = fixture.debugElement.query(By.css('i')).nativeElement;
            expect(iconEl.classList).toContain(expectedResult);
        });

        describe('@Input viewMode', () => {
            it('should display a close button in @Input viewMode \'POPUP\' mode', () => {
                comp.viewMode = ViewMode.POPUP;
                fixture.detectChanges();
                const closeButton = fixture.debugElement.query(By.css('#btnKycClose'));
                expect(closeButton).not.toBeNull();
            });

            it('should not display a close button in @Input viewMode \'PAGE\' mode', () => {
                comp.header = 'header';
                comp.icon = 'icon';
                comp.subTitle = 'subTitle';
                comp.viewMode = ViewMode.PAGE;
                fixture.detectChanges();
                const closeButton = fixture.debugElement.query(By.css('#btnKycClose'));
                expect(closeButton).toBeNull();
            });
        });

        it('should fire the @Output onSubmit with the form data', fakeAsync(() => {
            comp.viewMode = ViewMode.PAGE;
            fixture.detectChanges();
            tick();
            const expectedResult = {
                ...comp.additionnalForm.value,
                phoneCode: comp.additionnalForm.value.phoneCode[0].id,
            };
            comp.onSubmit.subscribe(testResult => expect(testResult).toEqual(expectedResult));
            comp.onSubmitClick();
        }));

        it('should fire the @Output onClose when clicking on the close button', fakeAsync(() => {
            comp.viewMode = ViewMode.POPUP;
            fixture.detectChanges();
            tick();
            const closeBtn = fixture.debugElement.query(By.css('#btnKycClose'));
            closeBtn.triggerEventHandler('click', null);
            const testFunc = jasmine.createSpy('test');
            comp.onClose.subscribe((d) => {
                testFunc();
                expect(testFunc).toHaveBeenCalledTimes(1);
            });
        }));
    });
});
