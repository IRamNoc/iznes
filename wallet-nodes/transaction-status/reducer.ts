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

function addWalletNodeTXStatus(actionType, action, state) {

    const rawData = _.get(action, 'payload[1].data', []);
    const time = moment.unix(rawData.creation).utc().format('YYYY-MM-DD HH:mm:ss');

    return Object.assign({}, state, {
        [rawData.hash]: { success: false, txtype: rawData.txtype, lastUpdated: time },
    });

}

function updateWalletNodeTXStatus(actionType, action, state) {

    const rawData = _.get(action, 'data.Transactions', []);
    const newState = Object.assign({}, state);

    for (const tx of rawData) {
        if (newState[tx[3]] !== undefined) {
            newState[tx[3]].success = true;
            newState[tx[3]].lastUpdated = moment.unix(tx[8]).utc().format('YYYY-MM-DD HH:mm:ss');
        }
    }

    return newState;
}
