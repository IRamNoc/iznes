/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Member socket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper, Common } from '@setl/utils';
import * as _ from 'lodash';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiRequestWalletIdsByAddresses,
    GetFundWithHoldersRequestData,
} from './model';

import {
    OFI_SET_FUNDS_BY_USER_REQUESTED,
    OFI_SET_FUNDS_BY_USER_LIST,
    OFI_SET_FUNDS_WITH_HOLDERS_REQUESTED,
    OFI_SET_FUNDS_WITH_HOLDERS_LIST,
} from '../../ofi-store/ofi-am-dashboard/share-holders/actions';

@Injectable()
export class OfiAmDashboardService {
    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */
    }

    static defaultRequestGetUserManagementCompanyFunds(ofiAmDashboardService: OfiAmDashboardService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({ type: OFI_SET_FUNDS_BY_USER_REQUESTED });

        // Request the list.
        const asyncTaskPipe = ofiAmDashboardService.getUserManagementCompanyFunds();

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_FUNDS_BY_USER_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestGetFundWithHolders(ofiAmDashboardService: OfiAmDashboardService, ngRedux: NgRedux<any>, getFundWithHoldersRequestData: GetFundWithHoldersRequestData) {
        // Set the state flag to true. so we do not request it again.
        // ngRedux.dispatch({type: OFI_SET_FUNDS_WITH_HOLDERS_REQUESTED});

        // Request the list.
        const asyncTaskPipe = ofiAmDashboardService.getFundWithHolders(getFundWithHoldersRequestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_FUNDS_WITH_HOLDERS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Get Fund Manager Assets
     * -----------------------
     *
     */
    public getFundManagerAssets(): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiMemberNodeBody = {
            RequestName: 'getfundmanageasset',
            token: this.memberSocketService.token,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
        });
    }

    /**
     * Get Wallet IDs by Many Addresses
     * --------------------------------
     * Get's a list of wallet IDs by wallet addresses.
     *
     * @param {Array<string>} walletAddresses
     *
     * @return {Promise<any>} walletIds
     */
    public getWalletIdsByAddresses(walletAddresses: Array<string>): Promise<any> {
        /* Setup the message body. */
        const messageBody: OfiRequestWalletIdsByAddresses = {
            RequestName: 'gwidbyma',
            token: this.memberSocketService.token,
            addresses: walletAddresses,
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
        });
    }

    getUserManagementCompanyFunds(): any {
        const messageBody: OfiMemberNodeBody = {
            RequestName: 'izngetsimplefunds',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getFundWithHolders(requestData: GetFundWithHoldersRequestData): any {
        const messageBody: OfiMemberNodeBody = {
            RequestName: 'iznrecordkeepinggetfund',
            token: this.memberSocketService.token,
            fundId: _.get(requestData, 'fundId', 0),
            selectedFilter: _.get(requestData, 'selectedFilter', 0),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Build Request
     * -------------
     * Builds a request and sends it, responding when it completes.
     *
     * @param {object} options - an object of options.
     *
     * @return {Promise<any>}
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
