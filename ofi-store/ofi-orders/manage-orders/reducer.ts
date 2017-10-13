/* Core/Redux imports. */
import {Action} from 'redux';
import _ from 'lodash';

/* Local types. */
import {ManageOrders} from './';
import * as ofiCouponActions from './actions';

/* Initial state. */
const initialState: ManageOrders = {
    orderList: []
};

/* Reducer. */
export const OfiManageOrderListReducer = function (
    state: ManageOrders = initialState,
    action: Action
) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiCouponActions.OFI_SET_MANAGE_ORDER_LIST:
            return ofiSetOrderList(state, action);

        /* Default. */
        default:
            return state;
    }
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
function ofiSetOrderList ( state: ManageOrders, action: Action ) {
    /* Variables. */
    let
    newState:ManageOrders,
    newOrderList = _.get(action, 'payload[1].Data', []);

    /* Let's unpack the metaData... */
    newOrderList = newOrderList.map((order) => {
        /* ...json parse it... */
        order.metaData = JSON.parse( order.metaData );

        /* ..return. */
        return order;
    })

    /* Set the new state. */
    newState = {
        orderList: newOrderList
    };

    /* Return. */
    return newState;
}
