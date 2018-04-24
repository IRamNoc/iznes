/* Core/Redux imports. */
import {Action} from 'redux';

/* Local types. */
import {ManageOrders, ManageOrderDetails} from './model';
import * as ofiManageOrdersActions from './actions';
import {SET_ALL_TABS} from './actions';
import {immutableHelper} from '@setl/utils';
import {List, fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: ManageOrders = {
    orderList: {},
    requested: false,
    newOrder: false,
    openedTabs: [],
    filters: {},
};

/* Reducer. */
export const OfiManageOrderListReducer = function (state: ManageOrders = initialState, action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiManageOrdersActions.OFI_SET_MANAGE_ORDER_LIST:
            // return ofiSetOrderList(state, action);

            const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data.Status !== 'Fail') {
                const orderList = formatManageOrderDataResponse(data);
                return Object.assign({}, state, {
                    orderList
                });
            }
            return state;

        case ofiManageOrdersActions.OFI_SET_REQUESTED_MANAGE_ORDER:
            return toggleRequestState(state, true);

        case ofiManageOrdersActions.OFI_CLEAR_REQUESTED_MANAGE_ORDER:
            return toggleRequestState(state, false);

        case ofiManageOrdersActions.OFI_SET_NEW_ORDER_MANAGE_ORDER:
            return toggleNewOrderState(state, true);

        case ofiManageOrdersActions.OFI_CLEAR_NEW_ORDER_MANAGE_ORDER:
            return toggleNewOrderState(state, false);

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

    let i = 0;

    const manageOrdersList = Map(rawDataList.reduce(
        function (result, item) {
            result[i] = {
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
            i++;
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
 * @param {state} ManageOrders - the current state.
 * @param {action} Action - the action requested.
 *
 * @return {newState} object - the new state.
 */
function ofiSetOrderList(state: ManageOrders, action: Action) {
    /* Variables. */
    let
        newState: ManageOrders,
        newOrderList = _.get(action, 'payload[1].Data', []);

    /* Let's unpack the metaData... */
    newOrderList = newOrderList.map((order) => {
        /* ...json parse it... */
        order.metaData = JSON.parse(order.metaData);

        /* ..return. */
        return order;
    });

    /* Set the new state. */
    newState = Object.assign({}, state, {orderList: newOrderList});

    /* Return. */
    return newState;
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

function toggleNewOrderState(state: ManageOrders, newOrder: boolean): ManageOrders {
    return Object.assign({}, state, {newOrder});
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
