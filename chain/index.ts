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

export interface ChainState {
    myChainAccess: MyChainAccessState;
}

export const ChainReducer: Reducer<ChainState> = combineReducers<ChainState>({
    myChainAccess: MyChainAccessReducer
});
