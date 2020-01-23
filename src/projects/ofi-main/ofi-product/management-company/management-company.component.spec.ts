import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { Directive, Input, Pipe, PipeTransform } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ToasterService } from 'angular2-toaster';
import { Location } from '@angular/common';

import { OfiManagementCompanyComponent } from './management-company.component';
import { ManagagementCompanyService } from './management-company.service';
import {
    SelectModule,
    DpDatePickerModule,
    LogService,
    SetlPipesModule,
    SetlComponentsModule,
} from '@setl/utils';
import {
    OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { phoneCodeList } from '../../shared/phone-codes.values';
import productConfig from '../productConfig';
import { FileService } from '@setl/core-req-services';
import { FileDropModule, File } from '@setl/core-filedrop';
import { FileViewerModule } from '@setl/core-fileviewer';

import { MultilingualService } from '@setl/multilingual';
import { Router } from '@angular/router';
const multilingualServiceSpy = jasmine.createSpyObj('MultilingualService', ['translate']);

import {
    RouterMock,
} from '@setl/core-test-util';

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

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

const LocationStub = {
    back: () => { },
};

const fakeFiledropEvent = {
    files: [{
        data: 'aGVsbG8gdGhlcmUh',
        name: 'example.txt',
        lastModified: 1507563924000,
        filePermission: 0,
        id: 1,
        mimeType: 'text/plain',
        status: null,
    }],
    target: null,
};
class ManagagementCompanyServiceMock extends ManagagementCompanyService { }

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

    const fakeCompany = {
        companyID: 'companyID',
        companyName: 'companyName',
        emailAddress: 'emailAddress',
        legalFormName: 'EURL',
        country: 'FR',
        postalAddressLine1: 'postalAddressLine1',
        postalAddressLine2: 'postalAddressLine2',
        city: 'city',
        postalCode: 'postalCode',
        taxResidence: 'LU',
        rcsMatriculation: 'rcsMatriculation',
        supervisoryAuthority: 'supervisoryAuthority',
        numSiretOrSiren: 'numSiretOrSiren',
        shareCapital: '1000000',
        commercialContact: 'commercialContact',
        operationalContact: 'operationalContact',
        directorContact: 'directorContact',
        lei: '12345678901234567890',
        bic: 'ASDFGAAAXXX',
        giinCode: '',
        websiteUrl: 'websiteUrl',
        phoneNumberPrefix: '+355',
        phoneNumber: '16589456',
        signatureTitle: 'signatureTitle',
        signatureHash: 'signatureHash',
        logoTitle: 'logoTitle',
        logoHash: 'logoHash',
        isNowCp: false,
    };

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                OfiManagementCompanyComponent,
                SetlFileDropStub,
                SetlFileViewerStub,
                TranslatePipe,
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                SelectModule,
                ClarityModule,
                DpDatePickerModule,
                SetlPipesModule,
                SetlComponentsModule,
                FileViewerModule,
                FileDropModule,
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
                { provide: Location, useValue: LocationStub },
                { provide: MultilingualService, useValue: multilingualServiceSpy },
                { provide: Router, useValue: RouterMock },
            ],
        });
        await TestBed.compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(OfiManagementCompanyComponent);

        comp = fixture.componentInstance;

        markForCheckSpy = spyOn(comp, 'markForCheck')
            .and.returnValue(null);
        managementCompanyFormSpy = spyOn(comp.managementCompanyForm, 'setValue')
            .and.callThrough();

        tick();
        fixture.detectChanges();
    }));

    afterEach(() => {
        markForCheckSpy.calls.reset();
        managementCompanyFormSpy.calls.reset();
        pop.calls.reset();
    });

    describe('onDropFile', () => {
        it('should clear the metadata', () => {
            markForCheckSpy.calls.reset();
            comp.onDropFile(
                {
                    files: <File[]>[],
                    target: null,
                },
                'signature',
            );
            expect(comp.fileMetadata.getTitle('signature')).toEqual(null);
            expect(comp.fileMetadata.getHash('signature')).toEqual(null);
            expect(markForCheckSpy).toHaveBeenCalledTimes(1);
        });

        it('should update the metadata', fakeAsync(() => {
            comp.onDropFile(
                fakeFiledropEvent,
                'signature',
            );

            tick();

            expect(comp.fileMetadata.getTitle('signature')).toEqual(fakeFiledropEvent.files[0].name);
            expect(comp.fileMetadata.getHash('signature')).toContain(fakeFiledropEvent.files[0].mimeType);
            expect(comp.fileMetadata.getHash('signature')).toContain(fakeFiledropEvent.files[0].data);
            expect(markForCheckSpy).toHaveBeenCalledTimes(1);
        }));
    });

    describe('getCountryName', () => {
        xit('should get the label from a country ID', () => {
            expect(comp.getCountryName('FR')).toEqual('France');
        });
    });

    describe('editCompany', () => {

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

    describe('isFormValid', () => {
        it('should be valid', () => {
            comp.editCompany(fakeCompany);
            expect(comp.isFormValid).toEqual(true);
        });

        it('should be invalid with no documents in production mode', () => {
            const noDocCompany = {
                ...fakeCompany,
                signatureHash: null,
            };
            comp.editCompany(noDocCompany);
            expect(comp.isFormValid).toEqual(false);
        });

        it('should be valid with no documents in non-production mode', () => {
            const isProductionStub = MockNgRedux.getSelectorStub([
                'user',
                'siteSettings',
                'production',
            ]);
            isProductionStub.next(false);
            isProductionStub.complete();

            const noDocCompany = {
                ...fakeCompany,
                signatureHash: null,
            };
            comp.editCompany(noDocCompany);
            expect(comp.isFormValid).toEqual(true);
        });
    });
});
