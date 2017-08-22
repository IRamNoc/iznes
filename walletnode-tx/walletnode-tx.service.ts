import {Injectable} from '@angular/core';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {createWalletNodeSagaRequest} from '@setl/utils/common';
import {RegisterIssuerMessageBody} from './walletnode-request.service.model';
import _ from 'lodash';

interface RegisterIssuer {
    issuerIdentifier: string;
    issuerAddress: string;
    metaData: object;
}

@Injectable()
export class WalletnodeTxService {

    constructor(private walletNodeSocketService: WalletNodeSocketService) {
    }

    registerIssuer(requestData: RegisterIssuer): any {
        const messageBody: RegisterIssuerMessageBody = {
            topic: 'nsreg',
            walletid: 31,
            name: _.get(requestData, 'issuerIdentifier', ''),
            address: _.get(requestData, 'issuerAddress', ''),
            metadata: _.get(requestData, 'metadata', {})
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }
}
