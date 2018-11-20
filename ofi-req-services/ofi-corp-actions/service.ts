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
    OFI_SET_USER_ISSUED_ASSETS,
    ofiSetRequestedUserIssuedAssets,
} from '../../ofi-store';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,

    /* Coupons */
    OfiRequestCouponsList,
    OfiSetNewCouponBody,
    OfiUpdateCouponBody,
} from './model';

@Injectable()
export class OfiCorpActionService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */
    }

    /**
     * Default static call to get user issued assets, and dispatch default actions, and other
     * default task.
     *
     * @param ofiFundInvestService
     * @param ngRedux
     */
    static defaultRequestUserIssuedAsset(ofiFundInvestService: OfiCorpActionService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetRequestedUserIssuedAssets());

        // Request the list.
        const asyncTaskPipe = ofiFundInvestService.requestUserIssuedAssets();

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_USER_ISSUED_ASSETS],
            [],
            asyncTaskPipe,
            {},
        ));
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
        const messageBody: OfiRequestCouponsList = {
            RequestName: 'getcoupon',
            token: this.memberSocketService.token,
            couponId: 0,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: [OFI_SET_COUPON_LIST],
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
        const messageBody: OfiRequestCouponsList = {
            RequestName: 'getcoupon',
            token: this.memberSocketService.token,
            couponId: data.couponId,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: [OFI_SET_COUPON_LIST],
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
            token: this.memberSocketService.token,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: [OFI_SET_USER_ISSUED_ASSETS],
        });
    }

    requestUserIssuedAssets(): any {
        const messageBody: OfiMemberNodeBody = {
            RequestName: 'getuserissuedasset',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Set New Coupon
     * ----------------------
     * Sends a request to create a new coupon.
     *
     * @return {Promise<any>} promise, resolved when response returns.
     */
    public setNewCoupon(data): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiSetNewCouponBody = {
            RequestName: 'newcoupon',
            token: this.memberSocketService.token,
            userCreated: data.userCreated,
            dateValuation: data.dateValuation,
            fund: data.fund,
            fundIsin: data.fundIsin,
            amount: data.amount,
            amountGross: data.amountGross,
            dateSettlement: data.dateSettlement,
            comment: data.comment,
            status: data.status,
            accountId: data.accountId,
            dateLastUpdated: data.dateLastUpdated,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: [],
        });
    }

    /**
     * Update Coupon
     * ----------------------
     * Sends a request to update a coupon status.
     *
     * @return {Promise<any>} promise, resolved when response returns.
     */
    public updateCoupon(data): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiUpdateCouponBody = {
            RequestName: 'updatecoupon',
            token: this.memberSocketService.token,
            couponId: data.couponId,
            accountId: data.accountId,
            amount: data.amount,
            amountGross: data.amountGross,
            status: data.status,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: [],
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
                    },
                ),
            );
        });
    }
}
