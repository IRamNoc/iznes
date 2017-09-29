/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper, Common } from '@setl/utils';

/* Import actions. */
import {
    OFI_SET_COUPON_LIST,
    OFI_SET_USER_ISSUED_ASSETS
} from '../../ofi-store';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    RequestCouponsList
} from './model';

@Injectable()
export class OfiCorpActionService {

    /* Constructor. */
    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */
    }

    /**
     * Get Coupon List
     * ---------------
     * Gets the coupon list.
     *
     * @return {Promise}
     */
    public getCouponList(): Promise<any> {
        /* Setup the message body. */
        const messageBody: RequestCouponsList = {
            RequestName: 'getcoupon',
            token: this.memberSocketService.token,
            couponId: 0,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            'successActions': [OFI_SET_COUPON_LIST]
        });
    }

    /**
     * Get Coupon By Id
     * ----------------
     * Gets a coupon by id.
     *
     * @param {id} number - the coupon ID.
     *
     * @return {Promise}
     */
    public getCouponById(data): Promise<any> {
        /* Setup the message body. */
        const messageBody: RequestCouponsList = {
            RequestName: 'getcoupon',
            token: this.memberSocketService.token,
            couponId: data.couponId,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            'successActions': [OFI_SET_COUPON_LIST]
        });
    }

    /**
     * Get User Issued Assets
     * ----------------------
     * Gets a list of user issued assets.
     *
     * @return {Promise<any>} promise, resolved when response returns.
     */
    public getUserIssuedAssets(): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiMemberNodeBody = {
            RequestName: 'getuserissuedasset',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            'successActions': [OFI_SET_USER_ISSUED_ASSETS]
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
