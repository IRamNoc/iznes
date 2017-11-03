/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';

/* Member socket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {SagaHelper, Common} from '@setl/utils';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiRequestWalletIdsByAddresses,
} from './model';

@Injectable()
export class OfiAmDashboardService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,) {
        /* Stub. */
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
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
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
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
        });
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
                    }
                )
            );
        })
    }

}
