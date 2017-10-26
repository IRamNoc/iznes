import {Injectable} from '@angular/core';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createWalletNodeSagaRequest} from '@setl/utils/common';
import {
    WalletAddressRequestMessageBody,
    WalletIssuerRequestMessageBody,
    RequestWalletHoldingMessageBody,
    WalletInstrumentRequestMessageBody,
    RequestContractByAddressBody
} from './walletnode-request.service.model';
import _ from 'lodash';

interface RequestIssueHolding {
    walletId: number;
    issuer: string;
    instrument: string;
}

interface RequestWalletAddress {
    walletId: number;
    namespace?: string;
    classId?: string;
    address?: string;
}

interface RequestWalletIssuer {
    walletId: number;
    address?: string;
}

interface RequestWalletInstrument {
    walletId: number;
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

    walletIssuerRequest(requestData: RequestWalletIssuer): any {

        const messageBody: WalletIssuerRequestMessageBody = {
            topic: 'issuers',
            walletid: _.get(requestData, 'walletId', 0),
            address: _.get(requestData, 'address', '')
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    walletInstrumentRequest(requestData: RequestWalletInstrument): any {

        const messageBody: WalletInstrumentRequestMessageBody = {
            topic: 'instruments',
            walletid: _.get(requestData, 'walletId', 0)
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    /**
     * Request Wallet Holding for a Wallet ID
     *
     * @param {RequestWalletAddress} requestData {walletId}
     * @returns {any}
     */
    requestWalletHolding(requestData: RequestWalletAddress): any {

        const messageBody: RequestWalletHoldingMessageBody = {
            topic: 'holdingsdetail',
            walletid: _.get(requestData, 'walletId', 0),
            namespace: _.get(requestData, 'namespace', ''),
            classid: _.get(requestData, 'classId', ''),
            address: _.get(requestData, 'address', '')
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    /**
     * Request Issue Holding for Asset {Issue|Instrument}
     *
     * @param {RequestWalletAddress} requestData {walletId, issuer, instrument}
     * @returns {any}
     */
    requestWalletIssueHolding(requestData: RequestIssueHolding): any {

        const messageBody: RequestWalletHoldingMessageBody = {
            topic: 'holders',
            walletid: _.get(requestData, 'walletId', 0),
            namespace: _.get(requestData, 'issuer', ''),
            classid: _.get(requestData, 'instrument', ''),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    /**
     * request Contract By Address
     *
     * @param {object} requestData {walletId, issuer, instrument}
     * @returns {any}
     */
    requestContractByAddress(requestData: any): any {

        const messageBody: RequestContractByAddressBody = {
            topic: 'contract',
            walletid: _.get(requestData, 'walletId', 0),
            address: _.get(requestData, 'address', ''),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }
 d
    walletCommitToContract(requestData: any) {
        let messageBody: any = {
            topic: 'cocom',
            walletid: _.get(requestData, 'walletid', 0),
            address: _.get(requestData, 'address', 0),
            function: _.get(requestData, 'function', 0),
            contractdata: _.get(requestData, 'contractdata', 0),
            contractaddress: _.get(requestData, 'contractaddress', 0),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

}
