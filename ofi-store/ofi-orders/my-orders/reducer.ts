/* Core/Redux imports. */
import {Action} from 'redux';
import _ from 'lodash';

/* Local types. */
import {MyOrders} from './';
import * as ofiMyOrdersActions from './actions';

/* Initial state. */
const initialState: MyOrders = {
    orderList: [],
    requested: false
};

/* Reducer. */
export const OfiMyOrderListReducer = function (state: MyOrders = initialState,
                                               action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiMyOrdersActions.OFI_SET_MY_ORDER_LIST:
            return ofiSetMyOrderList(state, action);

        case ofiMyOrdersActions.OFI_SET_REQUESTED_MY_ORDER:
            return toggleRequestState(state, true);

        case ofiMyOrdersActions.OFI_CLEAR_REQUESTED_MY_ORDER:
            return toggleRequestState(state, false);

        /* Default. */
        default:
            return state;
    }
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
