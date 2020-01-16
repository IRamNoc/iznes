import {
    SET_CHAIN_LIST,
    SET_REQUESTED_CHAIN_LIST,
    CLEAR_REQUESTED_CHAIN_LIST
} from './actions';
import {ChainDetail, ChainsState} from './model';
import * as _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: ChainsState = {
    chainList: {},
    requestedChainList: false
};

export const ChainReducer = function (state: ChainsState = initialState,
                                      action: Action) {
    switch (action.type) {

        case SET_CHAIN_LIST:
            return handleSetChainList(state, action);

        case SET_REQUESTED_CHAIN_LIST:
            return handleSetRequestedChainList(state, action);

        case CLEAR_REQUESTED_CHAIN_LIST:
            return handleClearRequestedChainList(state, action);

        default:
            return state;
    }
};

function handleSetChainList(state: ChainsState, action: any) {
    const chainListData = _.get(action, 'payload[1].Data');
    const chainListDataImu = fromJS(chainListData);

    const chainList = chainListDataImu.reduce(function (resultList, thisChain) {
        resultList[thisChain.get('chainID')] = {
            chainId: thisChain.get('chainID'),
            chainName: thisChain.get('chainName')
        };
        return resultList;
    }, {});

    const newState = Object.assign({}, state, {
        chainList
    });

    return newState;
}

function handleSetRequestedChainList(state: ChainsState, action: any) {

    const requestedChainList = true;
    const newState = Object.assign({}, state, {
        requestedChainList
    });

    return newState;
}

function handleClearRequestedChainList(state: ChainsState, action: any) {

    const requestedChainList = false;
    const newState = Object.assign({}, state, {
        requestedChainList
    });

    return newState;
}

