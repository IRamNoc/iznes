import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgRedux } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfiFundAccessComponent } from './component';
import { ClarityModule } from '@clr/angular';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { FileService } from '@setl/core-req-services/file/file.service';
import { MessagesService } from '@setl/core-messages';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, SetlPipesModule } from '@setl/utils';
import { FileViewerModule } from '@setl/core-fileviewer';
import { FileDropModule } from '@setl/core-filedrop';
import { OfiFundShareService } from '../../ofi-req-services/ofi-product/fund-share/service';
import { MemberSocketService } from '@setl/websocket-service';
import { APP_CONFIG } from '@setl/utils/index';
import { MultilingualService } from '@setl/multilingual';
import { OfiFundAccessTable } from "./access-table/component";

const MultilingualServiceSpy = jasmine.createSpyObj('MultilingualService', ['translate']);

const ngReduxSpy = jasmine.createSpyObj('NgRedux', ['dispatch']);

const updateInvestor = jasmine.createSpy('updateInvestor')
.and.returnValue(
    new Promise((resolve, reject) => {
        resolve();
    }),
);

const OfiKycServiceStub = {
    updateInvestor,
};

const MessagesServiceStub = {};

const requestInvestorFundAccess = jasmine.createSpy('requestInvestorFundAccess')
.and.returnValue(
    new Promise((resolve, reject) => {
        resolve();
    }),
);

const OfiFundShareServiceStub = {
    requestInvestorFundAccess,
};

const pop = jasmine.createSpy('pop')
.and.returnValue(
    new Promise((resolve, reject) => {
        resolve();
    }),
);
const toasterServiceStub = {
    pop,
};

const activatedRouteStub = {
    params: of({
        kycId: '1',
    }),
};

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('OfiFundAccessComponent', () => {

    let comp: OfiFundAccessComponent;
    let fixture: ComponentFixture<OfiFundAccessComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll((done) => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                OfiFundAccessComponent,
                TranslatePipe,
                OfiFundAccessTable
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                ClarityModule,
                SetlPipesModule,
                FileViewerModule,
                FileDropModule,
            ],
            providers: [
                { provide: APP_CONFIG, useValue: {} },
                { provide: NgRedux, useValue: ngReduxSpy },
                { provide: ToasterService, useValue: toasterServiceStub },
                { provide: OfiKycService, useValue: OfiKycServiceStub },
                { provide: OfiFundShareService, useValue: OfiFundShareServiceStub },
                { provide: MessagesService, useValue: MessagesServiceStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: MultilingualService, useValue: MultilingualServiceSpy },
                ConfirmationService,
                FileService,
                MemberSocketService,
            ],
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(OfiFundAccessComponent);
        comp = fixture.componentInstance;

        tick();
        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;

    }));

    afterEach(() => {
        updateInvestor.calls.reset();
    });

    describe('structure', () => {
        it('should have disabled companyName, firstName, lastName, email, phoneNumber, approvalDateRequest inputs', () => {
            const companyNameEl = de.queryAll(By.css('#companyName'));
            const firstNameEl = de.queryAll(By.css('#firstName'));
            const lastNameEl = de.queryAll(By.css('#lastName'));
            const emailEl = de.queryAll(By.css('#email'));
            const phoneNumberEl = de.queryAll(By.css('#phoneNumber'));
            const approvalDateRequestEl = de.queryAll(By.css('#approvalDateRequest'));

            expect(companyNameEl.length).toEqual(1);
            expect(firstNameEl.length).toEqual(1);
            expect(lastNameEl.length).toEqual(1);
            expect(emailEl.length).toEqual(1);
            expect(phoneNumberEl.length).toEqual(1);
            expect(approvalDateRequestEl.length).toEqual(1);

            expect(companyNameEl[0].nativeElement.disabled).toEqual(true);
            expect(firstNameEl[0].nativeElement.disabled).toEqual(true);
            expect(lastNameEl[0].nativeElement.disabled).toEqual(true);
            expect(emailEl[0].nativeElement.disabled).toEqual(true);
            expect(phoneNumberEl[0].nativeElement.disabled).toEqual(true);
            expect(approvalDateRequestEl[0].nativeElement.disabled).toEqual(true);

        });

        it('should have an enabled clientReference input', () => {
            const clientReferenceEl = de.queryAll(By.css('#clientReference'));
            expect(clientReferenceEl.length).toEqual(1);
            expect(clientReferenceEl[0].nativeElement.disabled).toEqual(false);
        });
    });

    describe('behaviour', () => {
        it('should fill the form with redux data', fakeAsync(() => {
            const fakeKycList = [
                {
                    kycID: 1,
                    investorUserID: 22,
                    investorUserName: 'test username',
                    investorFirstName: 'test firstname',
                    investorLastName: 'test lastname',
                    investorEmail: 'test email',
                    investorPhoneCode: '+7 840',
                    investorPhoneNumber: '987654',
                    investorCompanyName: 'test company name',
                    amUserName: 'am',
                    amFirstName: 'uoiuoi',
                    amLastName: 'nnono',
                    lastUpdated: '2018-04-25 16:11:09',
                    lastReviewBy: 11,
                    investorWalletID: 13,
                    walletName: 'IZN0000013',
                    companyName: 'Management Company',
                    isInvited: 1,
                    invitedID: 20,
                    status: -1,
                    dateEntered: '2018-04-25 16:09:01',
                    clientReference: 'lol trefh',
                },
            ];
            comp.amKycListObs.next(fakeKycList);

            tick();
            fixture.detectChanges();

            const companyNameEl = de.queryAll(By.css('#companyName'));
            const clientReferenceEl = de.queryAll(By.css('#clientReference'));
            const firstNameEl = de.queryAll(By.css('#firstName'));
            const lastNameEl = de.queryAll(By.css('#lastName'));
            const emailEl = de.queryAll(By.css('#email'));
            const phoneNumberEl = de.queryAll(By.css('#phoneNumber'));
            const approvalDateRequestEl = de.queryAll(By.css('#approvalDateRequest'));

            expect(companyNameEl[0].nativeElement.value).toEqual(fakeKycList[0].investorCompanyName);
            expect(clientReferenceEl[0].nativeElement.value).toEqual(fakeKycList[0].clientReference);
            expect(firstNameEl[0].nativeElement.value).toEqual(fakeKycList[0].investorFirstName);
            expect(lastNameEl[0].nativeElement.value).toEqual(fakeKycList[0].investorLastName);
            expect(emailEl[0].nativeElement.value).toEqual(fakeKycList[0].investorEmail);
            expect(phoneNumberEl[0].nativeElement.value).toContain(fakeKycList[0].investorPhoneCode);
            expect(phoneNumberEl[0].nativeElement.value).toContain(fakeKycList[0].investorPhoneNumber);
            expect(approvalDateRequestEl[0].nativeElement.value).toContain(fakeKycList[0].dateEntered.slice(0, 4));
            expect(approvalDateRequestEl[0].nativeElement.value).toContain(fakeKycList[0].dateEntered.slice(5, 7));
            expect(approvalDateRequestEl[0].nativeElement.value).toContain(fakeKycList[0].dateEntered.slice(8, 10));
        }));

        it('should fire the updateInvestor method of the OfiKycService', fakeAsync(() => {
            const expectedResult = {
                invitedID: 20,
                clientReference: 'lol trefh',
            };
            const fakeKycList = [
                {
                    kycID: 1,
                    investorUserID: 22,
                    investorUserName: 'test username',
                    investorFirstName: 'test firstname',
                    investorLastName: 'test lastname',
                    investorEmail: 'test email',
                    investorPhoneCode: '+7 840',
                    investorPhoneNumber: '987654',
                    investorCompanyName: 'test company name',
                    amUserName: 'am',
                    amFirstName: 'uoiuoi',
                    amLastName: 'nnono',
                    lastUpdated: '2018-04-25 16:11:09',
                    lastReviewBy: 11,
                    investorWalletID: 13,
                    walletName: 'IZN0000013',
                    companyName: 'Management Company',
                    isInvited: 1,
                    invitedID: expectedResult.invitedID,
                    status: -1,
                    dateEntered: '2018-04-25 16:09:01',
                    clientReference: expectedResult.clientReference,
                },
            ];
            comp.amKycListObs.next(fakeKycList);

            tick();
            fixture.detectChanges();

            comp.saveClientReference();

            expect(updateInvestor).toHaveBeenCalledTimes(1);
            expect(updateInvestor).toHaveBeenCalledWith(expectedResult);
        }));
    });
});
