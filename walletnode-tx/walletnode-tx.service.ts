import {Injectable} from '@angular/core';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {createWalletNodeSagaRequest} from '@setl/utils/common';
import {
    RegisterIssuerMessageBody,
    RegisterAssetMessageBody,
    IssueAssetMessageBody,
    NewAddressMessageBody
} from './walletnode-request.service.model';
import _ from 'lodash';
import {NgRedux} from "@angular-redux/store";

interface RegisterIssuer {
    walletId: number;
    issuerIdentifier: string;
    issuerAddress: string;
    metaData: object;
}

interface RegisterAsset {
    walletId: number;
    address: string;
    namespace: string;
    instrument: string;
    metaData: object;
}

interface IssueAsset {
    walletId: number;
    address: string;
    namespace: string;
    instrument: string;
    amount: number;
}

@Injectable()
export class WalletnodeTxService {

    constructor(private walletNodeSocketService: WalletNodeSocketService) {
    }

    registerIssuer(requestData: RegisterIssuer): any {
        const messageBody: RegisterIssuerMessageBody = {
            topic: 'nsreg',
            walletid: _.get(requestData, 'walletId', 0),
            name: _.get(requestData, 'issuerIdentifier', ''),
            address: _.get(requestData, 'issuerAddress', ''),
            metadata: _.get(requestData, 'metadata', {})
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    registerAsset(requestData: RegisterAsset): any {
        const messageBody: RegisterAssetMessageBody = {
            topic: 'asreg',
            walletid: _.get(requestData, 'walletId', 0),
            address: _.get(requestData, 'address', ''),
            namespace: _.get(requestData, 'namespace', ''),
            instrument: _.get(requestData, 'instrument', ''),
            metadata: _.get(requestData, 'metadata', {})
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    issueAsset(requestData: IssueAsset): any {
        const messageBody: IssueAssetMessageBody = {
            topic: 'asiss',
            walletid: _.get(requestData, 'walletId', 0),
            namespace: _.get(requestData, 'namespace', ''),
            instrument: _.get(requestData, 'instrument', ''),
            address: _.get(requestData, 'address', ''),
            amount: _.get(requestData, 'amount', 0)
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    newAddress(requestData: { walletId: number }): any {
        const messageBody: NewAddressMessageBody = {
            topic: 'newaddress',
            walletid: _.get(requestData, 'walletId', 0),
            register: '1',
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }
}
