import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement, DebugNode} from '@angular/core';
import {OfiMyInformationsComponent, ViewMode} from './component';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from '@setl/utils/index';
import {NgRedux} from '@angular-redux/store';
import {KycMyInformations} from '../../ofi-store/ofi-kyc/my-informations';
import {OfiManagementCompanyService} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import {MultilingualService} from '@setl/multilingual';

const ngReduxSpy = jasmine.createSpyObj('NgRedux', ['dispatch']);

class OfiManagementCompanyServiceMock {
    static defaultRequestManagementCompanyList() {
        return;
    }
}

const MultilingualServiceStub = {

};

describe('OfiMyInformationsComponent', () => {

    let comp: OfiMyInformationsComponent;
    let fixture: ComponentFixture<OfiMyInformationsComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll((done) => (async () => {
        TestBed.resetTestingModule();
        spyOn(OfiManagementCompanyService, 'defaultRequestManagementCompanyList');
        TestBed.configureTestingModule({
            declarations: [
                OfiMyInformationsComponent,
            ],
            imports: [
                ReactiveFormsModule,
                SelectModule,
            ],
            providers: [
                { provide: NgRedux, useValue: ngReduxSpy },
                { provide: OfiManagementCompanyService, useClass: OfiManagementCompanyServiceMock },
                { provide: MultilingualService, useValue: MultilingualServiceStub },
            ]
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
        };

        comp.userInfo = fakeUser;
        comp.type = '46';

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
