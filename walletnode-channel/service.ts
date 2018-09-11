import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

import { InitialisationService } from '../initialisation/initialisation.service';
import { SagaHelper, LogService } from '@setl/utils';
import { SET_CONTRACT_LIST } from '@setl/core-store/wallet/my-wallet-contract/actions';


@Injectable()
export class WalletnodeChannelService {

    constructor(private ngRedux: NgRedux<any>, private logService: LogService) {
    }

    /**
     * Handle all update message from walletnode.
     *
     * @param id
     * @param message
     * @param userData
     */
    resolveChannelMessage(id, message, userData) {
        this.logService.log(this.ngRedux);
        this.logService.log('-------received update from wallet node-------');
        this.logService.log(id, message, userData);


        const updateType = _.get(message, 'MessageType', '');
        switch (updateType) {
        case 'applied':
            this.handleAppliedTXUpdate(message);
            break;

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

    handleAppliedTXUpdate(data) {
        InitialisationService.updatedWalletNodeTxStatus(this.ngRedux, data);
    }

    handleBlockUpdate(data) {
        /**
         * Contain following data:
         * Block detail
         * Transaction in block for current wallet
         * Effective transactions,
         * and etc.
         */
        this.logService.log('---handle block update---');
        InitialisationService.updatedWalletNodeTxStateWithBlock(this.ngRedux, data);
    }

    handleStateViewUpdate(data) {
        this.logService.log('---handle state view update---');
        /**
         * Has all balance view, we can update redux balance state here.
         */
        this.updateWalletBalance(data);
    }

    handleBlockChangeUpdate(data) {
        /**
         * if contracts relate to current wallet has change.
         */
        this.logService.log('---handle block update---');
        InitialisationService.clearWalletNodeRequestedStates(this.ngRedux);
        InitialisationService.updatedWalletNodeTxStateWithBlockChange(this.ngRedux, data);
    }

    updateWalletBalance(data) {
    }
}

