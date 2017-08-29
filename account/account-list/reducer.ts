import * as AccountListActions from './actions';
import {AccountDetail, AccountListState} from './model';
import _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: AccountListState = {
    accountList: {}
};

export const AccountListReducer = function (state: AccountListState = initialState,
                                            action: Action) {
    let newState: AccountListState;
    let accountList: object;

    switch (action.type) {
        case AccountListActions.SET_ACCOUNT_LIST:
            const accountListData = _.get(action, 'payload[1].Data', []);
            accountList = formatAccountListData(accountListData);

            newState = Object.assign({}, state, {
                accountList
            });

            return newState;

        default:
            return state;
    }
};

function formatAccountListData(rawAccountListData: Array<any>): {
    [key: number]: AccountDetail
} {
    const RawAccountDataList = fromJS(rawAccountListData);

    const accountDataList = Map(RawAccountDataList.reduce(
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
