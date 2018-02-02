/* Core/Redux imports. */
import {Action} from 'redux';
import _ from 'lodash';

/* Local types. */
import {ManageOrders} from './';
import * as ofiManageOrdersActions from './actions';
import {SET_ALL_TABS} from './actions';
import {immutableHelper} from '@setl/utils';

/* Initial state. */
const initialState: ManageOrders = {
    orderList: [],
    requested: false,
    openedTabs: []
};

/* Reducer. */
export const OfiManageOrderListReducer = function (state: ManageOrders = initialState,
                                                   action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiManageOrdersActions.OFI_SET_MANAGE_ORDER_LIST:
            return ofiSetOrderList(state, action);

        case ofiManageOrdersActions.OFI_SET_REQUESTED_MANAGE_ORDER:
            return toggleRequestState(state, true);

        case ofiManageOrdersActions.OFI_CLEAR_REQUESTED_MANAGE_ORDER:
            return toggleRequestState(state, false);

        case SET_ALL_TABS:
            return handleSetAllTabs(action, state);

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
