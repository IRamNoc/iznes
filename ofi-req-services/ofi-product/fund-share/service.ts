import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {createMemberNodeSagaRequest, createMemberNodeRequest} from '@setl/utils/common';

import {
    AmAllFundShareListRequestBody,
    InvestorFundAccessRequestBody,
    FundShareRequestBody,
    CreateFundShareRequestData
} from './model';
import {
    SET_FUND_SHARE,
    setRequestedFundShare,
    clearRequestedFundShare,
    SET_AM_ALL_FUND_SHARE_LIST,
    setRequestedAmAllFundShare
} from '@ofi/ofi-main/ofi-store/ofi-product';

export interface RequestInvestorFundAccessData {
    investorWalletId: number;
}

@Injectable()
export class OfiFundShareService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    static defaultRequestFundShare(ofiFundService: OfiFundShareService, ngRedux: NgRedux<any>, requestData) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedFundShare());

        // Request the list.
        const asyncTaskPipe = ofiFundService.requestFundShare(requestData);

        console.log('asyncTaskPipe 1', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Request fund share
     * @return {any}
     */
    requestFundShare(requestData): any {
        const messageBody: FundShareRequestBody = {
            RequestName: 'getfundstatus',
            token: this.memberSocketService.token,
            fundShareID: _.get(requestData, 'fundShareID')
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
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

    /**
     * Request all fund share for the asset manager, not just for under particular fund.
     * @return {any}
     */
    requestAmAllFundShareList(): any {
        const messageBody: AmAllFundShareListRequestBody = {
            RequestName: 'getfundstatus',
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
        console.log('this is the request', messageBody);

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    static defaultCreateFundShare(ofiFundService: OfiFundShareService,
        ngRedux: NgRedux<any>,
        requestData,
        successCallback: (data) => void,
        errorCallback: (e) => void) {

        const asyncTaskPipe = ofiFundService.createFundShare(requestData);

        console.log('asyncTaskPipe', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_SHARE],
            [],
            asyncTaskPipe,
            {},
            (data) => successCallback(data),
            (e) => errorCallback(e)
        ));
    }
    /**
     * Create a new Fund Share
     * @return {any}
     */
    createFundShare(requestData): any {
        let messageBody = {
            RequestName: 'iznescreatefundshare',
            token: this.memberSocketService.token
        }

        messageBody = Object.assign(requestData, messageBody);

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
