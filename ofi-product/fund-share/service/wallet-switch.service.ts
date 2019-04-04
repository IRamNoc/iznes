import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { clearRequestedIznesShares } from '../../../ofi-store/ofi-product/fund-share-list/actions';

/**
 * Service to watch the connected wallet and re-request
 * user's share list when changed.
 */
@Injectable({ providedIn: 'root' })
export class WalletSwitchService {
    constructor(redux: NgRedux<any>) {
        redux
            .select(['user', 'connected', 'connectedWallet'])
            .pipe(
                distinctUntilChanged(),
                skip(1),
            )
            .subscribe(() => redux.dispatch(clearRequestedIznesShares()));
    }
}
