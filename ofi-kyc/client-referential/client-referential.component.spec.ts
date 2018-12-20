import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { Directive, Input, Pipe, PipeTransform } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ToasterService } from 'angular2-toaster';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OfiClientReferentialComponent } from './component';
import { OfiFundAccessTable } from './access-table/component';
import { KycDetailsComponent } from '../my-requests/kyc-details/details.component';
import { KycDetailsGridComponent } from '../my-requests/kyc-details/details-grid.component';
import { KycDetailsStakeholdersComponent } from '../my-requests/kyc-details/beneficiaries.component';

import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { FileDownloader } from '@setl/utils/services/file-downloader/service';

import {
    SelectModule,
    DpDatePickerModule,
    SetlPipesModule,
} from '@setl/utils';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { RouterMock } from '@setl/core-test-util';
import { MultilingualService } from '@setl/multilingual';

const multilingualServiceStub = jasmine.createSpyObj('MultilingualService', ['translate']);

const ofiKycServiceStub = {
    setRequestedClientReferential: () => { },
};

const locationBackSpy = jasmine.createSpy('back')
    .and.returnValue(null);

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

@Directive({
    selector: 'setl-file-drop',
})
class SetlFileDropStub {
    @Input('preset') preset;
    @Input('inline') inline;
}

@Directive({
    selector: 'setl-file-viewer',
})
class SetlFileViewerStub {
    @Input('fileHash') fileHash;
    @Input('viewType') viewType;
}

describe('OfiClientReferentialComponent', () => {
    let comp: OfiClientReferentialComponent;
    let fixture: ComponentFixture<OfiClientReferentialComponent>;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                OfiClientReferentialComponent,
                OfiFundAccessTable,
                KycDetailsComponent,
                TranslatePipe,
                SetlFileDropStub,
                SetlFileViewerStub,
                KycDetailsGridComponent,
                KycDetailsStakeholdersComponent,
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                ClarityModule,
                SelectModule,
                DpDatePickerModule,
                SetlPipesModule,
            ],
            providers: [
                { provide: OfiKycService, useValue: ofiKycServiceStub },
                { provide: Location, useValue: {} },
                AlertsService,
                { provide: ToasterService, useValue: {} },
                { provide: OfiFundShareService, useValue: {} },
                { provide: NgRedux, useFactory: MockNgRedux.getInstance },
                { provide: FileDownloader, useValue: {} },
                { provide: ActivatedRoute, useValue: {} },
                { provide: Router, useValue: RouterMock },
                { provide: MultilingualService, useValue: multilingualServiceStub },
            ],
        });
        await TestBed.compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(OfiClientReferentialComponent);

        comp = fixture.componentInstance;
        MockNgRedux.reset();

        tick();
        fixture.detectChanges();
    }));

    afterEach(() => {
    });

    describe('getClientReferentialDescriptionTitle', () => {

        const fakeKycID = '99';
        const expectedCompanyName = 'expectedCompanyName';
        const expectedClientReference = 'expectedClientReference';

        it('should return an empty string', () => {
            expect(comp.getClientReferentialDescriptionTitle()).toEqual('');
        });

        it('should return a string with only the company name', () => {

            comp.kycId = fakeKycID;
            comp.clients = {
                [fakeKycID]: {
                    companyName: expectedCompanyName,
                },
            };

            expect(comp.getClientReferentialDescriptionTitle()).toContain(expectedCompanyName);
        });

        it('should return a string with company name and client referential', () => {

            comp.kycId = fakeKycID;
            comp.clients = {
                [fakeKycID]: {
                    companyName: expectedCompanyName,
                    clientReference: expectedClientReference,
                },
            };

            expect(comp.getClientReferentialDescriptionTitle()).toContain(expectedCompanyName);
            expect(comp.getClientReferentialDescriptionTitle()).toContain(expectedClientReference);
        });
    });
});
