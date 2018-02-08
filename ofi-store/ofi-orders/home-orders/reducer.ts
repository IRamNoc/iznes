import {Action} from 'redux';
import * as _ from 'lodash';

/* Local types. */
import {HomeOrders} from './';
import * as ofiHomeOrdersActions from './actions';

/* Initial state. */
const initialState: HomeOrders = {
    orderList: [],
    orderBuffer: -1,
    orderFilter: '',
    requested: false
};

/* Reducer. */
export const OfiHomeOrderListReducer = function (state: HomeOrders = initialState,
                                                 action: Action) {
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

        /* Set Order View Filter. */
        case ofiHomeOrdersActions.OFI_SET_HOME_ORDER_FILTER:
            return ofiSetHomeOrderFilter(state, action);

        /* Reset Order View Filter. */
        case ofiHomeOrdersActions.OFI_RESET_HOME_ORDER_FILTER:
            return ofiResetHomeOrderFilter(state, action);

        case ofiHomeOrdersActions.OFI_SET_REQUESTED_HOME_ORDER:
            return toggleRequestState(state, true);

        case ofiHomeOrdersActions.OFI_CLEAR_REQUESTED_HOME_ORDER:
            return toggleRequestState(state, false);


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
 * @param {action} Action    - the action requested.
 *
 * @return {newState} object - the new state.
 */
function ofiSetHomeOrderList(state: HomeOrders, action: Action) {
    /* Variables. */
    let
        newState,
        newOrderList = _.get(action, 'payload[1].Data', []);

    /* Let's unpack the metaData... */
    newOrderList = newOrderList.map((order) => {
        /* ...json parse it... */
        order.metaData = JSON.parse(order.metaData);

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
 * @param  {HomeOrders} state  - the current state.
 * @param  {Action}     action - the action to be made on the state.
 * @return {HomeOrders}        - the new state
 */
function ofiSetHomeOrderBuffer(state: HomeOrders, action: any): HomeOrders {
    return Object.assign({}, state, {
        orderBuffer: action.payload
    });
}

/**
 * Ofi Reset Home Order Buffer
 * -------------------------
 * @param  {HomeOrders} state  - the current state.
 * @param  {Action}     action - the action to be made on the state.
 * @return {HomeOrders}        - the new state
 */
function ofiResetHomeOrderBuffer(state: HomeOrders, action: any): HomeOrders {
    return Object.assign({}, state, {
        orderBuffer: -1
    });
}

/**
 * Ofi Set Home Order Filter
 * -------------------------
 * @param  {HomeOrders} state  - the current state.
 * @param  {Action}     action - the action to be made on the state.
 * @return {HomeOrders}        - the new state
 */
function ofiSetHomeOrderFilter(state: HomeOrders, action: any): HomeOrders {
    return Object.assign({}, state, {
        orderFilter: action.payload
    });
}

/**
 * Ofi Reset Home Order Filter
 * -------------------------
 * @param  {HomeOrders} state  - the current state.
 * @param  {Action}     action - the action to be made on the state.
 * @return {HomeOrders}        - the new state
 */
function ofiResetHomeOrderFilter(state: HomeOrders, action: any): HomeOrders {
    return Object.assign({}, state, {
        orderFilter: ''
    });
}

/**
 *
 * @param {HomeOrders} state
 * @param {boolean} requested
 * @return {HomeOrders}
 */
function toggleRequestState(state: HomeOrders, requested: boolean): HomeOrders {
    return Object.assign({}, state, {requested});
}
