import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';
import { LogService } from '@setl/utils';
import { OfiInitialisationService } from '../initialisation/initialisation.service';
import { ofiClearHolderDetailRequested, ofiClearRequestedAmHolders } from '../../ofi-store/ofi-reports/holders/actions';

@Injectable()
export class OfiWalletnodeChannelService {

    constructor(
        private ngRedux: NgRedux<any>,
        private logService: LogService,
    ) {
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
        this.logService.log('-------ofi received update from wallet node-------');
        this.logService.log(id, message, userData);

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
    }

    handleStateViewUpdate(data) {
        this.logService.log('---ofi handle state view update---');
        /**
         * Has all balance view, we can update redux balance state here.
         */

        this.updateWalletBalance(data);
    }

    handleBlockChangeUpdate(data) {
        /**
         * if contracts relate to current wallet has change.
         */
        this.logService.log('---ofi handle block update---');
        OfiInitialisationService.clearMemberNodeRequestedStatesOnNewBlock(this.ngRedux);
        this.ngRedux.dispatch(ofiClearRequestedAmHolders());
        this.ngRedux.dispatch(ofiClearHolderDetailRequested());
    }

    updateWalletBalance(data) {
    }
}
