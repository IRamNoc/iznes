import { TestBed, inject } from '@angular/core/testing';
import { NgReduxTestingModule } from '@angular-redux/store/testing';
import { PdfService } from './pdf.service';
import { MemberSocketService } from '@setl/websocket-service';
import { CoreTestUtilModule, MemberSocketServiceMock } from '@setl/core-test-util';
import * as utilsCommon from '@setl/utils/common';
import * as _ from 'lodash';

describe('MyPdfService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgReduxTestingModule,
                CoreTestUtilModule
            ],
            providers: [
                PdfService,
                { provide: MemberSocketService, useClass: MemberSocketServiceMock }
            ]
        });
    });


    it('should be created', inject([PdfService], (service: PdfService) => {
        expect(service).toBeTruthy();
    }));

    it('should call createMemberNodeSagaRequest when calling getPdfRequest', inject([PdfService], (service: PdfService) => {
        spyOn(utilsCommon, 'createMemberNodeSagaRequest');
        service.walletId = '1';
        service.getPdfRequest({pdfID:null});
        expect(utilsCommon.createMemberNodeSagaRequest).toHaveBeenCalled();
    }));
});
