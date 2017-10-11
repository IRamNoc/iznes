/* Core/Redux imports. */
import {Action} from 'redux';
import _ from 'lodash';

/* Local types. */
import {Orders} from './';
import * as ofiCouponActions from './actions';

/* Initial state. */
const initialState: Orders = {
    orderList: []
};

/* Reducer. */
export const OfiOrderListReducer = function (
    state: Orders = initialState,
    action: Action
) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiCouponActions.OFI_SET_ORDER_LIST:
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
 * @param {state} Orders - the current state.
 * @param {action} Action - the action requested.
 *
 * @return {newState} object - the new state.
 */
function ofiSetOrderList ( state: Orders, action: Action ) {
    /* Variables. */
    let
    newState:Orders,
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
