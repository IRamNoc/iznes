/* Core/Redux imports. */
import {Action} from 'redux';
import * as _ from 'lodash';

/* Local types. */
import {OfiCouponState} from './';
import * as ofiCouponActions from './actions';
import {SET_ALL_TABS} from './actions';
import {immutableHelper} from '@setl/utils';

/* Initial state. */
const initialState: OfiCouponState = {
    ofiCouponList: [],
    openedTabs: []
};

/* Reducer. */
export const OfiCouponListReducer = function (
    state: OfiCouponState = initialState,
    action: Action
) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiCouponActions.OFI_SET_COUPON_LIST:
            return ofiSetCouponList(state, action);

        case SET_ALL_TABS:
            return handleSetAllTabs(action, state);

        /* Default. */
        default:
            return state;
    }
}

/**
 * Set Coupon List
 * ---------------
 * Deals with setting a new ofi coupon list.
 *
 * @param {state} OfiCouponListState - the current state.
 * @param {action} Action - the action requested.
 *
 * @return {newState} object - the new state.
 */
function ofiSetCouponList ( state: OfiCouponState, action: Action ) {
    /* Variables. */
    let
    newState,
    newCouponList = _.get(action, 'payload[1].Data', []);

    /* Set the new state. */
    newState = {
        ofiCouponList: newCouponList
};

    /* Return. */
    return newState;
}

/**
 * Set all tabs
 *
 * @param {Action} action
 * @param {OfiCouponState} state
 * @return {OfiCouponState}
 */
function handleSetAllTabs(action: Action, state: OfiCouponState): OfiCouponState {
    const tabs = immutableHelper.get(action, 'tabs', []);

    return Object.assign({}, state, {openedTabs: tabs});
}
