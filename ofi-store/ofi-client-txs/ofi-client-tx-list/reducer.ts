import {OfiClientTxsListState} from './model';
import {Action} from 'redux';
import _ from 'lodash';
import {fromJS} from 'immutable';

import {
    SET_CLIENT_TX_LIST,
    SET_REQUESTED_CLIENT_TX_LIST,
    CLEAR_REQUESTED_CLIENT_TX_LIST
} from './actions';

const initialState: OfiClientTxsListState = {
    txList: {},
    requested: false
};

/**
 *  Ofi Client tx list reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiClientTxListReducer = function (state: OfiClientTxsListState = initialState, action: Action): OfiClientTxsListState {
    switch (action.type) {
        case SET_CLIENT_TX_LIST:
            return handleSetClientTxList(state, action);

        case SET_REQUESTED_CLIENT_TX_LIST:
            return handleToggleRequested(state, true);

        case CLEAR_REQUESTED_CLIENT_TX_LIST:
            return handleToggleRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiClientTxsListState}
 */
function handleSetClientTxList(state: OfiClientTxsListState, action: Action): OfiClientTxsListState {
    const accessData = _.get(action, 'payload[1].Data', []);
    return state;
}

/**
 * Handle action
 * @param state
 * @param requested
 * @return {OfiClientTxsListState}
 */
function handleToggleRequested(state: OfiClientTxsListState, requested: boolean): OfiClientTxsListState {

    return Object.assign({}, state, {
        requested
    });
}





