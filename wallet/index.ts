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
    MyWalletHoldingState,
    MyWalletHoldingReducer,
    SET_WALLET_HOLDING,
    getWalletHoldingByAsset,
    getWalletHoldingByAddress
} from './my-wallet-holding';

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

import {
    WalletRelationshipState,
    WalletRelationshipReducer,
    SET_WALLET_TO_RELATIONSHIP,
    setRequestedWalletToRelationship,
    clearRequestedWalletToRelationship,

    getWalletRelationship,
    getWalletToRelationshipList,
    getRequestWalletToRelationshipState
} from './wallet-relationship';

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
    SET_WALLET_HOLDING,
    getWalletHoldingByAddress,
    getWalletHoldingByAsset
};

export {
    SET_WALLET_DIRECTORY,
    getWalletDirectory,
    getWalletDirectoryList,
};

export {
    SET_MANAGED_WALLETS,
    getManagedWallets,
    getManageWalletList
};

export {
    SET_WALLET_TO_RELATIONSHIP,
    setRequestedWalletToRelationship,
    clearRequestedWalletToRelationship,
    getWalletRelationship,
    getWalletToRelationshipList,
    getRequestWalletToRelationshipState
};

export interface WalletState {
    myWalletAddress: MyWalletAddressState;
    myWallets: MyWalletsState;
    myWalletHolding: MyWalletHoldingState;
    walletDirectory: WalletDirectoryState;
    managedWallets: ManagedWalletsState;
    walletRelationship: WalletRelationshipState;
}

export const walletReducer: Reducer<WalletState> = combineReducers<WalletState>({
        myWalletAddress: MyWalletAddressReducer,
        myWallets: MyWalletsReducer,
        myWalletHolding: MyWalletHoldingReducer,
        walletDirectory: WalletDirectoryReducer,
        managedWallets: ManagedWalletsReducer,
        walletRelationship: WalletRelationshipReducer

    }
);
