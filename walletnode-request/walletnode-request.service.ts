import {Injectable} from '@angular/core';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createWalletNodeSagaRequest} from '@setl/utils/common';
import {WalletAddressRequestMessageBody} from './walletnode-request.service.model';
import _ from 'lodash';

interface RequestWalletAddress {
    walletId: number;
    namespace?: string;
    classId?: string;
    address?: string;
}

@Injectable()
export class WalletNodeRequestService {

    constructor(private walletNodeSocketService: WalletNodeSocketService) {
    }

    walletAddressRequest(requestData: RequestWalletAddress): any {

        const messageBody: WalletAddressRequestMessageBody = {
            topic: 'addresses',
            walletid: _.get(requestData, 'walletId', 0),
            namespace: _.get(requestData, 'namespace', ''),
            classid: _.get(requestData, 'classId', ''),
            address: _.get(requestData, 'address', '')
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

}
