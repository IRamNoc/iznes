import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {
    RequestNavMessageBody,
    UpdateNavMessageBody
} from './model';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';

import {
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest
} from '../../../ofi-store/ofi-product/nav';

@Injectable()
export class OfiNavService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    /**
     * Default static call to get nav list, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultRequestNav(ofiNavService: OfiNavService, ngRedux: NgRedux<any>, requestData: any) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedNavFundsList());

        // Request the list.
        const asyncTaskPipe = ofiNavService.requestNav(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_NAV_FUNDS_LIST],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    requestNav(requestData: any): any {
        const messageBody: RequestNavMessageBody = {
            RequestName: 'getNavFundShares',
            token: this.memberSocketService.token,
            shareId: _.get(requestData, 'shareId', undefined),
            fundName: _.get(requestData, 'fundName', ''),
            navDateField: _.get(requestData, 'navDateField', 'navDate'),
            navDate: _.get(requestData, 'navDate', null)
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateNav(requestData: any): any {

        const messageBody: UpdateNavMessageBody = {
            RequestName: 'updateNav',
            token: this.memberSocketService.token,
            fundName: _.get(requestData, 'fundName', ''),
            fundDate: _.get(requestData, 'fundDate', ''),
            price: _.get(requestData, 'price', 0),
            priceStatus: _.get(requestData, 'priceStatus', 0)
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
