/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper, Common } from '@setl/utils';

/* Import actions. */
import {
    OFI_SET_ORDER_LIST
} from '../../ofi-store';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
} from './model';

@Injectable()
export class OfiManageOrdersService {

    /* Constructor. */
    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */
    }

    /**
     * Get Orders List
     * ---------------
     * Fetches a list of arrangements, aka orders.
     *
     * @return {Promise}
     */
    public getOrdersList(): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiMemberNodeBody = {
            RequestName: 'getarrangementlist',
            token: this.memberSocketService.token,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            'successActions': [ OFI_SET_ORDER_LIST ]
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
