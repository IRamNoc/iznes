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
    OFI_SET_MY_ORDER_LIST
} from '../../ofi-store';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiRequestArrangements
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
     * ---------------
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
     * ---------------
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
    * Build Request
    * -------------
    * Builds a request and sends it, responsing when it completes.
    *
    * @param {options} Object - and object of options.
    *
    * @return {Promise<any>} [description]
    */
    private buildRequest(options): Promise<any> {
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
