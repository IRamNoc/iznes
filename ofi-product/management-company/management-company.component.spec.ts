import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { Directive, Input } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ToasterService } from 'angular2-toaster';

import { OfiManagementCompanyComponent } from './management-company.component';
import { ManagagementCompanyService } from './management-company.service';
import {
    SelectModule,
    DpDatePickerModule,
    LogService,
} from '@setl/utils';
import {
    OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { phoneCodeList } from '../../shared/phone-codes.values';
import productConfig from '../productConfig';
import { FileService } from '@setl/core-req-services';

const ofiManagementCompanyServiceStub = {
    getManagementCompanyList: () => { },
};

const pop = jasmine.createSpy('pop')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve();
        }),
    );
const toasterServiceSpy = {
    pop,
};

const fakeFileMetadata = {
    fileID: 'fake fileID',
    hash: 'fake fileHash',
    name: 'fake fileTitle',
};
const uploadFile = jasmine.createSpy('uploadFile')
    .and.returnValue(
        new Promise((resolve, reject) => {
            resolve(fakeFileMetadata);
        }),
    );
class ManagagementCompanyServiceMock extends ManagagementCompanyService { }
ManagagementCompanyServiceMock.prototype.uploadFile = uploadFile;

@Directive({
    selector: 'setl-file-drop',
})
class SetlFileDropStub {
    @Input('preset') preset;
}

@Directive({
    selector: 'setl-file-viewer',
})
class SetlFileViewerStub {
    @Input('fileHash') fileHash;
}

describe('OfiManagementCompanyComponent', () => {
    let comp: OfiManagementCompanyComponent;
    let fixture: ComponentFixture<OfiManagementCompanyComponent>;

    const resetTestingModule = TestBed.resetTestingModule;

    let markForCheckSpy;
    let managementCompanyFormSpy;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                OfiManagementCompanyComponent,
                SetlFileDropStub,
                SetlFileViewerStub,
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                SelectModule,
                ClarityModule,
                DpDatePickerModule,
            ],
            providers: [
                { provide: ManagagementCompanyService, useClass: ManagagementCompanyServiceMock },
                { provide: NgRedux, useFactory: MockNgRedux.getInstance },
                { provide: OfiManagementCompanyService, useValue: ofiManagementCompanyServiceStub },
                LogService,
                AlertsService,
                { provide: ToasterService, useValue: toasterServiceSpy },
                { provide: 'phoneCodeList', useValue: phoneCodeList },
                { provide: 'product-config', useValue: productConfig },
                { provide: FileService, useValue: {} },
            ],
        });
        await TestBed.compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OfiManagementCompanyComponent);

        comp = fixture.componentInstance;

        markForCheckSpy = spyOn(comp, 'markForCheck')
            .and.returnValue(null);
        managementCompanyFormSpy = spyOn(comp.managementCompanyForm, 'setValue')
            .and.callThrough();
    });

    afterEach(() => {
        markForCheckSpy.calls.reset();
        managementCompanyFormSpy.calls.reset();
        uploadFile.calls.reset();
        pop.calls.reset();
    });

    describe('onDropFile', () => {
        it('should clear the metadata', () => {
            markForCheckSpy.calls.reset();
            comp.onDropFile(
                {
                    files: [],
                },
                'signature',
            );
            const expectedResult = {
                name: null,
                hash: null,
            };
            expect(comp.fileMetadata.getTitle('signature')).toEqual(null);
            expect(comp.fileMetadata.getHash('signature')).toEqual(null);
            expect(markForCheckSpy).toHaveBeenCalledTimes(1);
        });

        it('should call the upload method of the service companion', () => {
            comp.onDropFile(
                {
                    files: [{
                        data: 'aGVsbG8gdGhlcmUh',
                        name: 'example.txt',
                        lastModified: 1507563924000,
                    }],
                },
                'signature',
            );
            expect(uploadFile).toHaveBeenCalledTimes(1);
        });

        it('should update the metadata', fakeAsync(() => {
            comp.onDropFile(
                {
                    files: [{
                        data: 'aGVsbG8gdGhlcmUh',
                        name: 'example.txt',
                        lastModified: 1507563924000,
                    }],
                },
                'signature',
            );

            tick();

            expect(comp.fileMetadata.getTitle('signature')).toEqual(fakeFileMetadata.name);
            expect(comp.fileMetadata.getHash('signature')).toEqual(fakeFileMetadata.hash);
            expect(markForCheckSpy).toHaveBeenCalledTimes(1);
        }));

        it('should call the pop method of ToasterService with a success message', fakeAsync(() => {
            comp.onDropFile(
                {
                    files: [{
                        data: 'aGVsbG8gdGhlcmUh',
                        name: 'example.txt',
                        lastModified: 1507563924000,
                    }],
                },
                'signature',
            );

            tick();

            expect(pop).toHaveBeenCalledTimes(1);
            expect(pop.calls.argsFor(0)[0]).toEqual('success');
        }));

        it('should call the pop method of ToasterService with an error message', fakeAsync(() => {
            uploadFile
                .and.returnValue(new Promise((resolve, reject) => reject()));

            comp.onDropFile(
                {
                    files: [{
                        data: 'aGVsbG8gdGhlcmUh',
                        name: 'example.txt',
                        lastModified: 1507563924000,
                    }],
                },
                'signature',
            );

            tick();

            expect(pop).toHaveBeenCalledTimes(1);
            expect(pop.calls.argsFor(0)[0]).toEqual('error');
        }));
    });

    describe('getCountryName', () => {
        it('should get the label from a country ID', () => {
            expect(comp.getCountryName('FR')).toEqual('France');
        });
    });

    describe('editCompany', () => {

        let fakeCompany;

        beforeEach(() => {
            fakeCompany = {
                companyID: 'companyID',
                companyName: 'companyName',
                emailAddress: 'emailAddress',
                legalFormName: 'legalFormName',
                country: 'country',
                postalAddressLine1: 'postalAddressLine1',
                postalAddressLine2: 'postalAddressLine2',
                city: 'city',
                postalCode: 'postalCode',
                taxResidence: 'taxResidence',
                rcsMatriculation: 'rcsMatriculation',
                supervisoryAuthority: 'supervisoryAuthority',
                numSiretOrSiren: 'numSiretOrSiren',
                shareCapital: 'shareCapital',
                commercialContact: 'commercialContact',
                operationalContact: 'operationalContact',
                directorContact: 'directorContact',
                lei: 'lei',
                bic: 'bic',
                giinCode: 'giinCode',
                websiteUrl: 'websiteUrl',
                phoneNumberPrefix: 'phoneNumberPrefix',
                phoneNumber: 'phoneNumber',
                signatureTitle: 'signatureTitle',
                signatureHash: 'signatureHash',
                logoTitle: 'logoTitle',
                logoHash: 'logoHash',
            };
        });

        it('should set the FormGroup', () => {
            comp.editCompany(fakeCompany);
            expect(managementCompanyFormSpy).toHaveBeenCalledTimes(1);
        });

        it('should call the setProperties method of ManagementCompanyFileMetadata', () => {
            const spy = spyOn(comp.fileMetadata, 'setProperties')
                .and.callThrough();

            const expectedPayload = {
                signatureTitle: fakeCompany.signatureTitle,
                signatureHash: fakeCompany.signatureHash,
                logoTitle: fakeCompany.logoTitle,
                logoHash: fakeCompany.logoHash,
            };

            comp.editCompany(fakeCompany);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(comp.fileMetadata.getProperties()).toEqual(expectedPayload);
        });
    });
});
