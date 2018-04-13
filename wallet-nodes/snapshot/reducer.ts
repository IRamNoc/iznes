import {ADD_WALLETNODE_SNAPSHOT, WalletNodeSnapshot} from './actions';
import {WalletNodeSnapshotListState} from './model';


const initialState: WalletNodeSnapshotListState = {
    snapshotList: []
};

export const WalletNodeSnapshotReducer = function (state: WalletNodeSnapshotListState = initialState, action: WalletNodeSnapshot) {

    switch (action.type) {
        case ADD_WALLETNODE_SNAPSHOT:
            return addSnapshotToChainList(state, action);

        default:
            return state;
    }
};

function addSnapshotToChainList(state: WalletNodeSnapshotListState, action: WalletNodeSnapshot): WalletNodeSnapshotListState {
    let snapshot = action.snapshot;
    
    return {
        snapshotList: state.snapshotList.concat(snapshot)
    };
}
