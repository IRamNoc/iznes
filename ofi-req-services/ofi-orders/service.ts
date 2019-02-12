/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper } from '@setl/utils';

/* Import actions. */
import {
    OFI_SET_MANAGE_ORDER_LIST,
    ofiSetRequestedManageOrder,
    ofiClearRequestedManageOrder,
} from '../../ofi-store/';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiAmOrdersRequestBody,
    OfiCancelOrderRequestBody,
    IznesNewOrderRequestBody,
    IznesMarkOrderSettleRequestBody,
    ManageOrdersRequestData,
    CancelOrderRequestData,
    OfiIznAdminOrdersRequestBody,
} from './model';

@Injectable()
export class OfiOrdersService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiClearRequestedManageOrder());
        } else {
            ngRedux.dispatch(ofiSetRequestedManageOrder());
        }
    }

    static defaultRequestManageOrdersList(ofiOrdersService: OfiOrdersService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetRequestedManageOrder());

        // Request the list.
        const asyncTaskPipe = ofiOrdersService.requestManageOrdersList({
            pageSize: 10,
            rowOffSet: 0,
            sortByField: 'orderId', // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
            sortOrder: 'desc', // asc / desc
        });

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_MANAGE_ORDER_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestInvestorOrdersList(ofiOrdersService: OfiOrdersService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetRequestedManageOrder());

        // Request the list.
        const asyncTaskPipe = ofiOrdersService.requestInvestorOrdersList({
            pageSize: 10,
            rowOffSet: 0,
            sortByField: 'orderId', // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
            sortOrder: 'desc', // asc / desc
        });

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_MANAGE_ORDER_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    placeFakeOrder(): any {
        const messageBody: OfiMemberNodeBody = {
            RequestName: 'iznesfakeorder',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    addNewOrder(requestData: {
        shareIsin: string;
        portfolioId: number;
        subportfolio: string,
        dateBy: string;
        dateValue: string;
        orderType: string;
        orderBy: string;
        orderValue: number;
        comment: string;
        classificationFee: number;
    }): any {
        const messageBody: IznesNewOrderRequestBody = {
            RequestName: 'iznesneworder',
            token: this.memberSocketService.token,
            shareisin: requestData.shareIsin,
            portfolioid: requestData.portfolioId,
            subportfolio: requestData.subportfolio,
            dateby: requestData.dateBy,
            datevalue: requestData.dateValue,
            ordertype: requestData.orderType,
            orderby: requestData.orderBy,
            ordervalue: requestData.orderValue,
            comment: requestData.comment,
            classificationFee: requestData.classificationFee,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    markOrderSettle(requestData: {
        orderId: number;
    }) {
        const messageBody: IznesMarkOrderSettleRequestBody = {
            RequestName: 'iznesmarkordersettle',
            token: this.memberSocketService.token,
            orderId: requestData.orderId,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);

    }

    requestManageOrdersList(data: ManageOrdersRequestData): any {
        const messageBody: OfiAmOrdersRequestBody = {
            RequestName: 'izngetamorders',
            token: this.memberSocketService.token,
            fundName: data.fundName,
            shareName: data.shareName,
            status: data.status,
            orderType: data.orderType,
            isin: data.isin,
            orderId: data.orderID,
            currency: data.currency,
            quantity: data.quantity,
            amountWithCost: data.amountWithCost,
            dateSearchField: data.dateSearchField,
            fromDate: data.fromDate,
            toDate: data.toDate,
            pageSize: data.pageSize,
            rowOffset: (data.rowOffSet * data.pageSize),
            sortByField: data.sortByField,
            sortOrder: data.sortOrder,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestInvestorOrdersList(data: ManageOrdersRequestData): any {
        const messageBody: OfiAmOrdersRequestBody = {
            RequestName: 'izngetinvestororders',
            token: this.memberSocketService.token,
            fundName: data.fundName,
            shareName: data.shareName,
            status: data.status,
            orderType: data.orderType,
            isin: data.isin,
            orderId: data.orderID,
            currency: data.currency,
            quantity: data.quantity,
            amountWithCost: data.amountWithCost,
            dateSearchField: data.dateSearchField,
            fromDate: data.fromDate,
            toDate: data.toDate,
            pageSize: data.pageSize,
            rowOffset: (data.rowOffSet * data.pageSize),
            sortByField: data.sortByField,
            sortOrder: data.sortOrder,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestIznesAdminOrdersList(data: ManageOrdersRequestData): any {
        const messageBody: OfiIznAdminOrdersRequestBody = {
            RequestName: 'iznactivitiesgetorders',
            token: this.memberSocketService.token,
            fundName: data.fundName,
            shareName: data.shareName,
            status: data.status,
            orderType: data.orderType,
            isin: data.isin,
            orderId: data.orderID,
            currency: data.currency,
            quantity: data.quantity,
            amountWithCost: data.amountWithCost,
            dateSearchField: data.dateSearchField,
            fromDate: data.fromDate,
            toDate: data.toDate,
            pageSize: data.pageSize,
            rowOffset: (data.rowOffSet * data.pageSize),
            sortByField: data.sortByField,
            sortOrder: data.sortOrder,
            assetManagementCompany: data.assetManagementCompany,
            investorCompanyName: data.investorCompanyName,
            portfolioLabel: data.portfolioLabel,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestCancelOrderByAM(data: CancelOrderRequestData): any {
        const messageBody: OfiCancelOrderRequestBody = {
            RequestName: 'izncancelorderbyam',
            token: this.memberSocketService.token,
            orderID: data.orderID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestCancelOrderByInvestor(data: CancelOrderRequestData): any {
        const messageBody: OfiCancelOrderRequestBody = {
            RequestName: 'izncancelorderbyinvestor',
            token: this.memberSocketService.token,
            orderID: data.orderID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Build Request
     * -------------
     * Builds a request and sends it, responsing when it completes.
     *
     * @param {options} Object - and object of options.
     *
     * @return {Promise<any>} [description]
     */
    public buildRequest(options): Promise<any> {
        /* Check for taskPipe,  */
        return new Promise((resolve, reject) => {
            /* Dispatch the request. */
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    options.successActions || [],
                    options.failActions || [],
                    options.taskPipe,
                    {},
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    },
                ),
            );
        });
    }
}
