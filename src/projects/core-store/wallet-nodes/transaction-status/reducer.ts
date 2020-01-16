import { Action } from 'redux';
import { ADD_WALLETNODE_TX_STATUS, UPDATE_WALLETNODE_TX_STATUS } from './actions';
import { WalletNodeTransactionStatusState } from './model';
import * as _ from 'lodash';
import * as moment from 'moment';

const initialState: WalletNodeTransactionStatusState = {};

export const walletNodeTransactionStatusReducer = function (state: WalletNodeTransactionStatusState = initialState,
                                                            action: Action) {

    switch (action.type) {
    case ADD_WALLETNODE_TX_STATUS:
        return addWalletNodeTXStatus(ADD_WALLETNODE_TX_STATUS, action, state);
    case UPDATE_WALLETNODE_TX_STATUS:
        return updateWalletNodeTXStatus(UPDATE_WALLETNODE_TX_STATUS, action, state);
    default:
        return state;
    }
};

/**
 * addWalletNodeTXStatus
 * ---------------------
 * Save a walletnode TX request to Redux, along with formatted time and request payload
 * @param actionType
 * @param action
 * @param state
 */
function addWalletNodeTXStatus(actionType, action, state) {
    const rawData = _.get(action, 'payload[1].data', []);
    const time = moment.unix(rawData.creation).utc().format('YYYY-MM-DD HH:mm:ss');

    return Object.assign({}, state, {
        [rawData.hash]: { success: false, fail: false, request: rawData, dateRequested: time },
    });

}

/**
 * updateWalletNodeTXStatus
 * ------------------------
 * Save a walletnode TX response after a broadcast. Update where a matching hash exists or add to Redux if it is new.
 * @param actionType
 * @param action
 * @param state
 */
function updateWalletNodeTXStatus(actionType, action, state) {
    const rawData = _.get(action, 'data.transactions', []);
    const newState = Object.assign({}, state);

    for (const tx of rawData) {
        if (!_.isEmpty(newState[tx.hash])) {
            newState[tx.hash].success = tx.updated;
            newState[tx.hash].fail = !tx.updated;
        } else {
            const time = moment.unix(tx.timestamp).utc().format('YYYY-MM-DD HH:mm:ss');
            newState[tx.hash] = {
                success: tx.updated,
                fail: !tx.updated,
                request: tx,
                dateRequested: time,
            };
        }
    }

    return newState;
}
