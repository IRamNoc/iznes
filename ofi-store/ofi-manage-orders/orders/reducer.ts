/* Core/Redux imports. */
import {Action} from 'redux';
import _ from 'lodash';

/* Local types. */
import {OfiOrdersState} from './';
import * as ofiCouponActions from './actions';

/* Initial state. */
const initialState: OfiOrdersState = {
    ofiOrderList: []
};

/* Reducer. */
export const OfiOrderListReducer = function (
    state: OfiOrdersState = initialState,
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
 * @param {state} OfiOrdersState - the current state.
 * @param {action} Action - the action requested.
 *
 * @return {newState} object - the new state.
 */
function ofiSetOrderList ( state: OfiOrdersState, action: Action ) {
    /* Variables. */
    let
    newState,
    newOrderList = _.get(action, 'payload[1].Data', []);

    /* Set the new state. */
    newState = {
        ofiOrderList: newOrderList
    };

    /* Return. */
    return newState;
}
