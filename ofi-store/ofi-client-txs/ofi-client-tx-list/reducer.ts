import {OfiClientTxsListState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import {immutableHelper} from '@setl/utils';

import {
    SET_CLIENT_TX_LIST,
    SET_REQUESTED_CLIENT_TX_LIST,
    CLEAR_REQUESTED_CLIENT_TX_LIST
} from './actions';

const initialState: OfiClientTxsListState = {
    allTxList: {},
    requested: false,
    version: 1
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
    const clientTxData = _.get(action, 'payload[1].Data', []);

    const txList = immutableHelper.reduce(clientTxData, (result, item) => {
        const transactionId = item.get('TransactionID', 0);
        result.push({
            transactionId: transactionId,
            transactionRefId: item.get('TransactionRefID', 0),
            transactionParentId: item.get('TransactionParentID', 0),
            transactionHash: item.get('TransactionHash', 0),
            transactionWalletId: item.get('TransactionWalletID', 0),
            transactionAddress: item.get('TransactionAddress', 0),
            transactionBlockNumber: item.get('TransactionBlockNumber', 0),
            transactionInstrument: item.get('TransactionInstrument', 0),
            transactionInstrumentName: item.get('TransactionInstrumentName', 0),
            transactionType: item.get('TransactionType', 0),
            transactionType_Contra: item.get('TransactionType_Contra', 0),
            transactionUnits: item.get('TransactionUnits', 0),
            transactionSignedUnits: item.get('TransactionSignedUnits', 0),
            transactionPrice: item.get('TransactionPrice', 0),
            transactionCosts: item.get('TransactionCost', 0),
            transactionSettlement: item.get('TransactionSettlement', 0),
            transactionSignedSettlement: item.get('TransactionSignedSettlement', 0),
            transactionSettlementCurrencyId: item.get('TransactionSettlementCurrencyID', 0),
            transactionCounterparty: item.get('TransactionCounterParty', 0),
            transactionValueDate: item.get('TransactionValueDate', 0),
            transactionSettlementDate: item.get('TransactionSettlementDate', 0),
            transactionConfirmationDate: item.get('TransactionConfirmationDate', 0),
            transactionIsTransfer: item.get('TransactionTransfer', 0) === 1,
            transactionLeg: item.get('TransactionLeg', 0),
            transactionDate: item.get('TransactionDateEntered', 0),
        });

        return result;
    }, []);

    // Group them by asset
    const allTxList = immutableHelper.reduce(txList, (result, item) => {
        const txAsset = item.get('transactionInstrumentName', '');
        const transactionID = item.get('transactionId', 0);
        if (typeof result[txAsset] === 'undefined') {
            result[txAsset] = {};
        }

        result[txAsset][transactionID] = item.toJS();

        return result;
    }, {});

    return Object.assign({}, state, {
        allTxList
    });
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





