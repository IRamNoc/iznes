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
    private token: string =  null;
    private userId: string = null;
    private walletId: string = null;
    private baseUrl: string = 'http://localhost:9788';

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;

    constructor(private memberSocketService: MemberSocketService) {
        this.token = this.memberSocketService.token;
        this.getConnectedWallet.subscribe(
            (data) => {
                this.walletId = data;
            }
        );
        this.getUser.subscribe(
            (data) => {
                this.userId = data;
            }
        );
    }

    public createPdfMetadata(requestData: CreatePdfMetadata): any {
        if (this.walletId) {
            const messageBody: CreatePdfMetadataMessageBody = {
                RequestName: 'createpdfmetadata',
                token: this.token,
                walletID: this.walletId,
                type: _.get(requestData, 'type', null),
                metadata: _.get(requestData, 'metadata', null)
            };
            return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
        }
    }

    public getPdf(requestData: GetPdf): any {
        if (this.walletId) {
            const messageBody: GetPdfMessageBody = {
                RequestName: 'getpdf',
                token: this.token,
                walletID: this.walletId,
                pdfID: _.get(requestData, 'pdfID', null)
            };
            return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
        }
    }

    public servePdf(fileHash) {
        if (fileHash) {
            const path = this.baseUrl +
                '/file?' +
                'method=retrieve' +
                '&userId=' + this.userId +
                '&walletId=' + this.walletId +
                '&token=' + this.token +
                '&fileHash=' + fileHash;

            console.log('Serving from path:' + path);
        }
    }
}
