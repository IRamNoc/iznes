import {combineReducers, Reducer} from 'redux';

import {
    // Actions.
    setRequestedMyChainAccess,
    clearRequestedMyChainAccess,
    SET_MY_CHAIN_ACCESS,

    // State.
    MyChainAccessState,

    // Reducer.
    MyChainAccessReducer,

    // Selectors.
    getDefaultMyChainAccess

} from './myChainAccess';

export {
    // Actions
    setRequestedMyChainAccess,
    clearRequestedMyChainAccess,
    SET_MY_CHAIN_ACCESS,

    // Selectors
    getDefaultMyChainAccess
};

import {
    // Actions.
    setRequestedChain,
    clearRequestedChain,
    SET_CHAINS_LIST,

    // State.
    ChainListState,

    // Reducer.
    ChainListReducer,

} from './chain-list';

export {
    // Actions
    setRequestedChain,
    clearRequestedChain,
    SET_CHAINS_LIST,
};

export interface ChainState {
    myChainAccess: MyChainAccessState;
    chainList: ChainListState;
}

export const ChainReducer: Reducer<ChainState> = combineReducers<ChainState>({
    myChainAccess: MyChainAccessReducer,
    chainList: ChainListReducer,
});
