import { AsyncTaskResponseAction } from '@setl/utils/sagaHelper/actions';
import * as TransactionActions from './actions';
import { Transactions, TransactionList } from './model';
import { get } from 'lodash';

const initialCollection = {
    currentPage: 0,
    requestedPage: 0,
    loading: true,
    pages: [],
};
const initialState: Transactions = {
    all: initialCollection,
    byAsset: {},
};

export const TransactionsReducer = (state: Transactions = initialState, action: AsyncTaskResponseAction) => {
    switch (action.type) {

    case TransactionActions.SET_ALL_TRANSACTIONS:
        return setAllTransactions(action, state);

    case TransactionActions.SET_ASSET_TRANSACTIONS:
        return setAssetTransactions(action, state);

    case TransactionActions.INCREMENT_ALL_REQUESTED_PAGE:
        return {
            ...state,
            all: {
                ...state.all,
                requestedPage: state.all.requestedPage + 1,
            },
        };

    case TransactionActions.DECREMENT_ALL_REQUESTED_PAGE:
        return {
            ...state,
            all: {
                ...state.all,
                requestedPage: state.all.requestedPage - 1,
            },
        };

    case TransactionActions.INCREMENT_ASSET_REQUESTED_PAGE:
        return {
            ...state,
            byAsset: {
                ...state.byAsset,
                [action.payload.asset]: {
                    ...state.byAsset[action.payload.asset],
                    requestedPage: state.byAsset[action.payload.asset].requestedPage + 1,
                },
            },
        };

    case TransactionActions.DECREMENT_ASSET_REQUESTED_PAGE:
        return {
            ...state,
            byAsset: {
                ...state.byAsset,
                [action.payload.asset]: {
                    ...state.byAsset[action.payload.asset],
                    requestedPage: state.byAsset[action.payload.asset].requestedPage - 1,
                },
            },
        };

    case TransactionActions.INCREMENT_ALL_CURRENT_PAGE:
        return {
            ...state,
            all: {
                ...state.all,
                currentPage: state.all.currentPage + 1,
            },
        };

    case TransactionActions.DECREMENT_ALL_CURRENT_PAGE:
        return {
            ...state,
            all: {
                ...state.all,
                currentPage: state.all.currentPage - 1,
            },
        };

    case TransactionActions.INCREMENT_ASSET_CURRENT_PAGE:
        return {
            ...state,
            byAsset: {
                ...state.byAsset,
                [action.payload.asset]: {
                    ...state.byAsset[action.payload.asset],
                    currentPage: state.byAsset[action.payload.asset].currentPage + 1,
                },
            },
        };

    case TransactionActions.DECREMENT_ASSET_CURRENT_PAGE:
        return {
            ...state,
            byAsset: {
                ...state.byAsset,
                [action.payload.asset]: {
                    ...state.byAsset[action.payload.asset],
                    currentPage: state.byAsset[action.payload.asset].currentPage - 1,
                },
            },
        };

    case TransactionActions.RESET_ALL_TRANSACTIONS:
        return {
            ...state,
            all: initialCollection,
        };

    case TransactionActions.RESET_ASSET_TRANSACTIONS:
        return {
            ...state,
            byAsset: {
                ...state.byAsset,
                [action.payload.asset]: initialCollection,
            },
        };

    case TransactionActions.SET_ALL_LOADING:
        return {
            ...state,
            all: {
                ...state.all,
                loading: true,
            },
        };

    case TransactionActions.SET_ASSET_LOADING:
        return {
            ...state,
            byAsset: {
                ...state.byAsset,
                [action.payload.asset]: {
                    ...state.byAsset[action.payload.asset],
                    loading: true,
                },
            },
        };

    default:
        return state;
    }

    function setAllTransactions(
        action: AsyncTaskResponseAction,
        state: Transactions,
    ): Transactions {
        // find requested page - Does it already exist?
        const existingPage = get(state.all.pages, state.all.requestedPage, null);
        if (existingPage) {
            console.log('Page already exists!');
            return state;
        }

        const txs = get(action, 'payload.1.Data.tx', []);
        const page = {
            page: state.all.requestedPage,
            transactions: txs.map(mapTransactions),
            before: get(action, 'payload.1.Data.before', {}),
            after: get(action, 'payload.1.Data.after', {}),
            next: get(action, 'payload.1.Data.next', {}),
        };

        return {
            ...state,
            all: {
                ...state.all,
                loading: false,
                currentPage: state.all.requestedPage,
                pages: [
                    ...state.all.pages.slice(0, state.all.requestedPage),
                    page,
                    ...state.all.pages.slice(state.all.requestedPage + 1),
                ],
            },
        };
    }

    function setAssetTransactions(action: AsyncTaskResponseAction, state: Transactions) {
        const txs = get(action, 'payload.1.Data.tx', []);
        const asset = action.payload[1].Data.asset;
        const assetData = { ...get(state.byAsset, asset, initialCollection) };
        const page = {
            page: assetData.requestedPage,
            transactions: txs.map(mapTransactions),
            before: get(action, 'payload.1.Data.before', {}),
            after: get(action, 'payload.1.Data.after', {}),
            next: get(action, 'payload.1.Data.next', {}),
        };

        return {
            ...state,
            byAsset: {
                ...state.byAsset,
                [asset]: {
                    ...assetData,
                    loading: false,
                    currentPage: assetData.requestedPage,
                    pages: [
                        ...assetData.pages.slice(0, assetData.requestedPage),
                        page,
                        ...assetData.pages.slice(assetData.requestedPage + 1),
                    ],
                },
            },
        };
    }
};

const mapTransactions = (tx) => {
    return {
        txType: tx.txtype,
        baseChain: tx.chainid,
        hash: tx.hash,
        height: tx.height,
        nonce: tx.nonce,
        fromAddr: tx.fromaddress,
        toAddr: tx.toaddress,
        fromPub: get(tx, 'frompubkey', get(tx, 'frompublickey')),
        shortHash: tx.hash,
        utc: tx.timestamp * 1000,
        amount: tx.amount,
        issuer: tx.namespace,
        instrument: tx.classid,
        protocol: tx.protocol,
        sig: tx.signature,
    };
};
