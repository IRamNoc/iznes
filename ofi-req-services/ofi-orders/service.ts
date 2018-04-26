/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';
import {SagaHelper, Common} from '@setl/utils';

/* Import actions. */
import {
    OFI_SET_MANAGE_ORDER_LIST,
    ofiSetRequestedManageOrder,
    ofiClearRequestedManageOrder,
    OFI_SET_MY_ORDER_LIST,
    ofiSetRequestedMyOrder,
    ofiClearRequestedMyOrder,
    OFI_SET_HOME_ORDER_LIST,
    OFI_SET_HOME_ORDER_BUFFER,
    OFI_RESET_HOME_ORDER_BUFFER,
    OFI_SET_HOME_ORDER_FILTER,
    OFI_RESET_HOME_ORDER_FILTER,
    setRequestedCollectiveArchive,
    SET_COLLECTIVE_ARCHIVE
} from '../../ofi-store/';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiAmOrdersRequestBody,
    OfiAmExportOrdersRequestBody,
    OfiCancelOrderRequestBody,
    OfiRequestArrangements,
    OfiUpdateArrangement,
    OfiGetContractByOrder,
    OfiGetArrangementCollectiveArchive,
    IznesNewOrderRequestBody
} from './model';

interface ManageOrdersData {
    shareName?: string;
    status?: number;
    orderType?: number;
    isin?: any;
    orderID?: number;
    currency?: number;
    quantity?: number;
    amountWithCost?: number;
    dateSearchField?: string;
    fromDate?: string;
    toDate?: string;
    pageSize?: number;
    rowOffSet?: number;
    sortByField?: string;
    sortOrder?: string;
}

interface ExportOrdersData {
    filters: any;
}

interface CancelOrderData {
    orderID: number;
}

@Injectable()
export class OfiOrdersService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {
        /* Stub. */
    }

    /**
     * Default static call to get arrangement collective archive, and dispatch default actions, and other
     * default task.
     *
     * @param ofiOrdersService
     * @param ngRedux
     */
    static defaultGetArrangementCollectiveArchive(ofiOrdersService: OfiOrdersService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedCollectiveArchive());

        // Request the list.
        const asyncTaskPipe = ofiOrdersService.getCollectiveArchive();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_COLLECTIVE_ARCHIVE],
            [],
            asyncTaskPipe,
            {}
        ));
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
        ngRedux.dispatch(ofiSetRequestedMyOrder());

        // Request the list.
        const asyncTaskPipe = ofiOrdersService.requestInvestorOrdersList({
            pageSize: 10,
            rowOffSet: 0,
            sortByField: 'orderId', // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
            sortOrder: 'desc', // asc / desc
        });

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_MY_ORDER_LIST],
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
            comment: requestData.comment
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    requestManageOrdersList(data: ManageOrdersData): any {

        const messageBody: OfiAmOrdersRequestBody = {
            RequestName: 'izngetamorders',
            token: this.memberSocketService.token,
            shareName: data.shareName,
            status: data.status,
            orderType: data.orderType,
            isin: data.isin,
            orderID: data.orderID,
            currency: data.currency,
            quantity: data.quantity,
            amountWithCost: data.amountWithCost,
            dateSearchField: data.dateSearchField,
            fromDate: data.fromDate,
            toDate: data.toDate,
            pageSize: data.pageSize,
            rowOffSet: (data.rowOffSet * data.pageSize),
            sortByField: data.sortByField,
            sortOrder: data.sortOrder,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestInvestorOrdersList(data: ManageOrdersData): any {

        const messageBody: OfiAmOrdersRequestBody = {
            RequestName: 'izngetinvestororders',
            token: this.memberSocketService.token,
            shareName: data.shareName,
            status: data.status,
            orderType: data.orderType,
            isin: data.isin,
            orderID: data.orderID,
            currency: data.currency,
            quantity: data.quantity,
            amountWithCost: data.amountWithCost,
            dateSearchField: data.dateSearchField,
            fromDate: data.fromDate,
            toDate: data.toDate,
            pageSize: data.pageSize,
            rowOffSet: (data.rowOffSet * data.pageSize),
            sortByField: data.sortByField,
            sortOrder: data.sortOrder,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestCancelOrderByAM(data: CancelOrderData): any {

        const messageBody: OfiCancelOrderRequestBody = {
            RequestName: 'izncancelorderbyam',
            token: this.memberSocketService.token,
            orderID: data.orderID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestCancelOrderByInvestor(data: CancelOrderData): any {

        const messageBody: OfiCancelOrderRequestBody = {
            RequestName: 'izncancelorderbyinvestor',
            token: this.memberSocketService.token,
            orderID: data.orderID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Get Manage Orders List
     * ----------------------
     * Fetches a list of arrangements, aka orders for a manager.
     *
     * @return {Promise}
     */
    public getManageOrdersList(data): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiRequestArrangements = {
            RequestName: 'getarrangementlist',
            token: this.memberSocketService.token,
            status: data.status,
            sortOrder: data.sortOrder,
            sortBy: data.sortBy,
            partyType: data.partyType,
            pageSize: data.pageSize,
            pageNum: data.pageNum,
            asset: data.asset,
            arrangementType: data.arrangementType,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            'successActions': [OFI_SET_MANAGE_ORDER_LIST]
        });
    }

    /**
     * Get My Orders List
     * ------------------
     * Fetches a list of arrangements, aka orders for a user.
     *
     * @return {Promise}
     */
    public getMyOrdersList(data): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiRequestArrangements = {
            RequestName: 'getarrangementlist',
            token: this.memberSocketService.token,
            status: data.status,
            sortOrder: data.sortOrder,
            sortBy: data.sortBy,
            partyType: data.partyType,
            pageSize: data.pageSize,
            pageNum: data.pageNum,
            asset: data.asset,
            arrangementType: data.arrangementType,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            'successActions': [OFI_SET_MY_ORDER_LIST]
        });
    }

    /**
     * Get Home Orders List
     * --------------------
     * Fetches a list of arrangements, aka orders for a user.
     *
     * @return {Promise}
     */
    public getHomeOrdersList(data): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiRequestArrangements = {
            RequestName: 'getarrangementlist',
            token: this.memberSocketService.token,
            status: data.status,
            sortOrder: data.sortOrder,
            sortBy: data.sortBy,
            partyType: data.partyType,
            pageSize: data.pageSize,
            pageNum: data.pageNum,
            asset: data.asset,
            arrangementType: data.arrangementType,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            'successActions': [OFI_SET_HOME_ORDER_LIST]
        });
    }

    /**
     * Update Order
     * ------------------
     * Updates an order (arrangement).
     *
     * @param  {object} data  - the new arrangement information.
     *
     * @return {Promise<any>}
     */
    public updateOrder(data: any): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiUpdateArrangement = {
            RequestName: 'updatearrangement',
            token: this.memberSocketService.token,
            arrangementId: data.arrangementId,
            walletId: data.walletId,
            status: data.status,
            price: data.price,
            deamonToken: 1,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody)
        });
    }

    /**
     * Get Contracts By Order
     * ------------------
     * Gets contracts information by order (arrangement) ID.
     *
     * @param  {object} data  - the order information.
     *
     * @return {Promise<any>}
     */
    public getContractsByOrder(data: any): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiGetContractByOrder = {
            RequestName: 'gconbarr',
            token: this.memberSocketService.token,
            arrangementId: data.arrangementId,
            walletId: data.walletId,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody)
        });
    }

    // gconbarr

    /**
     * Set Order Buffer
     * ------------------
     * Sets the order buffer to an order's ID.
     *
     * @param {number} orderId - the order id.
     *
     * @return {void}
     */
    public setOrderBuffer(orderId: number): void {
        /* Dispatch the event. */
        this.ngRedux.dispatch({
            'type': OFI_SET_HOME_ORDER_BUFFER,
            'payload': orderId
        });
    }

    /**
     * Reset Order Buffer
     * ------------------
     * Sets the order buffer to -1.
     *
     * @return {void}
     */
    public resetOrderBuffer(): void {
        /* Dispatch the event. */
        this.ngRedux.dispatch({
            'type': OFI_RESET_HOME_ORDER_BUFFER,
            'payload': -1,
        });
    }

    /**
     * Set Order Filter
     * ------------------
     * Sets the order filter.
     *
     * @param {string} filter - the order id.
     *
     * @return {void}
     */
    public setOrderFilter(filter: string): void {
        /* Dispatch the event. */
        this.ngRedux.dispatch({
            'type': OFI_SET_HOME_ORDER_FILTER,
            'payload': filter
        });
    }

    /**
     * Reset Order Filter
     * ------------------
     * Sets the order filter to ''.
     *
     * @return {void}
     */
    public resetOrderFilter(): void {
        /* Dispatch the event. */
        this.ngRedux.dispatch({
            'type': OFI_RESET_HOME_ORDER_FILTER,
            'payload': '',
        });
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
                    }
                )
            );
        });
    }

    getCollectiveArchive(): any {
        const messageBody: OfiGetArrangementCollectiveArchive = {
            RequestName: 'getarrangementcollectivearchive',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
