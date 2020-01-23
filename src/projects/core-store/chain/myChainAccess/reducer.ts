import {
    SET_MY_CHAIN_ACCESS,
    SET_REQUESTED_MY_CHAIN_ACCESS,
    CLEAR_REQUESTED_MY_CHAIN_ACCESS
} from './actions';

import {MyChainAccessState} from './model';
import * as _ from 'lodash';
import {Action} from 'redux';
import {fromJS} from 'immutable';

const initialState: MyChainAccessState = {
    myChainAccess: {},
    requested: false
};

export const MyChainAccessReducer = function (state: MyChainAccessState = initialState, action: Action) {

    switch (action.type) {
        case SET_MY_CHAIN_ACCESS:
            return handleSetMyChainAccess(state, action);

        case SET_REQUESTED_MY_CHAIN_ACCESS:
            return handleSetRequestedMyChainAccess(state, action);

        case CLEAR_REQUESTED_MY_CHAIN_ACCESS:
            return handleClearRequestedMyChainAccess(state, action);

        default:
            return state;
    }
};

function handleSetMyChainAccess(state, action) {
    const chainAccessList = _.get(action, 'payload[1].Data');
    const chainAccessListImu = fromJS(chainAccessList);
    const myChainAccess = chainAccessListImu.reduce((result, item) => {

        result[item.get('chainID')] = {
            chainId: item.get('chainID'),
            chainName: item.get('chainName'),
            nodeAddress: item.get('nodeAddress'),
            nodeId: item.get('nodeID'),
            nodeName: item.get('nodeName'),
            nodePath: item.get('nodePath'),
            nodePort: item.get('nodePort'),
            userId: item.get('userID')
        };
        return result;
    }, {});

    return Object.assign({}, state, {
        myChainAccess
    });
}

function handleSetRequestedMyChainAccess(state, action) {
    const requested = true;
    return Object.assign({}, state, {
        requested
    });
}

function handleClearRequestedMyChainAccess(state, action) {
    const requested = false;
    return Object.assign({}, state, {
        requested
    });
}

