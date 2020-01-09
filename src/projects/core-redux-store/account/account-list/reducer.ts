import {
    SET_ACCOUNT_LIST,
    SET_REQUESTED_ACCOUNT_LIST,
    CLEAR_REQUESTED_ACCOUNT_LIST
} from './actions';
import {AccountDetail, AccountListState} from './model';
import * as _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: AccountListState = {
    accountList: {},
    requestedAccountList: false
};

export const AccountListReducer = function (state: AccountListState = initialState,
                                            action: Action) {
    let newState: AccountListState;
    let accountList: object;

    switch (action.type) {
        case SET_ACCOUNT_LIST:
            const accountListData = _.get(action, 'payload[1].Data', []);
            accountList = formatAccountListData(accountListData);

            newState = Object.assign({}, state, {
                accountList
            });

            return newState;

        case SET_REQUESTED_ACCOUNT_LIST:
            return handleSetRequestedAccountList(action, state);

        case CLEAR_REQUESTED_ACCOUNT_LIST:
            return handleClearRequestedAccountList(action, state);

        default:
            return state;
    }
};

function formatAccountListData(rawAccountListData: Array<any>): {
    [key: number]: AccountDetail
} {
    const rawAccountDataList = fromJS(rawAccountListData);

    const accountDataList = Map(rawAccountDataList.reduce(
        function (result, item) {
            result[item.get('accountID')] = {
                accountId: item.get('accountID'),
                accountName: item.get('accountName'),
                description: item.get('description'),
                parent: item.get('parent'),
                billingWallet: item.get('billingWallet')
            };
            return result;
        }, {}));

    return accountDataList.toJS();
}

function handleSetRequestedAccountList(action, state) {
    let newState: AccountListState;
    const requestedAccountList = true;

    newState = Object.assign({}, state, {
        requestedAccountList
    });

    return newState;
}

function handleClearRequestedAccountList(action, state) {

    let newState: AccountListState;
    const requestedAccountList = false;

    newState = Object.assign({}, state, {
        requestedAccountList
    });

    return newState;
}
