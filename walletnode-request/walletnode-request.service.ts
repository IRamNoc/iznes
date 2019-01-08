import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { WalletNodeSocketService } from '@setl/websocket-service';
import {AppConfig, APP_CONFIG, SagaHelper} from '@setl/utils';
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
import {NgRedux} from '@angular-redux/store';
import {SET_CONTRACT_LIST} from '@setl/core-store/wallet/my-wallet-contract/actions';

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

interface RequestEncumbranceDetails {
    walletid: number;
    address?: string;
    namespace?: string;
    classid?: string;
}

@Injectable()
export class WalletNodeRequestService {
    constructor(private walletNodeSocketService: WalletNodeSocketService,
                private http: HttpClient,
                private ngRedux: NgRedux<any>,
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

    defaultRequestContractsByWallet(walletId: number) {
        // Request the list.
        const asyncTaskPipe = this.requestContractsByWallet({walletId});

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CONTRACT_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
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

    requestWalletNodeInitialSnapshot() {
        const messageBody = {
            topic: 'state',
        };
        return createWalletNodeRequest(this.walletNodeSocketService, 'request', messageBody).then((response) => {
            return _.get(response, '[1].data');
        });
    }

    requestEncumbranceDetails(requestData: RequestEncumbranceDetails) {
        const messageBody: any = {
            topic: 'encumbrancedetails',
            walletid: _.get(requestData, 'walletid', 0),
            address: _.get(requestData, 'address', ''),
            namespace: _.get(requestData, 'namespace', ''),
            classid: _.get(requestData, 'classid', ''),
        };

        return createWalletNodeSagaRequest(this.walletNodeSocketService, 'request', messageBody);
    }
}
