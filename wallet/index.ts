import {
    SET_ADDRESS_DIRECTORY,
    addressDirectoryReducer,
    AddressDirectoryState,
    getAddressDirectory,
    getAddressDirectoryList,
} from './address-directory';

import {
    MyWalletAddressState,
    MyWalletAddressReducer,
    SET_WALLET_ADDRESSES,
    getWalletAddressList,
    clearRequestedWalletAddresses,
    setRequestedWalletAddresses,
    SET_WALLET_LABEL,
    SET_WALLET_LABEL_UPDATED,
    setRequestedWalletLabel,
    clearRequestedWalletLabel,
} from './my-wallet-address';

import {
    MyWalletsState,
    MyWalletsReducer,
    SET_OWN_WALLETS,
    getMyWalletList,
} from './my-wallets';

import {
    MyWalletHoldingState,
    MyWalletHoldingReducer,
    SET_WALLET_HOLDING,
    getWalletHoldingByAsset,
    getWalletHoldingByAddress,
    SET_ISSUE_HOLDING,
    setRequestedWalletHolding,
    clearRequestedWalletHolding,
} from './my-wallet-holding';

import {
    SET_WALLET_DIRECTORY,
    SET_WALLET_DIRECTORY_WALLET_ADDED,
    SET_WALLET_DIRECTORY_WALLET_UPDATED,
    SET_WALLET_DIRECTORY_WALLET_DELETED,
    WalletDirectoryReducer,
    WalletDirectoryState,
    getWalletDirectory,
    getWalletDirectoryList,
} from './wallet-directory';

import {
    ManagedWalletsState,
    ManagedWalletsReducer,
    SET_MANAGED_WALLETS,
    SET_WALLET_ADDED,
    SET_WALLET_UPDATED,
    SET_WALLET_DELETED,
    getManagedWallets,
    getManageWalletList,
    managedWalletsActions,
} from './managed-wallets';

import {
    WalletRelationshipState,
    WalletRelationshipReducer,
    SET_WALLET_TO_RELATIONSHIP,
    setRequestedWalletToRelationship,
    clearRequestedWalletToRelationship,

    getWalletRelationship,
    getWalletToRelationshipList,
    getRequestWalletToRelationshipState,
} from './wallet-relationship';

import {
    MyWalletContractState,
    MyWalletContractReducer,
    updateContract,
    setContractList,
    setUpdatedContractList,
    setLastCreatedContractDetail,
    updateLastCreatedContractDetail,
    clearContractNeedHandle,
} from './my-wallet-contract';

import {
    SET_ASSET_TRANSACTIONS,
    SET_ALL_TRANSACTIONS,
    TransactionsReducer,
    Transactions,
} from './transactions';

import { combineReducers, Reducer } from 'redux';

export {
    SET_ADDRESS_DIRECTORY,
    addressDirectoryReducer,
    AddressDirectoryState,
    getAddressDirectory,
    getAddressDirectoryList,
};

export {
    SET_WALLET_ADDRESSES,
    getWalletAddressList,
    clearRequestedWalletAddresses,
    setRequestedWalletAddresses,
    SET_WALLET_LABEL,
    SET_WALLET_LABEL_UPDATED,
    setRequestedWalletLabel,
    clearRequestedWalletLabel,
};

// Transactions
export {
    SET_ALL_TRANSACTIONS,
    SET_ASSET_TRANSACTIONS,
    TransactionsReducer,
};

export {
    SET_OWN_WALLETS,
    getMyWalletList,
};

export {
    SET_WALLET_HOLDING,
    getWalletHoldingByAddress,
    getWalletHoldingByAsset,
    SET_ISSUE_HOLDING,
    setRequestedWalletHolding,
    clearRequestedWalletHolding,
};

export {
    SET_WALLET_DIRECTORY,
    SET_WALLET_DIRECTORY_WALLET_ADDED,
    SET_WALLET_DIRECTORY_WALLET_UPDATED,
    SET_WALLET_DIRECTORY_WALLET_DELETED,
    getWalletDirectory,
    getWalletDirectoryList,
};

export {
    SET_MANAGED_WALLETS,
    getManagedWallets,
    getManageWalletList,
    managedWalletsActions,
    SET_WALLET_ADDED,
    SET_WALLET_UPDATED,
    SET_WALLET_DELETED,
};

export {
    SET_WALLET_TO_RELATIONSHIP,
    setRequestedWalletToRelationship,
    clearRequestedWalletToRelationship,
    getWalletRelationship,
    getWalletToRelationshipList,
    getRequestWalletToRelationshipState,
};

export {
    updateContract,
    setContractList,
    setUpdatedContractList,
    setLastCreatedContractDetail,
    updateLastCreatedContractDetail,
    clearContractNeedHandle,
};

export interface WalletState {
    addressDirectory: AddressDirectoryState;
    myWalletAddress: MyWalletAddressState;
    myWallets: MyWalletsState;
    myWalletHolding: MyWalletHoldingState;
    walletDirectory: WalletDirectoryState;
    managedWallets: ManagedWalletsState;
    walletRelationship: WalletRelationshipState;
    myWalletContract: MyWalletContractState;
    transactions: Transactions;
}

export const walletReducer: Reducer<WalletState> = combineReducers<WalletState>(
    {
        addressDirectory: addressDirectoryReducer,
        myWalletAddress: MyWalletAddressReducer,
        myWallets: MyWalletsReducer,
        myWalletHolding: MyWalletHoldingReducer,
        walletDirectory: WalletDirectoryReducer,
        managedWallets: ManagedWalletsReducer,
        walletRelationship: WalletRelationshipReducer,
        myWalletContract: MyWalletContractReducer,
        transactions: TransactionsReducer,
    },
);
