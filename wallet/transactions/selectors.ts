import { createSelector } from 'reselect';
import { WalletState } from '../index';
import { Transactions } from './model';

const getWallet = (state): WalletState => state.wallet;

export const getTransactions = createSelector(
    getWallet,
    (state: WalletState) => state.transactions
);

export const getAllTransactions = createSelector(
    getTransactions,
    (state: Transactions) => state.all
);

export const getTransactionsByAsset = createSelector(
    getTransactions,
    (state: Transactions) => state.byAsset
);

