import { Injectable } from '@angular/core';
import { WalletNodeSocketService } from '@setl/websocket-service';
import { createWalletNodeSagaRequest } from '@setl/utils/common';
import {
    RegisterIssuerMessageBody,
    DeleteIssuerMessageBody,
    RegisterAssetMessageBody,
    DeleteAssetMessageBody,
    IssueAssetMessageBody,
    VoidAssetMessageBody,
    SendAssetMessageBody,
    NewAddressMessageBody,
    NewContractMessageBody,
    EncumberMessageBody,
    UnencumberMessageBody,
} from './walletnode-request.service.model';
import * as _ from 'lodash';

interface RegisterIssuer {
    walletId: number;
    issuerIdentifier: string;
    issuerAddress: string;
    metaData: object;
}

interface DeleteIssuer {
    walletId: number;
    address: string;
    namespace: string;
    instrument: string;
    metaData: object;
}

interface RegisterAsset {
    walletId: number;
    address: string;
    namespace: string;
    instrument: string;
    metaData: object;
}

interface DeleteAsset {
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

interface VoidAsset {
    walletId: number;
    address: string;
    namespace: string;
    instrument: string;
    amount: number;
    paymentlist: object;
}

interface SendAsset {
    walletId: number;
    namespace: string;
    instrument: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
}

interface Encumber {
    txtype: string;
    walletid: number;
    reference: string;
    address: string;
    subjectaddress: string;
    namespace: string;
    instrument: string;
    amount: number;
    beneficiaries: any;
    administrators: any;
    protocol: string;
    metadata: string;
    iscumulative: boolean;
}

interface Unencumber {
    txtype: string;
    walletid: number;
    reference: string;
    address: string;
    subjectaddress: string;
    namespace: string;
    instrument: string;
    amount: number;
    protocol: string;
    metadata: string;
}

interface CreateContract {
    walletId: number;
    address: string;
    function: string;
    contractData: any;
}

interface GetContracts {
    token: string;
    walletId: string;
    contractaddr: string;
}

@Injectable()
export class WalletnodeTxService {
    constructor(private walletNodeSocketService: WalletNodeSocketService) {
    }

    encumber(requestData: Encumber): any {
        const messageBody: EncumberMessageBody = {
            topic: 'encum',
            txtype: _.get(requestData, 'txtype', ''),
            walletid: _.get(requestData, 'walletid', 0),
            reference: _.get(requestData, 'reference', ''),
            address: _.get(requestData, 'address', ''),
            subjectaddress: _.get(requestData, 'subjectaddress', ''),
            namespace: _.get(requestData, 'namespace', ''),
            instrument: _.get(requestData, 'instrument', ''),
            amount: _.get(requestData, 'amount', 0),
            beneficiaries: _.get(requestData, 'beneficiaries', []),
            administrators: _.get(requestData, 'administrators', []),
            protocol: _.get(requestData, 'protocol', ''),
            metadata: _.get(requestData, 'metadata', {}),
            iscumulative: _.get(requestData, 'iscumulative', false),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    unencumber(requestData: Unencumber): any {
        const messageBody: UnencumberMessageBody = {
            topic: 'unenc',
            txtype: _.get(requestData, 'txtype', ''),
            walletid: _.get(requestData, 'walletid', 0),
            reference: _.get(requestData, 'reference', ''),
            address: _.get(requestData, 'address', ''),
            subjectaddress: _.get(requestData, 'subjectaddress', ''),
            namespace: _.get(requestData, 'namespace', ''),
            instrument: _.get(requestData, 'instrument', ''),
            amount: _.get(requestData, 'amount', 0),
            protocol: _.get(requestData, 'protocol', ''),
            metadata: _.get(requestData, 'metadata', {}),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    registerIssuer(requestData: RegisterIssuer): any {
        const messageBody: RegisterIssuerMessageBody = {
            topic: 'nsreg',
            walletid: _.get(requestData, 'walletId', 0),
            name: _.get(requestData, 'issuerIdentifier', ''),
            address: _.get(requestData, 'issuerAddress', ''),
            metadata: _.get(requestData, 'metadata', {}),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    deleteIssuer(requestData: DeleteIssuer): any {
        const messageBody: DeleteIssuerMessageBody = {
            topic: 'nsdel',
            walletid: _.get(requestData, 'walletId', 0),
            name: _.get(requestData, 'issuerIdentifier', ''),
            address: _.get(requestData, 'issuerAddress', ''),
            metadata: _.get(requestData, 'metadata', {}),
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
            metadata: _.get(requestData, 'metadata', {}),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    deleteAsset(requestData: DeleteAsset): any {
        const messageBody: DeleteAssetMessageBody = {
            topic: 'asdel',
            walletid: _.get(requestData, 'walletId', 0),
            address: _.get(requestData, 'address', ''),
            namespace: _.get(requestData, 'namespace', ''),
            instrument: _.get(requestData, 'instrument', ''),
            metadata: _.get(requestData, 'metadata', {}),
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
            amount: _.get(requestData, 'amount', 0),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    voidAsset(requestData: VoidAsset): any {
        const messageBody: VoidAssetMessageBody = {
            topic: 'istfm',
            walletid: _.get(requestData, 'walletId', 0),
            address: _.get(requestData, 'address', ''),
            namespace: _.get(requestData, 'namespace', ''),
            instrument: _.get(requestData, 'instrument', ''),
            amount: _.get(requestData, 'amount', 0),
            paymentlist: _.get(requestData, 'paymentlist', []),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    sendAsset(requestData: SendAsset): any {
        const messageBody: SendAssetMessageBody = {
            topic: 'astra',
            walletid: _.get(requestData, 'walletId', 0),
            namespace: _.get(requestData, 'namespace', ''),
            instrument: _.get(requestData, 'instrument', ''),
            fromaddress: _.get(requestData, 'fromAddress', ''),
            toaddress: _.get(requestData, 'toAddress', ''),
            amount: _.get(requestData, 'amount', 0),
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

    newContract(requestData: CreateContract): any {
        const messageBody: NewContractMessageBody = {
            topic: 'conew',
            walletid: _.get(requestData, 'walletId', 0),
            address: _.get(requestData, 'address', ''),
            'function': _.get(requestData, 'function', ''),
            contractdata: _.get(requestData, 'contractData', ''),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }
}
