import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {
    RequetFundAccessMy,
    AddArrangementRequestBody,
    ArrangementType,
    AddArrangementContractMapRequestBody
} from './model';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';
import _ from 'lodash';

import {setRequestedFundAccessMy, SET_FUND_ACCESS_MY} from '../../ofi-store/ofi-fund-invest';

@Injectable()
export class OfiFundInvestService {
    constructor(private memberSocketService: MemberSocketService) {
        console.log(this.memberSocketService);
    }

    /**
     * Default static call to get my fund access, and dispatch default actions, and other
     * default task.
     *
     * @param ofiFundInvestService
     * @param ngRedux
     */
    static defaultRequestFunAccessMy(ofiFundInvestService: OfiFundInvestService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedFundAccessMy());

        // Request the list.
        const asyncTaskPipe = ofiFundInvestService.requestFundAccessMy();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_ACCESS_MY],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    requestFundAccessMy(): any {
        const messageBody: RequetFundAccessMy = {
            RequestName: 'getfundaccessmy',
            token: this.memberSocketService.token
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
            parties: _.get(requestData, 'parties', {}),
            cutoff: _.get(requestData, 'cutoff', ''),
            delivery: _.get(requestData, 'delivery', ''),
            valuation: _.get(requestData, 'valuation', '')
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

}
