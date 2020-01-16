import {Action} from 'redux';

import {ADD_WALLETNODE_SNAPSHOT, WalletNodeSnapshotAction, ADD_WALLETNODE_INITIAL_SNAPSHOT, WalletNodeInitialSnapshotAction} from './actions';
import {WalletNodeSnapshotsState} from './model';


const initialState: WalletNodeSnapshotsState = {
    blockChainInfo : {
        Hostname : ''
    },
    snapshotList: []
};

export const WalletNodeSnapshotReducer = function (state: WalletNodeSnapshotsState = initialState, action: Action) {

    switch (action.type) {
        case ADD_WALLETNODE_SNAPSHOT:
            return addSnapshotToChainList(state, <WalletNodeSnapshotAction>action);
        case ADD_WALLETNODE_INITIAL_SNAPSHOT:
            return addInitialSnapshotToChainList(state, <WalletNodeInitialSnapshotAction>action);
        default:
            return state;
    }
};

function addSnapshotToChainList(state: WalletNodeSnapshotsState, action: WalletNodeSnapshotAction): WalletNodeSnapshotsState {
    let snapshot = action.snapshot;

    return {
        blockChainInfo : state.blockChainInfo,
        snapshotList: state.snapshotList.concat(snapshot)
    };
}

function addInitialSnapshotToChainList(state: WalletNodeSnapshotsState, action: WalletNodeInitialSnapshotAction): WalletNodeSnapshotsState {
    let initialSnapshot = action.snapshot.LastBlock;
    initialSnapshot.TX24Hours = action.snapshot.TX24Hours;

    let blockChainInfo = {
        Hostname : action.snapshot.Hostname
    };

    return {
        blockChainInfo : blockChainInfo,
        snapshotList: state.snapshotList.concat(initialSnapshot)
    };
}