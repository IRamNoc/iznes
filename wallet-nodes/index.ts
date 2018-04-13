import {combineReducers, Reducer} from 'redux';

import {
    // Action
    addWalletNodeSnapshot,

    // State
    WalletNodeSnapshotDetail,
    WalletNodeInitialSnapshotDetail,
    WalletNodeSnapshotListState,

    // Reducer
    WalletNodeSnapshotReducer
} from './snapshot';


export {
    addWalletNodeSnapshot
}

export interface WalletNodeState {
    walletNodeSnapshotList: WalletNodeSnapshotListState;
}

export const WalletNodeReducer: Reducer<WalletNodeState> = combineReducers<WalletNodeState>({
    walletNodeSnapshotList: WalletNodeSnapshotReducer
});