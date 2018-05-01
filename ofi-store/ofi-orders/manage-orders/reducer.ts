/* Core/Redux imports. */
import {Action} from 'redux';

/* Local types. */
import {ManageOrders, ManageOrderDetails} from './model';
import * as ofiManageOrdersActions from './actions';
import {SET_ALL_TABS} from './actions';
import {immutableHelper} from '@setl/utils';
import {fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: ManageOrders = {
    orderList: {},
    requested: false,
    openedTabs: [],
    filters: {},
};

/* Reducer. */
export const OfiManageOrderListReducer = function (state: ManageOrders = initialState, action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiManageOrdersActions.OFI_SET_MANAGE_ORDER_LIST:
            return ofiSetOrderList(state, action);

        case ofiManageOrdersActions.OFI_SET_REQUESTED_MANAGE_ORDER:
            return toggleRequestState(state, true);

        case ofiManageOrdersActions.OFI_CLEAR_REQUESTED_MANAGE_ORDER:
            return toggleRequestState(state, false);

        case ofiManageOrdersActions.SET_ALL_TABS:
            return handleSetAllTabs(action, state);

        case ofiManageOrdersActions.OFI_SET_ORDERS_FILTERS:
            const filters = _.get(action, 'filters', []);    // use [] not {} for list and Data not Data[0]
            return Object.assign({}, state, filters);

        /* Default. */
        default:
            return state;
    }
};

function formatManageOrderDataResponse(rawData: Array<any>): Array<ManageOrderDetails> {
    const rawDataList = fromJS(rawData);

    const manageOrdersList = Map(rawDataList.reduce(
        function (result, item, idx) {
            result[idx] = {
                amAddress: item.get('amAddress'),
                amCompanyID: item.get('amCompanyID'),
                amCompanyName: item.get('amCompanyName'),
                amWalletID: item.get('amWalletID'),
                amount: item.get('amount'),
                amountWithCost: item.get('amountWithCost'),
                byAmountOrQuantity: item.get('byAmountOrQuantity'),
                canceledBy: item.get('canceledBy'),
                contractAddr: item.get('contractAddr'),
                contractExpiryTs: item.get('contractAddr'),
                contractStartTs: item.get('contractStartTs'),
                currency: item.get('currency'),
                cutoffDate: item.get('cutoffDate'),
                estimatedAmount: item.get('estimatedAmountWithCost'),
                estimatedAmountWithCost: item.get('estimatedAmountWithCost'),
                estimatedPrice: item.get('estimatedPrice'),
                estimatedQuantity: item.get('estimatedQuantity'),
                feePercentage: item.get('feePercentage'),
                firstName: item.get('firstName'),
                fundShareID: item.get('fundShareID'),
                fundShareName: item.get('fundShareName'),
                iban: item.get('iban'),
                investorAddress: item.get('investorAddress'),
                investorWalletID: item.get('investorWalletID'),
                investorCompanyName: item.get('investorCompanyName'),
                isin: item.get('isin'),
                label: item.get('label'),
                lastName: item.get('lastName'),
                navEntered: item.get('navEntered'),
                orderID: item.get('orderID'),
                orderDate: item.get('orderDate'),
                orderNote: item.get('orderNote'),
                orderStatus: item.get('orderStatus'),
                orderType: item.get('orderType'),
                platFormFee: item.get('platFormFee'),
                price: item.get('price'),
                quantity: item.get('quantity'),
                settlementDate: item.get('settlementDate'),
                totalResult: item.get('totalResult'),
                valuationDate: item.get('valuationDate'),
            };
            return result;
        },
        {}));

    return manageOrdersList.toJS();
}

/**
 * Set Order List
 * ---------------
 * Deals with replacing the local orders list with a new one.
 *
 * @param {ManageOrders} state
 * @param {Action} action
 * @return {any}
 */
function ofiSetOrderList(state: ManageOrders, action: Action) {

    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    const orderList = formatManageOrderDataResponse(data);
    return Object.assign({}, state, {
        orderList
    });
}

/**
 *
 * @param {ManageOrders} state
 * @param {boolean} requested
 * @return {ManageOrders}
 */
function toggleRequestState(state: ManageOrders, requested: boolean): ManageOrders {
    return Object.assign({}, state, {requested});
}

/**
 * Set all tabs
 *
 * @param {Action} action
 * @param {ManageOrders} state
 * @return {ManageOrders}
 */
function handleSetAllTabs(action: Action, state: ManageOrders): ManageOrders {
    const tabs = immutableHelper.get(action, 'tabs', []);

    return Object.assign({}, state, {openedTabs: tabs});
}
