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

import {
    ManagedWalletsState,
    ManagedWalletsReducer,
    SET_MANAGED_WALLETS,
    getManagedWallets,
    getManageWalletList
} from './managed-wallets';

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

export {
    SET_MANAGED_WALLETS,
    getManagedWallets,
    getManageWalletList
};

export interface WalletState {
    myWalletAddress: MyWalletAddressState;
    myWallets: MyWalletsState;
    walletDirectory: WalletDirectoryState;
    managedWallets: ManagedWalletsState;
}

export const walletReducer: Reducer<WalletState> = combineReducers<WalletState>({
    myWalletAddress: MyWalletAddressReducer,
    myWallets: MyWalletsReducer,
    walletDirectory: WalletDirectoryReducer,
    managedWallets: ManagedWalletsReducer
});
