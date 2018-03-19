import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';

import {InitialisationService} from '../initialisation/initialisation.service';
import {SagaHelper} from '@setl/utils';
import {SET_CONTRACT_LIST} from '@setl/core-store/wallet/my-wallet-contract/actions';


@Injectable()
export class WalletnodeChannelService {

    constructor(private ngRedux: NgRedux<any>) {
    }

    /**
     * Handle all update message from walletnode.
     *
     * @param id
     * @param message
     * @param userData
     */
    resolveChannelMessage(id, message, userData) {
        console.log(this.ngRedux);
        console.log('-------received update from wallet node-------');
        console.log(id, message, userData);


        const updateType = _.get(message, 'MessageType', '');

        switch (updateType) {
            case 'block':
                this.handleBlockUpdate(message);
                break;

            case 'stateview':
                this.handleStateViewUpdate(message);
                break;

            case 'blockchanges':
                this.handleBlockChangeUpdate(message);
                break;
        }
    }

    handleBlockUpdate(data) {
        /**
         * Contain following data:
         * Block detail
         * Transaction in block for current wallet
         * Effective transactions,
         * and etc.
         */
        console.log('---handle block update---');
        InitialisationService.updatedWalletNodeTxStateWithBlock(this.ngRedux, data);
    }


    handleStateViewUpdate(data) {
        console.log('---handle state view update---');
        /**
         * Has all balance view, we can update redux balance state here.
         */
        this.updateWalletBalance(data);
    }

    handleBlockChangeUpdate(data) {
        /**
         * if contracts relate to current wallet has change.
         */
        console.log('---handle block update---');
        InitialisationService.clearWalletNodeRequestedStates(this.ngRedux);
        InitialisationService.updatedWalletNodeTxStateWithBlockChange(this.ngRedux, data);
    }

    updateWalletBalance(data) {
    }
}

