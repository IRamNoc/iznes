import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';

import {AmAllFundShareListRequestBody, InvestorFundAccessRequestBody, IznesShareListRequestMessageBody} from './model';
import {
    SET_AM_ALL_FUND_SHARE_LIST,
    setRequestedAmAllFundShare,
    setRequestedIznesShares,
    GET_IZN_SHARES_LIST
} from '../../../ofi-store/ofi-product/fundshare/actions';

export interface RequestInvestorFundAccessData {
    investorWalletId: number;
}

@Injectable()
export class OfiFundShareService {

    constructor(private memberSocketService: MemberSocketService) {
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
            RequestName: 'getfundstatus',
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
        console.log('this is the request', messageBody);

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

}
