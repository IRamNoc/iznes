import {Action} from 'redux';
import {
    SET_CONNECTED_WALLET,
    SET_CONNECTED_CHAIN,
    SET_MEMBERNODE_SESSION_MANAGER,
    RESET_MEMBERNODE_SESSION_MANAGER
} from './actions';
import {ConnectedState} from './model';
import * as _ from 'lodash';

const initialState: ConnectedState = {
    connectedChain: 0,
    connectedWallet: 0,
    memberNodeSessionManager: {
        remainingSecond: 60,
        startCountDown: false
    }
};

export const ConnectedReducer = function (state: ConnectedState = initialState, action: Action) {
    let newState: any;

    switch (action.type) {
        case SET_CONNECTED_WALLET:
            const connectedWallet = _.get(action, 'walletId', 0);

            newState = Object.assign({}, state, {
                connectedWallet
            });

            return newState;

        case SET_CONNECTED_CHAIN:
            const connectedChain = _.get(action, 'chainId', 0);

            newState = Object.assign({}, state, {
                connectedChain
            });

            return newState;

        case SET_MEMBERNODE_SESSION_MANAGER:
            return handleSetMembernodeSessionManageer(state, action);

        case RESET_MEMBERNODE_SESSION_MANAGER:
            return handleResetMembernodeSessionManageer(state);

        default:
            return state;
    }
};

/**
 *
 * @param {ConnectedState} state
 * @param {} action
 * @return {ConnectedState}
 */
function handleSetMembernodeSessionManageer(state: ConnectedState, action: Action): ConnectedState {
    const doneSecond = _.get(action, 'remainingSecond', 0);
    const remainingSecond = 60 - doneSecond;

    const newState = Object.assign({}, state, {
        memberNodeSessionManager: {
            remainingSecond,
            startCountDown: true
        }
    });

    return newState;
}

/**
 *
 * @param {ConnectedState} state
 * @return {ConnectedState}
 */
function handleResetMembernodeSessionManageer(state: ConnectedState): ConnectedState {
    return Object.assign({}, state, {
        memberNodeSessionManager: {
            remainingSecond: 60,
            startCountDown: false
        }
    });
}
