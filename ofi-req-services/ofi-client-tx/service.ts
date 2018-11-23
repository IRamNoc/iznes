import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import {
    RequestClientTxRequestBody,
} from './model';
import { SagaHelper, Common } from '@setl/utils';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

import { SET_CLIENT_TX_LIST, setRequestedClientTxList } from '../../ofi-store/ofi-client-txs';

@Injectable()
export class OfiClientTxService {
    constructor(
        private memberSocketService: MemberSocketService,
    ) {
    }

    /**
     * Default static call to get client txs, and dispatch default actions, and other
     * default task.
     *
     * @param ofiClientTxService
     * @param ngRedux
     */
    static defaultRequestWalletClientTxs(ofiClientTxService: OfiClientTxService, ngRedux: NgRedux<any>,
                                         walletId: number, shareName: string) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedClientTxList());

        // Request the list.
        const asyncTaskPipe = ofiClientTxService.requestWalletClientTxs({ walletId, shareName });

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CLIENT_TX_LIST],
            [],
            asyncTaskPipe,
            {},
            (data) => {
                // console.log(data);
            },
        ));
    }

    requestWalletClientTxs(requestData: {
        walletId: number;
        shareName: string;
    }): any {
        const messageBody: RequestClientTxRequestBody = {
            RequestName: 'getwalletclienttxs',
            token: this.memberSocketService.token,
            walletId: _.get(requestData, 'walletId', 0),
            shareName: _.get(requestData, 'shareName', ''),

        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
