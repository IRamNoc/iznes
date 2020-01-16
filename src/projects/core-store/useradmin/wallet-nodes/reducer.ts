import {
    SET_REQUESTED_WALLET_NODE_LIST,
    SET_WALLET_NODE_LIST,
    CLEAR_REQUESTED_WALLET_NODE_LIST
} from './actions';
import {WalletNodeDetail, WalletNodeState} from './model';
import * as _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: WalletNodeState = {
    walletNodeList: {},
    requestedWalletNodeList: false
};

export const WalletNodeReducer = function (state: WalletNodeState = initialState,
                                           action: Action) {
    switch (action.type) {

        case SET_WALLET_NODE_LIST:
            return handleSetWalletNodeList(state, action);

        case SET_REQUESTED_WALLET_NODE_LIST:
            return handleSetRequestedWalletNodeList(state, action);

        case CLEAR_REQUESTED_WALLET_NODE_LIST:
            return handleClearRequestedWalletNodeList(state, action);

        default:
            return state;
    }
};

function handleSetWalletNodeList(state, action) {
    const walletNodeListData = _.get(action, 'payload[1].Data');
    const walletNodeListDataImu = fromJS(walletNodeListData);

    const walletNodeList = walletNodeListDataImu.reduce(function (resultList, thisWalletNode) {
        resultList[thisWalletNode.get('nodeID')] = {
            walletNodeId: thisWalletNode.get('nodeID'),
            walletNodeName: thisWalletNode.get('nodeName'),
            chainId: thisWalletNode.get('chainID'),
            chainName: thisWalletNode.get('chainName'),
            nodeAddress: thisWalletNode.get('nodeAddress'),
            nodePath: thisWalletNode.get('nodePath'),
            nodePort: thisWalletNode.get('nodePort')
        };
        return resultList;
    }, {});

    const newState = Object.assign({}, state, {
        walletNodeList
    });

    return newState;
}

function handleSetRequestedWalletNodeList(state, action) {

    const requestedWalletNodeList = true;
    const newState = Object.assign({}, state, {
        requestedWalletNodeList
    });

    return newState;
}

function handleClearRequestedWalletNodeList(state, action) {

    const requestedWalletNodeList = false;
    const newState = Object.assign({}, state, {
        requestedWalletNodeList
    });

    return newState;
}
