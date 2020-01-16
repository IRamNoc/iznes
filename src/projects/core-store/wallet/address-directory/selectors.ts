import { createSelector } from 'reselect';
import { WalletState } from '../index';
import { AddressDirectoryState } from './index';

export const getWallet = (state): WalletState => state.wallet;

export const getAddressDirectory = createSelector(
    getWallet,
    (state: WalletState) => state.addressDirectory,
);

export const getAddressDirectoryList = createSelector(
    getAddressDirectory,
    (state: AddressDirectoryState) => state.addressList,
);
