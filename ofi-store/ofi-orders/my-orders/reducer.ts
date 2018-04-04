/* Core/Redux imports. */
import {Action} from 'redux';
import * as _ from 'lodash';

/* Local types. */
import {MyOrders, MyOrderDetails} from './model';
import * as ofiMyOrdersActions from './actions';
import {SET_ALL_TABS} from './actions';
import {immutableHelper} from '@setl/utils';
import {List, fromJS, Map} from 'immutable';

/* Initial state. */
const initialState: MyOrders = {
    orderList: {},
    requested: false,
    newOrder: false,
    openedTabs: []
};

/* Reducer. */
export const OfiMyOrderListReducer = function (state: MyOrders = initialState,
                                               action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiMyOrdersActions.OFI_SET_MY_ORDER_LIST:
            // return ofiSetMyOrderList(state, action);
            const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data.Status !== 'Fail') {
                const orderList = formatMyOrderDataResponse(data);
                return Object.assign({}, state, {
                    orderList
                });
            }
            return state;

        case ofiMyOrdersActions.OFI_SET_REQUESTED_MY_ORDER:
            return toggleRequestState(state, true);

        case ofiMyOrdersActions.OFI_CLEAR_REQUESTED_MY_ORDER:
            return toggleRequestState(state, false);

        case SET_ALL_TABS:
            return handleSetAllTabs(action, state);

        /* Default. */
        default:
            return state;
    }
}

function formatMyOrderDataResponse(rawData: Array<any>): Array<MyOrderDetails> {
    const rawDataList = fromJS(rawData);

    let i = 0;

    const manageOrdersList = Map(rawDataList.reduce(
        function (result, item) {
            result[i] = {
                amAddress: item.get('amAddress'),
                amCompanyID: item.get('amCompanyID'),
                amWalletID: item.get('amWalletID'),
                amountWithCost: item.get('amountWithCost'),
                byAmountOrQuantity: item.get('byAmountOrQuantity'),
                canceledBy: item.get('canceledBy'),
                contractAddr: item.get('contractAddr'),
                contractExpiryTs: item.get('contractAddr'),
                contractStartTs: item.get('contractStartTs'),
                currency: item.get('currency'),
                cutoffDate: item.get('cutoffDate'),
                estimatedAmountWithCost: item.get('estimatedAmountWithCost'),
                estimatedPrice: item.get('estimatedPrice'),
                estimatedQuantity: item.get('estimatedQuantity'),
                feePercentage: item.get('feePercentage'),
                fundShareID: item.get('fundShareID'),
                fundShareName: item.get('fundShareName'),
                iban: item.get('iban'),
                investorAddress: item.get('investorAddress'),
                investorWalletID: item.get('investorWalletID'),
                isin: item.get('isin'),
                label: item.get('label'),
                navEntered: item.get('navEntered'),
                orderID: item.get('orderID'),
                orderDate: item.get('orderDate'),
                orderNote: item.get('orderNote'),
                orderStatus: item.get('orderStatus'),
                orderType: item.get('orderType'),
                investorIban: item.get('investorIban'),
                orderFundShareID: item.get('orderFundShareID'),
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
 * Set My Order List
 * ---------------
 * Deals with replacing the local orders list with a new one.
 *
 * @param {state} MyOrders - the current state.
 * @param {action} Action - the action requested.
 *
 * @return {newState} object - the new state.
 */
function ofiSetMyOrderList(state: MyOrders, action: Action) {
    /* Variables. */
    let
        newState: MyOrders,
        newOrderList = _.get(action, 'payload[1].Data', []);

    /* Let's unpack the metaData... */
    newOrderList = newOrderList.map((order) => {
        /* ...json parse it... */
        order.metaData = JSON.parse(order.metaData);

        /* ..return. */
        return order;
    })

    /* Set the new state. */
    newState = Object.assign({}, state, {orderList: newOrderList});

    /* Return. */
    return newState;
}

/**
 *
 * @param {MyOrders} state
 * @param {boolean} requested
 * @return {MyOrders}
 */
function toggleRequestState(state: MyOrders, requested: boolean): MyOrders {
    return Object.assign({}, state, {requested});
}

/**
 * Set all tabs
 *
 * @param {Action} action
 * @param {MyOrders} state
 * @return {MyOrders}
 */
function handleSetAllTabs(action: Action, state: MyOrders): MyOrders {
    const tabs = immutableHelper.get(action, 'tabs', []);

    return Object.assign({}, state, {openedTabs: tabs});
}

