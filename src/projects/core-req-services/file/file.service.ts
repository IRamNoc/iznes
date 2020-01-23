import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MemberSocketService } from '@setl/websocket-service';
import {
    createMemberNodeSagaRequest,
    createMemberNodeRequest,
} from '@setl/utils/common';
import {
    AddFileMessageBody,
    GetHistoricalCsvMessageBody,
    ValidateFileMessageBody,
} from './file.service.model';
import { select } from '@angular-redux/store';
import * as _ from 'lodash';

interface AddFileRequest {
    files: {}[];
    secure?: boolean;
    path?: string;
}

@Injectable()
export class FileService {
    private connectedWallet;

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;

    constructor(private memberSocketService: MemberSocketService) {
        this.getConnectedWallet.subscribe(
            (data) => {
                this.connectedWallet = data;
            },
        );
    }

    addFile(requestData: AddFileRequest): any {
        const messageBody: AddFileMessageBody = {
            RequestName: 'afh',
            token: this.memberSocketService.token,
            walletId: this.connectedWallet,
            files: _.get(requestData, 'files', []),
            secure: _.get(requestData, 'secure', undefined),
            path: _.get(requestData, 'path', undefined),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getHistoricalCsv(dateFrom: string, dateTo: string): any {
        const messageBody: GetHistoricalCsvMessageBody = {
            RequestName: 'historicalcsv',
            token: this.memberSocketService.token,
            walletId: this.connectedWallet,
            dateFrom,
            dateTo,

        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    validateFile(fileHash: string) {
        const messageBody: ValidateFileMessageBody = {
            RequestName: 'validateFile',
            token: this.memberSocketService.token,
            walletId: this.connectedWallet,
            fileHash,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }
}
