import {
    MyWalletAddressState,
    MyWalletAddressReducer,
    SET_WALLET_ADDRESSES,
    getWalletAddressList
} from './my-wallet-address';

import {
    MyWalletsState,
    MyWalletsReducer,
    SET_OWN_WALLETS,
    getMyWalletList
} from './my-wallets';

import {combineReducers, Reducer} from 'redux';

export {
    SET_WALLET_ADDRESSES,
    getWalletAddressList
};

export {
    SET_OWN_WALLETS,
    getMyWalletList
};

export interface WalletState {
    myWalletAddress: MyWalletAddressState;
    myWallets: MyWalletsState;
}

export const walletReducer: Reducer<WalletState> = combineReducers<WalletState>({
    myWalletAddress: MyWalletAddressReducer,
    myWallets: MyWalletsReducer
});
