/* Core/Redux imports. */
import {Action} from 'redux';
import _ from 'lodash';

/* Local types. */
import {HomeOrders} from './';
import * as ofiHomeOrdersActions from './actions';

/* Initial state. */
const initialState: HomeOrders = {
    orderList: [],
    orderBuffer: -1
};

/* Reducer. */
export const OfiHomeOrderListReducer = function (
    state: HomeOrders = initialState,
    action: Action
) {
    switch (action.type) {
        /* Set Order List. */
        case ofiHomeOrdersActions.OFI_SET_HOME_ORDER_LIST:
            return ofiSetHomeOrderList(state, action);

        /* Set Order View Buffer. */
        case ofiHomeOrdersActions.OFI_SET_HOME_ORDER_BUFFER:
            return ofiSetHomeOrderBuffer(state, action);

        /* Reset Order View Buffer. */
        case ofiHomeOrdersActions.OFI_RESET_HOME_ORDER_BUFFER:
            return ofiResetHomeOrderBuffer(state, action);

        /* Default. */
        default:
            return state;
    }
}

/**
 * Set Home Order List
 * -------------------
 * Deals with replacing the local orders list with a new one.
 *
 * @param {state} HomeOrders - the current state.
 * @param {action} Action - the action requested.
 *
 * @return {newState} object - the new state.
 */
function ofiSetHomeOrderList ( state: HomeOrders, action: Action ) {
    /* Variables. */
    let
    newState,
    newOrderList = _.get(action, 'payload[1].Data', []);

    /* Let's unpack the metaData... */
    newOrderList = newOrderList.map((order) => {
        /* ...json parse it... */
        order.metaData = JSON.parse( order.metaData );

        /* ..return. */
        return order;
    })

    /* Set the new state. */
    newState = Object.assign({}, state, {
        orderList: newOrderList
    });

    /* Return. */
    return newState;
}
/**
 * Ofi Set Home Order Buffer
 * -------------------------
 * @param  {HomeOrders} state  [description]
 * @param  {Action}     action [description]
 * @return {[type]}            [description]
 */
function ofiSetHomeOrderBuffer (state: HomeOrders, action: any) {
    return Object.assign({}, state, {
        orderBuffer: action.payload
    });
}
/**
 * Ofi Reset Home Order Buffer
 * -------------------------
 * @param  {HomeOrders} state  [description]
 * @param  {Action}     action [description]
 * @return {[type]}            [description]
 */
function ofiResetHomeOrderBuffer (state: HomeOrders, action: any) {
    return Object.assign({}, state, {
        orderBuffer: -1
    });
}
