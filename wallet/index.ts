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

import {
    SET_WALLET_DIRECTORY,
    WalletDirectoryReducer,
    WalletDirectoryState,
    getWalletDirectory,
    getWalletDirectoryList
} from './wallet-directory';

import {combineReducers, Reducer} from 'redux';

export {
    SET_WALLET_ADDRESSES,
    getWalletAddressList
};

export {
    SET_OWN_WALLETS,
    getMyWalletList
};

export {
    SET_WALLET_DIRECTORY,
    getWalletDirectory,
    getWalletDirectoryList
};

export interface WalletState {
    myWalletAddress: MyWalletAddressState;
    myWallets: MyWalletsState;
    walletDirectory: WalletDirectoryState;
}

export const walletReducer: Reducer<WalletState> = combineReducers<WalletState>({
    myWalletAddress: MyWalletAddressReducer,
    myWallets: MyWalletsReducer,
    walletDirectory: WalletDirectoryReducer
});
