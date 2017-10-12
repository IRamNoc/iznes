import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {AddFileMessageBody} from './file.service.model';
import {select} from '@angular-redux/store';
import _ from 'lodash';

interface AddFileRequest {
    files: string;
}

@Injectable()
export class FileService {
    private connectedWallet;

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;

    constructor(private memberSocketService: MemberSocketService) {
        this.getConnectedWallet.subscribe(
            (data) => {
                this.connectedWallet = data;
            }
        );
    }

    addFile(requestData: AddFileRequest): any {
        const messageBody: AddFileMessageBody = {
            RequestName: 'afh',
            token: this.memberSocketService.token,
            walletId: this.connectedWallet,
            files: _.get(requestData, 'files', [])
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
