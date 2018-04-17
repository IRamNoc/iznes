import {combineReducers, Reducer} from 'redux';

import {
    // Action
    addWalletNodeSnapshot,
    addWalletNodeInitialSnapshot,

    // State
    WalletNodeSnapshotDetail,
    WalletNodeInitialSnapshotDetail,
    WalletNodeSnapshotsState,

    // Reducer
    WalletNodeSnapshotReducer
} from './snapshot';


export {
    addWalletNodeSnapshot,
    addWalletNodeInitialSnapshot
}

export interface WalletNodeState {
    walletNodeSnapshots: WalletNodeSnapshotsState;
}

export const WalletNodeReducer: Reducer<WalletNodeState> = combineReducers<WalletNodeState>({
    walletNodeSnapshots: WalletNodeSnapshotReducer
});