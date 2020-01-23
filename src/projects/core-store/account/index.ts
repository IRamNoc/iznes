import {combineReducers, Reducer} from 'redux';

import {
    AccountListReducer,
    AccountListState,
    SET_ACCOUNT_LIST,
    getMyAccountList,
    clearRequestedAccountList,
    setRequestedAccountList
} from './account-list';


export {
    AccountListState,
    SET_ACCOUNT_LIST,
    getMyAccountList,
    clearRequestedAccountList,
    setRequestedAccountList
};

export interface AccountState {
    accountList: AccountListState;
}

export const AccountReducer: Reducer<AccountState> = combineReducers<AccountState>({
    accountList: AccountListReducer,
});
