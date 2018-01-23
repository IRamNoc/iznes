import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as TransactionActions from './actions';
import {Transactions} from './model';

const initialState: Transactions = {
    all: [],
    byAsset: {}
};

export const TransactionsReducer = (state: Transactions = initialState, action: AsyncTaskResponseAction) => {
    switch (action.type) {

        case TransactionActions.SET_ALL_TRANSACTIONS:
            return setAllTransactions(action, state);

        case TransactionActions.SET_ASSET_TRANSACTIONS:
            return setAssetTransactions(action, state);

        default:
            return state;
    }

    function setAllTransactions(action: AsyncTaskResponseAction, state: Transactions) {
        return { ...state, all: action.payload.items };
    }

    function setAssetTransactions(action: AsyncTaskResponseAction, state: Transactions) {
        const byAsset = { ...state.byAsset };
        byAsset[action.payload.asset] = action.payload.items;
        return { ...state, byAsset };
    }
};
