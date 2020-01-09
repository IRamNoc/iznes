import {createSelector} from 'reselect';
import {WalletState} from '../index';
import {MyWalletAddressState} from './index';

const getWallet = (state): WalletState => state.wallet;

export const getWalletAddress = createSelector(
    getWallet,
    (state: WalletState) => state.myWalletAddress
);

export const getWalletAddressList = createSelector(
    getWalletAddress,
    (state: MyWalletAddressState) => state.addressList
);


