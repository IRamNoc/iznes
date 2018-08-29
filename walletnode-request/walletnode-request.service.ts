import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { WalletNodeSocketService } from '@setl/websocket-service';
import { AppConfig, APP_CONFIG } from '@setl/utils';
import { createWalletNodeSagaRequest, createWalletNodeRequest } from '@setl/utils/common';
import {
    WalletAddressRequestMessageBody,
    WalletIssuerRequestMessageBody,
    RequestWalletHoldingMessageBody,
    WalletInstrumentRequestMessageBody,
    RequestContractByAddressBody,
    RequestTransactionHistoryBody,
    RequestContractsByWalletBody,
} from './walletnode-request.service.model';
import * as _ from 'lodash';

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
    constructor(private walletNodeSocketService: WalletNodeSocketService,
                private http: HttpClient,
                @Inject(APP_CONFIG) public appConfig: AppConfig) {
    }

    walletAddressRequest(requestData: RequestWalletAddress): any {
        const messageBody: WalletAddressRequestMessageBody = {
            topic: 'addresses',
            walletid: _.get(requestData, 'walletId', 0),
            namespace: _.get(requestData, 'namespace', ''),
            classid: _.get(requestData, 'classId', ''),
            address: _.get(requestData, 'address', ''),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    walletIssuerRequest(requestData: RequestWalletIssuer): any {
        const messageBody: WalletIssuerRequestMessageBody = {
            topic: 'issuers',
            walletid: _.get(requestData, 'walletId', 0),
            address: _.get(requestData, 'address', ''),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    walletInstrumentRequest(requestData: RequestWalletInstrument): any {
        const messageBody: WalletInstrumentRequestMessageBody = {
            topic: 'instruments',
            walletid: _.get(requestData, 'walletId', 0),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    /**
     * Requests Wallet Holding for a Wallet ID
     *
     * @param {RequestWalletAddress} requestData {walletId}
     *
     * @returns {any}
     */
    requestWalletHolding(requestData: RequestWalletAddress): any {

        const messageBody: RequestWalletHoldingMessageBody = {
            topic: 'holdingsdetail',
            walletid: _.get(requestData, 'walletId', 0),
            namespace: _.get(requestData, 'namespace', ''),
            classid: _.get(requestData, 'classId', ''),
            address: _.get(requestData, 'address', ''),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    /**
     * Requests Issue Holding for Asset {Issue|Instrument}
     *
     * @param {RequestWalletAddress} requestData {walletId, issuer, instrument}
     *
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
     * Requests Contract By Address
     *
     * @param {object} requestData {walletId, issuer, instrument}
     *
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

    /**
     * Request Contracts by Wallet
     *
     * @param {object} requestData {walletId}
     *
     * @returns {any}
     */
    requestContractsByWallet(requestData: any): any {
        const messageBody: RequestContractsByWalletBody = {
            topic: 'contract',
            walletid: _.get(requestData, 'walletId', 0),
        };
        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }

    walletCommitToContract(requestData: any) {
        const messageBody: any = {
            topic: 'cocom',
            walletid: _.get(requestData, 'walletid', 0),
            address: _.get(requestData, 'address', 0),
            function: _.get(requestData, 'function', 0),
            contractdata: _.get(requestData, 'contractdata', 0),
            contractaddress: _.get(requestData, 'contractaddress', 0),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', messageBody);
    }

    /**
     * Requests Transaction History
     *
     * @param {object} requestData {walletIds, chainid}
     *
     * @returns {any}
     */
    requestTransactionHistory(requestData: any, pageSize: number = 10, pageNum: number = 0): any {
        const messageBody: RequestTransactionHistoryBody = {
            topic: 'txhist',
            walletids: requestData.walletIds,
            chainid: requestData.chainId,
            pagesize: pageSize,
            classid: requestData.asset || '',
            pagenum: pageNum,
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'signreq', messageBody);
    }

    requestTransactionHistoryFromReportingNode(
        msgId: string, connectedChainId: number, nodePath: string): Observable<any> {
        return this.http.post(this.appConfig.reportingNodeUrl, { request: msgId });
    }

    requestWalletNodeInitialSnapshot() {
        const messageBody = {
            topic: 'state',
        };
        return createWalletNodeRequest(this.walletNodeSocketService, 'request', messageBody).then((response) => {
            return _.get(response, '[1].data');
        });
    }
}
