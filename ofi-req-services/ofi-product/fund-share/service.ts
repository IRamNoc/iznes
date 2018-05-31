import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, NumberConverterService, LogService} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';

import {
    AmAllFundShareListRequestBody,
    InvestorFundAccessRequestBody,
    FundShareRequestBody,
    CreateFundShareRequestData,
    IznesShareListRequestMessageBody
} from './model';
import {
    SET_FUND_SHARE,
    setRequestedFundShare,
    clearRequestedFundShare,
    SET_AM_ALL_FUND_SHARE_LIST,
    setRequestedAmAllFundShare,
    setRequestedIznesShares,
    GET_IZN_SHARES_LIST,
    SET_FUND_SHARE_DOCS,
    setRequestedFundShareDocs,
    clearRequestedFundShareDocs,
    SET_FUND_SHARE_AUDIT,
    setRequestedFundShareAudit,
    clearRequestedFundShareAudit
} from '@ofi/ofi-main/ofi-store/ofi-product';

export interface RequestInvestorFundAccessData {
    investorWalletId: number;
}

@Injectable()
export class OfiFundShareService {

    constructor(private memberSocketService: MemberSocketService, private logService: LogService, private numberService: NumberConverterService) {
    }

    static defaultRequestAmAllFundShareList(ofiFundService: OfiFundShareService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedAmAllFundShare());

        // Request the list.
        const asyncTaskPipe = ofiFundService.requestAmAllFundShareList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_AM_ALL_FUND_SHARE_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestIznesShareList(ofiShareService: OfiFundShareService, ngRedux: NgRedux<any>) {
        ngRedux.dispatch(setRequestedIznesShares());

        // Request the list.
        const asyncTaskPipe = ofiShareService.requestIznesShareList();

        ngRedux.dispatch(
            SagaHelper.runAsync(
                [GET_IZN_SHARES_LIST],
                [],
                asyncTaskPipe,
                {},
            )
        );
    }

    /**
     * Request all fund share for the asset manager, not just for under particular fund.
     * @return {any}
     */
    requestAmAllFundShareList(): any {
        const messageBody: AmAllFundShareListRequestBody = {
            RequestName: 'izngetfundsharelist',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestIznesShareList() {
        const messageBody: IznesShareListRequestMessageBody = {
            RequestName: 'izngetfundsharelist',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Asset manager Request fund share access for particular investor walletid.
     * @return {any}
     */
    requestInvestorFundAccess(requestData: RequestInvestorFundAccessData): any {
        const messageBody: InvestorFundAccessRequestBody = {
            RequestName: 'iznesgetinvestorfundaccess',
            token: this.memberSocketService.token,
            investorWalletId: requestData.investorWalletId
        };
        this.logService.log('this is the request', messageBody);

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Create a new Fund Share
     * @return {any}
     */
    static defaultCreateFundShare(ofiFundService: OfiFundShareService,
                                  ngRedux: NgRedux<any>,
                                  requestData,
                                  successCallback: (data) => void,
                                  errorCallback: (e) => void) {

        const asyncTaskPipe = ofiFundService.createFundShare(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE],
            [],
            asyncTaskPipe,
            {},
            (data) => successCallback(data),
            (e) => errorCallback(e)
        ));
    }

    createFundShare(requestData): any {
        let messageBody = {
            RequestName: 'iznescreatefundshare',
            token: this.memberSocketService.token
        }

        this.convertNumbersForBlockchain(requestData);
        messageBody = Object.assign(requestData, messageBody);

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Request fund share
     * @return {any}
     */
    static defaultRequestFundShare(ofiFundService: OfiFundShareService, ngRedux: NgRedux<any>, requestData) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedFundShare());

        // Request the list.
        const asyncTaskPipe = ofiFundService.requestFundShare(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestFundShare(requestData): any {
        const messageBody: FundShareRequestBody = {
            RequestName: 'iznesgetfundshare',
            token: this.memberSocketService.token,
            fundShareID: _.get(requestData, 'fundShareID')
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Update Fund Share
     * @return {any}
     */
    static defaultUpdateFundShare(ofiFundService: OfiFundShareService,
                                  ngRedux: NgRedux<any>,
                                  requestData,
                                  successCallback: (data) => void,
                                  errorCallback: (e) => void) {

        const asyncTaskPipe = ofiFundService.updateFundShare(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE],
            [],
            asyncTaskPipe,
            {},
            (data) => successCallback(data),
            (e) => errorCallback(e)
        ));
    }

    updateFundShare(requestData): any {
        let messageBody = {
            RequestName: 'iznesupdatefundshare',
            token: this.memberSocketService.token
        }

        this.convertNumbersForBlockchain(requestData);
        messageBody = Object.assign(requestData, messageBody);

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Create new fund share documents
     * @return {any}
     */
    static defaultCreateFundShareDocuments(ofiFundService: OfiFundShareService,
        ngRedux: NgRedux<any>,
        requestData,
        successCallback: (data) => void,
        errorCallback: (e) => void) {

        const asyncTaskPipe = ofiFundService.createFundShareDocuments(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE_DOCS],
            [],
            asyncTaskPipe,
            {},
            (data) => successCallback(data),
            (e) => errorCallback(e)
        ));
    }

    createFundShareDocuments(requestData): any {
        let messageBody = {
            RequestName: 'iznescreatefundsharedocs',
            token: this.memberSocketService.token
        }

        messageBody = Object.assign(requestData, messageBody);

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Request fund share documents
     * @return {any}
     */
    static defaultRequestFundShareDocs(ofiFundService: OfiFundShareService, ngRedux: NgRedux<any>, requestData) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedFundShareDocs());

        // Request the list.
        const asyncTaskPipe = ofiFundService.requestFundShareDocs(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE_DOCS],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestFundShareDocs(requestData): any {
        const messageBody: FundShareRequestBody = {
            RequestName: 'iznesgetfundsharedocs',
            token: this.memberSocketService.token,
            fundShareID: _.get(requestData, 'fundShareID')
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Update fund share documents
     * @return {any}
     */
    static defaultUpdateFundShareDocuments(ofiFundService: OfiFundShareService,
        ngRedux: NgRedux<any>,
        requestData,
        successCallback: (data) => void,
        errorCallback: (e) => void) {

        const asyncTaskPipe = ofiFundService.updateFundShareDocuments(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE_DOCS],
            [],
            asyncTaskPipe,
            {},
            (data) => successCallback(data),
            (e) => errorCallback(e)
        ));
    }

    updateFundShareDocuments(requestData): any {
        let messageBody = {
            RequestName: 'iznesupdatefundsharedocs',
            token: this.memberSocketService.token
        }

        messageBody = Object.assign(requestData, messageBody);

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Get fund share audit data
     * @return {any}
     */
    static defaultFundShareAudit(ofiFundService: OfiFundShareService,
        ngRedux: NgRedux<any>,
        requestData,
        successCallback: (data) => void,
        errorCallback: (e) => void) {

        const asyncTaskPipe = ofiFundService.getFundShareAudit(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE_AUDIT],
            [],
            asyncTaskPipe,
            {},
            (data) => successCallback(data),
            (e) => errorCallback(e)
        ));
    }

    getFundShareAudit(requestData): any {
        let messageBody = {
            RequestName: 'getfundshareaudit',
            token: this.memberSocketService.token
        }

        messageBody = Object.assign(requestData, messageBody);

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    private convertNumbersForBlockchain(request: any): void {
        request.minInitialSubscriptionInAmount = this.numberService.toBlockchain(request.minInitialSubscriptionInAmount);
        request.minInitialSubscriptionInShare = this.numberService.toBlockchain(request.minInitialSubscriptionInShare);
        request.minSubsequentRedemptionInAmount = this.numberService.toBlockchain(request.minSubsequentRedemptionInAmount);
        request.minSubsequentRedemptionInShare = this.numberService.toBlockchain(request.minSubsequentRedemptionInShare);
        request.minSubsequentSubscriptionInAmount = this.numberService.toBlockchain(request.minSubsequentSubscriptionInAmount);
        request.minSubsequentSubscriptionInShare = this.numberService.toBlockchain(request.minSubsequentSubscriptionInShare);
        request.maxManagementFee = this.numberService.toBlockchain(request.maxManagementFee);
        request.maxSubscriptionFee = this.numberService.toBlockchain(request.maxSubscriptionFee);
        request.maxRedemptionFee = this.numberService.toBlockchain(request.maxRedemptionFee);
        request.mifiidChargesOneOff = this.numberService.toBlockchain(request.mifiidChargesOneOff);
        request.mifiidChargesOngoing = this.numberService.toBlockchain(request.mifiidChargesOngoing);
        request.mifiidIncidentalCosts = this.numberService.toBlockchain(request.mifiidIncidentalCosts);
        request.mifiidServicesCosts = this.numberService.toBlockchain(request.mifiidServicesCosts);
        request.mifiidTransactionCosts = this.numberService.toBlockchain(request.mifiidTransactionCosts);

        return request;
    }

}
