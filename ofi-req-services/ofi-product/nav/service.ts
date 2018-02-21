import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {
    RequestNavMessageBody,
    RequestNavFundHistoryMessageBody,
    UpdateNavMessageBody,
    DeleteNavMessageBody
} from './model';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';

import {
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,
    SET_NAV_FUND_VIEW,
    setRequestedNavFundView,
    ofiSetCurrentNavFundViewRequest,
    SET_NAV_FUND_HISTORY,
    setRequestedNavFundHistory,
    ofiSetCurrentNavFundHistoryRequest
} from '../../../ofi-store/ofi-product/nav';
import { error } from 'selenium-webdriver';

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
    static defaultRequestNavList(ofiNavService: OfiNavService, ngRedux: NgRedux<any>, requestData: any) {
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

    /**
     * Default static call to get nav fund, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultRequestNavFund(ofiNavService: OfiNavService, ngRedux: NgRedux<any>, requestData: any) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedNavFundView());

        // Request the list.
        const asyncTaskPipe = ofiNavService.requestNav(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_NAV_FUND_VIEW],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    /**
     * Default static call to get nav fund, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultRequestNavHistory(ofiNavService: OfiNavService, ngRedux: NgRedux<any>, requestData: any) {
        // Set the state flag to true. so we do not request it again.
        // ngRedux.dispatch(setRequestedNavFundView());

        // Request the list.
        const asyncTaskPipe = ofiNavService.requestNavFundHistory(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_NAV_FUND_HISTORY],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    /**
     * Default static call to update nav, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultUpdateNav(ofiNavService: OfiNavService,
        ngRedux: NgRedux<any>,
        requestData: any,
        successCallback: (res) => void,
        errorCallback: (res) => void) {
            
        // Create the request.
        const asyncTaskPipe = ofiNavService.updateNav(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (res) => successCallback(res),
            (res) => errorCallback(res)
        ));
    }

    /**
     * Default static call to update nav, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultDeleteNav(ofiNavService: OfiNavService,
        ngRedux: NgRedux<any>,
        requestData: any,
        successCallback: (res) => void,
        errorCallback: (res) => void) {
            
        // Create the request.
        const asyncTaskPipe = ofiNavService.deleteNav(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (res) => successCallback(res),
            (res) => errorCallback(res)
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

    requestNavFundHistory(requestData: any): any {
        const messageBody: RequestNavFundHistoryMessageBody = {
            RequestName: 'getNavFundHistory',
            token: this.memberSocketService.token,
            shareId: _.get(requestData, 'shareId', undefined),
            navDateFrom: _.get(requestData, 'navDateFrom', null),
            navDateTo: _.get(requestData, 'navDateTo', null)
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

    deleteNav(requestData: any): any {
        const messageBody: DeleteNavMessageBody = {
            RequestName: 'deleteNav',
            token: this.memberSocketService.token,
            shareId: _.get(requestData, 'shareId', ''),
            navDate: _.get(requestData, 'navDate', '')
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
