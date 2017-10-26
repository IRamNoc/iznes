/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper, Common } from '@setl/utils';

/* Import actions. */
import {
    OFI_SET_MANAGE_ORDER_LIST,
    OFI_SET_MY_ORDER_LIST,
    OFI_SET_HOME_ORDER_LIST,
    OFI_SET_HOME_ORDER_BUFFER,
    OFI_RESET_HOME_ORDER_BUFFER
} from '../../ofi-store';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiRequestArrangements,
    OfiUpdateArrangement,
    OfiGetContractByOrder,
} from './model';

@Injectable()
export class OfiOrdersService {

    /* Constructor. */
    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */
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
            'successActions': [ OFI_SET_MANAGE_ORDER_LIST ]
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
            'successActions': [ OFI_SET_MY_ORDER_LIST ]
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
            'successActions': [ OFI_SET_HOME_ORDER_LIST ]
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
    public updateOrder (data: any): Promise<any> {
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
    public getContractsByOrder (data: any): Promise<any> {
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

    //gconbarr

    /**
     * Set Order Buffer
     * ------------------
     * Sets the order buffer to an order's ID.
     *
     * @param {number} orderId - the order id.
     *
     * @return {void}
     */
    public setOrderBuffer (orderId: number):void {
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
    public resetOrderBuffer ():void {
        /* Dispatch the event. */
        this.ngRedux.dispatch({
            'type': OFI_SET_HOME_ORDER_BUFFER,
            'payload': -1
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
        })
    }

}
