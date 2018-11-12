import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import {
    DeleteNavMessageBody,
    RequestNavAuditTrailMessageBody,
    RequestNavFundHistoryMessageBody,
    RequestNavFundLatestMessageBody,
    RequestNavMessageBody,
    UpdateNavMessageBody,
    UploadNavFileMessageBody,
    UploadNavFileRequestData,
    CancelNavMessageBody,
} from './model';
import { SagaHelper } from '@setl/utils';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

import {
    SET_NAV_FUND_HISTORY,
    SET_NAV_FUND_VIEW,
    SET_NAV_FUNDS_LIST,
    SET_NAV_LATEST,
    setRequestedNavFundView,
    setRequestedNavLatest,
    setRequestedNavFundsList
} from '../../../ofi-store/ofi-product/nav';

import { SET_NAV_AUDIT } from '../../../ofi-store/ofi-product/nav-audit';

const GLOBAL_UPLOAD_MODE = 'global';
const DETAIL_UPLOAD_MODE = 'detail';

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
     * Default static call to get nav fund, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultRequestNavLatest(ofiNavService: OfiNavService,
                                   ngRedux: NgRedux<any>,
                                   requestData: any,
                                   successCallback: (res) => void,
                                   errorCallback: (res) => void) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedNavLatest());

        // Request the list.
        const asyncTaskPipe = ofiNavService.requestNavFundLatest(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_NAV_LATEST],
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
     * Default static call to delete nav, and dispatch default actions, and other
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

    /**
     * Default static call to cancel nav, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultCancelNav(ofiNavService: OfiNavService,
        ngRedux: NgRedux<any>,
        requestData: any,
        successCallback: (res) => void,
        errorCallback: (res) => void) {

        // Create the request.
        const asyncTaskPipe = ofiNavService.cancelNav(requestData);

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
     * Default static call to get nav audit, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultRequestNavAuditTrail(ofiNavService: OfiNavService,
                                       ngRedux: NgRedux<any>,
                                       requestData: any,
                                       successCallback: (res) => void,
                                       errorCallback: (res) => void) {

        // Create the request.
        const asyncTaskPipe = ofiNavService.requestNavAuditTrail(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_NAV_AUDIT],
            [],
            asyncTaskPipe,
            {},
            (res) => successCallback(res),
            (res) => errorCallback(res)
        ));
    }

    requestNav(requestData: any): any {
        const messageBody: RequestNavMessageBody = {
            RequestName: 'izngetnavfundshares',
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
            RequestName: 'izngetnavfundhistory',
            token: this.memberSocketService.token,
            shareId: _.get(requestData, 'shareId', undefined),
            navDateFrom: _.get(requestData, 'navDateFrom', null),
            navDateTo: _.get(requestData, 'navDateTo', null)
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestNavFundLatest(requestData: any): any {
        const messageBody: RequestNavFundLatestMessageBody = {
            RequestName: 'izngetnavfundlatest',
            token: this.memberSocketService.token,
            fundShareId: _.get(requestData, 'fundShareId', null),
            navDate: _.get(requestData, 'navDate', null)
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateNav(requestData: any): any {
        const messageBody: UpdateNavMessageBody = {
            RequestName: 'iznupdatenav',
            token: this.memberSocketService.token,
            fundShareIsin: _.get(requestData, 'fundShareIsin', ''),
            fundDate: _.get(requestData, 'fundDate', ''),
            navPublicationDate: _.get(requestData, 'navPublicationDate', ''),
            price: _.get(requestData, 'price', 0),
            priceStatus: _.get(requestData, 'priceStatus', 0)
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteNav(requestData: any): any {
        const messageBody: DeleteNavMessageBody = {
            RequestName: 'izndeletenav',
            token: this.memberSocketService.token,
            shareId: _.get(requestData, 'shareId', ''),
            navDate: _.get(requestData, 'navDate', ''),
            navStatus: _.get(requestData, 'navStatus', '')
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    cancelNav(requestData: any): any {
        const messageBody: CancelNavMessageBody = {
            RequestName: 'izncancelnav',
            token: this.memberSocketService.token,
            shareId: _.get(requestData, 'shareId', ''),
            navDate: _.get(requestData, 'navDate', '')
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestNavAuditTrail(requestData: any): any {
        const messageBody: RequestNavAuditTrailMessageBody = {
            RequestName: 'getnavaudit',
            token: this.memberSocketService.token,
            fundShareId: _.get(requestData, 'fundShareId', ''),
            dateFrom: _.get(requestData, 'dateFrom', ''),
            dateTo: _.get(requestData, 'dateTo', ''),
            offset: _.get(requestData, 'offset', ''),
            limit: _.get(requestData, 'limit', '')
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Send the content of csv file as JSON to backend
     *
     * @param {string} mode
     * @param {UploadNavFileRequestData} requestData
     * @param {NgRedux<any>} ngRedux
     * @param {(res) => void} successCallback
     * @param {(err) => void} errorCallback
     */
    uploadNavFile(mode = GLOBAL_UPLOAD_MODE, requestData: UploadNavFileRequestData, ngRedux: NgRedux<any>, successCallback: (res) => void, errorCallback: (err) => void) {
        let messageBody: UploadNavFileMessageBody = {
            RequestName: (mode === DETAIL_UPLOAD_MODE) ? 'iznuploaddetailnavshares' : 'iznuploadglobalnavshares',
            token: this.memberSocketService.token,
            navData: requestData.navData,
        };

        if (mode === DETAIL_UPLOAD_MODE) {
            messageBody = {...messageBody, shareIsin: requestData.shareIsin};
        }

        ngRedux.dispatch(
            SagaHelper.runAsync(
                [],
                [],
                createMemberNodeSagaRequest(this.memberSocketService, messageBody),
                {},
                res => successCallback(res),
                err => errorCallback(err),
            ),
        );
    }
}
