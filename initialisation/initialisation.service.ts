import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {WalletNodeRequestService} from '../index';
import {SET_WALLET_ADDRESSES} from '@setl/core-store';
import {SagaHelper} from '@setl/utils';

@Injectable()
export class InitialisationService {

    constructor() {
    }

    static walletnodeInitialisation(ngRedux: NgRedux<any>,
                                    walletNodeRequestService: WalletNodeRequestService,
                                    walletId: number): void {
        // Request wallet address.
        // walletAddressRequest
        this.requestWalletAddresses(ngRedux, walletNodeRequestService, walletId);

    }

    static requestWalletAddresses(ngRedux: NgRedux<any>,
                                  walletNodeRequestService: WalletNodeRequestService,
                                  walletId: number) {
        // Create a saga pipe.
        const asyncTaskPipes = walletNodeRequestService.walletAddressRequest({
            walletId: 2,
        });

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_ADDRESSES],
            [],
            asyncTaskPipes, {}));

        return false;
    }

}
