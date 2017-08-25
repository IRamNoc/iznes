import {Action} from 'redux';
import * as ConnectedAction from './actions';
import {ConnectedState} from './model';
import _ from 'lodash';

const initialState: ConnectedState = {
    connectedChain: 0,
    connectedWallet: 0
};

export const ConnectedReducer = function (state: ConnectedState = initialState, action: Action) {
    let newState: any;

    switch (action.type) {
        case ConnectedAction.SET_CONNECTED_WALLET:
            const connectedWallet = _.get(action, 'walletId', 0);

            newState = Object.assign({}, state, {
                connectedWallet
            });

            return newState;

        default:
            return state;
    }
};

