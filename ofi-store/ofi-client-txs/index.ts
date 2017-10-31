import {combineReducers, Reducer} from 'redux';

import {
    OfiClientTxsListState,
    OfiClientTxListReducer,

    // Actions
    SET_CLIENT_TX_LIST,
    setRequestedClientTxList,
    clearRequestedClientTxList
} from './ofi-client-tx-list';

export {
    // Actions
    SET_CLIENT_TX_LIST,
    setRequestedClientTxList,
    clearRequestedClientTxList
};

export interface OfiClientTxState {
    ofiClientTxList: OfiClientTxsListState;
}

export const OfiClientTxReducer: Reducer<OfiClientTxState> = combineReducers<OfiClientTxState>({
    ofiClientTxList: OfiClientTxListReducer
});
