import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {select, NgRedux} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {CreatePdfMetadataMessageBody, GetPdfMessageBody} from './pdf.service.model';
import * as _ from 'lodash';

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
    private baseUrl: string = null;

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>
    ) {
        this.baseUrl = 'http://localhost:9788';
        this.token = this.memberSocketService.token;
        if (this.getConnectedWallet) {
            this.getConnectedWallet.subscribe(
                (data) => {
                    this.walletId = data;
                }
            );
        }
        if (this.getUser) {
            this.getUser.subscribe(
                (data) => {
                    this.userId = data;
                }
            );
        }
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

    /**
     * Get PDF
     *
     * @param pdfID
     *
     * @return {Promise}
     */
    public getPdf(pdfID: any): any {
        const asyncTaskPipe = this.getPdfRequest({
            pdfID: pdfID
        });
        return new Promise((resolve, reject) => {
            this.ngRedux.dispatch(
                SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    (data) => {
                        if (data && data[1] && data[1].Data) {
                            resolve(data[1].Data);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );
        });
    }

    public getPdfRequest(requestData: GetPdf): any {
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
