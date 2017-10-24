import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {CreatePdfMetadataMessageBody, GetPdfMessageBody} from './pdf.service.model';
import {select} from '@angular-redux/store';
import _ from 'lodash';

interface CreatePdfMetadata {
    type: number;
    metadata: object;
}

interface GetPdf {
    pdfID: number;
}

interface UpdatePdfFileHash {
    pdfID: number;
    fileHash: string;
}

@Injectable()
export class PdfService {
    private connectedWallet;
    private baseUrl = 'http://localhost:9788';

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;

    constructor(private memberSocketService: MemberSocketService) {
        this.getConnectedWallet.subscribe(
            (data) => {
                this.connectedWallet = data;
            }
        );
    }

    public createPdfMetadata(requestData: CreatePdfMetadata): any {
        if (this.connectedWallet) {
            const messageBody: CreatePdfMetadataMessageBody = {
                RequestName: 'createpdfmetadata',
                token: this.memberSocketService.token,
                walletID: this.connectedWallet,
                type: _.get(requestData, 'type', null),
                metadata: _.get(requestData, 'metadata', null)
            };
            return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
        }
    }

    public getPdf(requestData: GetPdf): any {
        if (this.connectedWallet) {
            const messageBody: GetPdfMessageBody = {
                RequestName: 'getpdf',
                token: this.memberSocketService.token,
                walletID: this.connectedWallet,
                pdfID: _.get(requestData, 'pdfID', null)
            };
            return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
        }
    }

    public servePdf(fileHash) {
        if (fileHash) {
            console.log('Serving PDF using File Hash : ' + fileHash);

            const path = this.baseUrl +
                '/file?' +
                'method=retrieve' +
                '&userId=' + '17' +
                '&walletId=' + this.connectedWallet +
                '&token=' + this.memberSocketService.token +
                '&fileHash=' + fileHash;

            console.log('Serving from path:' + path);
        }
    }
}
