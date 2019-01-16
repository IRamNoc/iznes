import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, NumberConverterService, LogService } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    AmAllFundShareListRequestBody,
    InvestorFundAccessRequestBody,
    FundShareRequestBody,
    CreateFundShareRequestData,
    IznesShareListRequestMessageBody,
    IznDeleteShareDraftRequestBody,
    InvestorHoldingsRequestBody,
    validateKiidRequestBody,
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
    clearRequestedFundShareAudit,
} from '@ofi/ofi-main/ofi-store/ofi-product';
import { OfiFundService } from '../fund/fund.service';

export interface RequestInvestorFundAccessData {
    investorWalletId: number;
}

@Injectable()
export class OfiFundShareService {
    constructor(
        private memberSocketService: MemberSocketService,
        private logService: LogService,
        private numberService: NumberConverterService,
        private ngRedux: NgRedux<any>,
    ) {
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
            ),
        );
    }

    /**
     * Request all fund share for the asset manager, not just for under particular fund.
     * @return {any}
     */
    requestAmAllFundShareList(): any {
        const messageBody: AmAllFundShareListRequestBody = {
            RequestName: 'izngetfundsharelist',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    fetchIznesShareList() {
        const asyncTaskPipe = this.requestIznesShareList();

        this.ngRedux.dispatch(
            SagaHelper.runAsync(
                [SET_FUND_SHARE],
                [],
                asyncTaskPipe,
                {},
                () => {
                    this.ngRedux.dispatch(setRequestedIznesShares());
                },
            ),
        );
    }

    fetchIznesAdminShareList() {
        const asyncTaskPipe = this.requestIznesAdminShareList();

        this.ngRedux.dispatch(
            SagaHelper.runAsync(
                [SET_FUND_SHARE],
                [],
                asyncTaskPipe,
                {},
                () => {
                    this.ngRedux.dispatch(setRequestedIznesShares());
                },
            ),
        );
    }

    requestIznesShareList() {
        const messageBody: IznesShareListRequestMessageBody = {
            RequestName: 'izngetfundsharelist',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestIznesAdminShareList() {
        const messageBody: IznesShareListRequestMessageBody = {
            RequestName: 'izngetadminfundsharelist',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Request all fund shares.
     * @return {any}
     */
    static requestIznesAllShareList(ofiShareService: OfiFundShareService, ngRedux: NgRedux<any>) {
        ngRedux.dispatch(setRequestedIznesShares());

        // Request the list.
        const asyncTaskPipe = ofiShareService.requestIznesAllShareList();

        ngRedux.dispatch(
            SagaHelper.runAsync(
                [GET_IZN_SHARES_LIST],
                [],
                asyncTaskPipe,
                {},
            ),
        );
    }

    requestIznesAllShareList() {
        const messageBody: IznesShareListRequestMessageBody = {
            RequestName: 'izngetallfundsharelist',
            token: this.memberSocketService.token,
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
            investorWalletId: requestData.investorWalletId,
        };
        this.logService.log('this is the request', messageBody);

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Asset manager Request holdings for particular kycId.
     * @return {any}
     */
    requestInvestorHoldings(kycId: string): any {
        const messageBody: InvestorHoldingsRequestBody = {
            RequestName: 'iznclientreferentialgetclientholdings',
            token: this.memberSocketService.token,
            kycId,
        };

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
            data => successCallback(data),
            e => errorCallback(e),
        ));
    }

    createFundShare(requestData): any {
        let messageBody = {
            RequestName: 'iznescreatefundshare',
            token: this.memberSocketService.token,
        };

        this.convertNumbersForBlockchain(requestData);
        messageBody = Object.assign(requestData, messageBody);

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    fetchFundShareByID(fundShareID: number) {
        const asyncTaskPipe = this.requestFundShare(fundShareID);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedFundShare());
            },
        ));
    }

    requestFundShare(fundShareID: number) {
        const messageBody: FundShareRequestBody = {
            RequestName: 'iznesgetfundshare',
            token: this.memberSocketService.token,
            fundShareID,
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
            data => successCallback(data),
            e => errorCallback(e),
        ));
    }

    updateFundShare(requestData): any {
        let messageBody = {
            RequestName: 'iznesupdatefundshare',
            token: this.memberSocketService.token,
        };

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
            data => successCallback(data),
            e => errorCallback(e),
        ));
    }

    createFundShareDocuments(requestData): any {
        let messageBody = {
            RequestName: 'iznescreatefundsharedocs',
            token: this.memberSocketService.token,
        };

        messageBody = Object.assign(requestData, messageBody);

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    fetchFundShareDocs(fundShareID: number) {
        const asyncTaskPipe = this.requestFundShareDocs(fundShareID);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE_DOCS],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedFundShareDocs());
            },
        ));
    }

    requestFundShareDocs(fundShareID: number) {
        const messageBody: FundShareRequestBody = {
            RequestName: 'iznesgetfundsharedocs',
            token: this.memberSocketService.token,
            fundShareID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    fetchFundShareDocsPromise(requestData): any {
        const messageBody: FundShareRequestBody = {
            RequestName: 'iznesgetfundsharedocs',
            token: this.memberSocketService.token,
            fundShareID: _.get(requestData, 'fundShareID'),
        };

        return new Promise((resolve, reject) => {
            createMemberNodeRequest(this.memberSocketService, messageBody)
            .then((d) => {
                resolve(
                    _.omit(
                        _.get(d, [1, 'Data', 0], {}),
                        ['Status', 'fundShareID'],
                    ),
                );
            })
            .catch((err) => {
                reject(new Error(err));
            });
        });
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
            data => successCallback(data),
            e => errorCallback(e),
        ));
    }

    updateFundShareDocuments(requestData): any {
        let messageBody = {
            RequestName: 'iznesupdatefundsharedocs',
            token: this.memberSocketService.token,
        };

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
            data => successCallback(data),
            e => errorCallback(e),
        ));
    }

    getFundShareAudit(requestData): any {
        let messageBody = {
            RequestName: 'getfundshareaudit',
            token: this.memberSocketService.token,
        };

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

    iznDeleteShareDraft(ofiFundShareService: OfiFundShareService, ngRedux: NgRedux<any>, id: string) {
        // Request the list.
        const asyncTaskPipe = ofiFundShareService.deleteShareDraft(id);
        ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe));
    }

    deleteShareDraft(id: string): any {
        const messageBody: IznDeleteShareDraftRequestBody = {
            RequestName: 'izndeleteShareDraft',
            token: this.memberSocketService.token,
            id,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    validateKiid(walletID: number, shareID: number) {
        const messageBody: validateKiidRequestBody = {
            RequestName: 'iznessharevalidatekiid',
            token: this.memberSocketService.token,
            walletID,
            shareID,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    fetchInvestorShareByID(shareID: number) {
        const asyncTaskPipe = this.requestInvestorShareByID(shareID);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE],
            [],
            asyncTaskPipe,
        ));
    }

    requestInvestorShareByID(shareID: number) {
        const messageBody = {
            RequestName: 'iznesgetinvestorsharebyid',
            token: this.memberSocketService.token,
            shareID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
