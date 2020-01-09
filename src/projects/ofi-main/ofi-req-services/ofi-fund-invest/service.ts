import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import {
    RequetFundAccessMy,
    AddArrangementRequestBody,
    ArrangementType,
    AddArrangementContractMapRequestBody,
    InsertIssueAssetMapBody,
} from './model';
import { SagaHelper, Common } from '@setl/utils';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

import { setRequestedFundAccessMy, clearRequestedFundAccessMy, SET_FUND_ACCESS_MY } from '../../ofi-store/ofi-fund-invest';

@Injectable()
export class OfiFundInvestService {
    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
    }

    /**
     * Default static call to get my fund access, and dispatch default actions, and other
     * default task.
     *
     * @param ofiFundInvestService
     * @param ngRedux
     */
    static defaultRequestFunAccessMy(ofiFundInvestService: OfiFundInvestService, ngRedux: NgRedux<any>, walletId: number) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedFundAccessMy());

        // Request the list.
        const asyncTaskPipe = ofiFundInvestService.requestFundAccessMy({ walletId });

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_ACCESS_MY],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    fetchFundAccessMy(walletId: number) {
        const asyncTaskPipe = this.requestFundAccessMy({ walletId });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_ACCESS_MY],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedFundAccessMy());
            },
        ));
    }

    requestFundAccessMy(requestData: { walletId: number }): any {
        const messageBody: RequetFundAccessMy = {
            RequestName: 'izngetmyfundshareaccesslist',
            token: this.memberSocketService.token,
            walletId: requestData.walletId || 0,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    addArrangementRequest(requestData: {
        creatorId: number;
        type: ArrangementType;
        metaData: any;
        asset: string;
        parties: any;
        cutoff: string;
        delivery: string;
        valuation: string;
    }): any {

        const messageBody: AddArrangementRequestBody = {
            RequestName: 'savearrangement',
            token: this.memberSocketService.token,
            creatorId: _.get(requestData, 'creatorId', 0),
            type: _.get(requestData, 'type', 0),
            metaData: _.get(requestData, 'metaData', ''),
            asset: _.get(requestData, 'asset', ''),
            investBy: _.get(requestData, 'investBy', 0),
            quantity: _.get(requestData, 'quantity', 0),
            amountWithCost: _.get(requestData, 'amountWithCost', 0),
            feePercent: _.get(requestData, 'feePercent', 0),
            platFormFee: _.get(requestData, 'platFormFee', 0),
            parties: _.get(requestData, 'parties', {}),
            cutoff: _.get(requestData, 'cutoff', ''),
            delivery: _.get(requestData, 'delivery', ''),
            valuation: _.get(requestData, 'valuation', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    addArrangementContractMapRequest(requestData: {
        walletId: number;
        arrangementId: number;
        contractAddress: string;
        expiry: number;
    }): any {
        const messageBody: AddArrangementContractMapRequestBody = {
            RequestName: 'aacm',
            token: this.memberSocketService.token,
            walletId: _.get(requestData, 'walletId', 0),
            arrangementId: _.get(requestData, 'arrangementId', ''),
            contractAddress: _.get(requestData, 'contractAddress', ''),
            expiry: _.get(requestData, 'expiry', 0),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    insertIssueAssetMap(requestData: {
        address: string;
        asset: string;
        isin: string;
        companyId: string;
    }): any {
        const messageBody: InsertIssueAssetMapBody = {
            RequestName: 'niasm',
            token: this.memberSocketService.token,
            address: _.get(requestData, 'address', 0),
            asset: _.get(requestData, 'asset', ''),
            isin: _.get(requestData, 'isin', ''),
            companyId: _.get(requestData, 'companyId', 0),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
