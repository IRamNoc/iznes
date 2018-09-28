import { createSelector } from 'reselect';
import { WalletState } from '../index';
import { ManagedWalletsState } from './index';

const getWallet = (state): WalletState => state.wallet;

export const getManagedWallets = createSelector(
    getWallet,
    (state: WalletState) => state.managedWallets,
);

export const getManageWalletList = createSelector(
    getManagedWallets,
    (state: ManagedWalletsState) => state.walletList,
);
