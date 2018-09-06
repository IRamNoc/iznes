import { combineReducers, Reducer } from 'redux';

import {
    // Action
    addWalletNodeSnapshot,
    addWalletNodeInitialSnapshot,

    // State
    WalletNodeSnapshotDetail,
    WalletNodeInitialSnapshotDetail,
    WalletNodeSnapshotsState,

    // Reducer
    WalletNodeSnapshotReducer,
} from './snapshot';

import {
    // Action
    ADD_WALLETNODE_TX_STATUS,
    UPDATE_WALLETNODE_TX_STATUS,
    updateWalletnodeTxStatus,

    // State
    WalletNodeTransactionStatusState,

    // Reducer
    walletNodeTransactionStatusReducer,
} from './transaction-status';

export {
    addWalletNodeSnapshot,
    addWalletNodeInitialSnapshot,
    ADD_WALLETNODE_TX_STATUS,
    UPDATE_WALLETNODE_TX_STATUS,
    updateWalletnodeTxStatus,
};

export interface WalletNodeState {
    walletNodeSnapshots: WalletNodeSnapshotsState;
    transactionStatus: WalletNodeTransactionStatusState;
}

export const WalletNodeReducer: Reducer<WalletNodeState> = combineReducers<WalletNodeState>({
    walletNodeSnapshots: WalletNodeSnapshotReducer,
    transactionStatus: walletNodeTransactionStatusReducer,
});