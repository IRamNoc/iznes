import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, DebugNode, Pipe, PipeTransform } from '@angular/core';
import { OfiMyInformationsComponent, ViewMode } from './component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from '@setl/utils/index';
import { SetlPipesModule } from '@setl/utils';
import { NgRedux } from '@angular-redux/store';
import { KycMyInformations } from '../../ofi-store/ofi-kyc/my-informations';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { MultilingualService } from '@setl/multilingual';
import config from '../config';

const MultilingualServiceSpy = jasmine.createSpyObj('MultilingualService', ['translate']);

const ngReduxSpy = jasmine.createSpyObj('NgRedux', ['dispatch']);

class OfiManagementCompanyServiceMock {
    getManagementCompanyList() {
        return;
    }
}

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('OfiMyInformationsComponent', () => {

    let comp: OfiMyInformationsComponent;
    let fixture: ComponentFixture<OfiMyInformationsComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                OfiMyInformationsComponent,
                TranslatePipe,
            ],
            imports: [
                ReactiveFormsModule,
                SelectModule,
                SetlPipesModule,
            ],
            providers: [
                { provide: NgRedux, useValue: ngReduxSpy },
                { provide: OfiManagementCompanyService, useClass: OfiManagementCompanyServiceMock },
                { provide: MultilingualService, useValue: MultilingualServiceSpy },
                { provide: 'my-information-config', useValue: config },
            ],
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
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
            investorType: 0,
        };

        comp.userInfo = fakeUser;
        comp.type = 46;

        tick();
        fixture.detectChanges();
    }));

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
        describe('@Input viewMode', () => {
            it('should display a close button in @Input viewMode \'POPUP\' mode', () => {
                comp.viewMode = ViewMode.POPUP;
                fixture.detectChanges();
                const closeButton = fixture.debugElement.query(By.css('#btnKycClose'));
                expect(closeButton).not.toBeNull();
            });

            it('should not display a close button in @Input viewMode \'PAGE\' mode', () => {
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
