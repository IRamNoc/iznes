import {createSelector} from 'reselect';
import {WalletState} from '../index';
import {MyWalletsState} from './index';

const getWallet = (state): WalletState => state.wallet;

export const getMyWallets = createSelector(
    getWallet,
    (state: WalletState) => state.myWallets
);

export const getMyWalletList = createSelector(
    getMyWallets,
    (state: MyWalletsState) => state.walletList
);

