import { createSelector } from 'reselect';
import { WalletState } from '../index';
import { WalletDirectoryState } from './index';

export const getWallet = (state): WalletState => state.wallet;

export const getWalletDirectory = createSelector(
    getWallet,
    (state: WalletState) => state.walletDirectory,
);

export const getWalletDirectoryList = createSelector(
    getWalletDirectory,
    (state: WalletDirectoryState) => state.walletList,
);
