import {Injectable} from '@angular/core';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {createWalletNodeSagaRequest} from '@setl/utils/common';
import {
    RegisterIssuerMessageBody,
    RegisterAssetMessageBody,
    IssueAssetMessageBody,
    SendAssetMessageBody,
    NewAddressMessageBody,
    NewContractMessageBody
} from './walletnode-request.service.model';
import _ from 'lodash';

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

interface SendAsset {
    walletId: number;
    namespace: string;
    instrument: string;
    fromAddress: string;
    toAddress: string;
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

    sendAsset(requestData: SendAsset): any {
        const messageBody: SendAssetMessageBody = {
            topic: 'asiss',
            walletid: _.get(requestData, 'walletId', 0),
            namespace: _.get(requestData, 'namespace', ''),
            instrument: _.get(requestData, 'instrument', ''),
            fromaddress: _.get(requestData, 'fromaddress', ''),
            toaddress: _.get(requestData, 'toaddress', ''),
            amount: _.get(requestData, 'amount', 0)
        };
        console.log(messageBody);
        // return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    newAddress(requestData: { walletId: number }): any {
        const messageBody: NewAddressMessageBody = {
            topic: 'newaddress',
            walletid: _.get(requestData, 'walletId', 0),
            register: '1',
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    newContract(requestData: { walletId: number, address: string, 'function': string, contractData: any }): any {
        const messageBody: NewContractMessageBody = {
            topic: 'conew',
            walletid: _.get(requestData, 'walletId', 0),
            address: _.get(requestData, 'address', ''),
            'function': _.get(requestData, 'function', ''),
            contractdata: _.get(requestData, 'contractData', '')
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

}
