import {combineReducers, Reducer} from 'redux';

import {
    AccountListReducer,
    AccountListState,
    SET_ACCOUNT_LIST,
    getMyAccountList
} from './account-list';

export {
    AccountListState,
    SET_ACCOUNT_LIST,
    getMyAccountList
};

export interface AccountState {
    accountList: AccountListState;
}

export const AccountReducer: Reducer<AccountState> = combineReducers({
    accountList: AccountListReducer
});
