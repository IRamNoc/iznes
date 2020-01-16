import {createSelector} from 'reselect';
import {AccountState} from '../index';
import {AccountListState} from './index';

const getAccount = (state): AccountState => state.account;

export const getAccountList = createSelector(
    getAccount,
    (state: AccountState) => state.accountList
);

export const getMyAccountList = createSelector(
    getAccountList,
    (state: AccountListState) => state.accountList
);
