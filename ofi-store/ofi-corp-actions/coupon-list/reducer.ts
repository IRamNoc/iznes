/* Core/Redux imports. */
import {Action} from 'redux';
import _ from 'lodash';

/* Local types. */
import {OfiCorpActionsState} from '../';
import * as ofiCouponActions from './actions';

/* Initial state. */
const initialState: OfiCorpActionsState = {
    ofiCouponList: []
};

/* Reducer. */
export const OfiCouponListReducer = function (
    state: OfiCorpActionsState = initialState,
    action: Action
) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiCouponActions.OFI_SET_COUPON_LIST:
            return ofiSetCouponList(state, action);

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
function ofiSetCouponList ( state: OfiCorpActionsState, action: Action ) {
    /* Variables. */
    let
    newState,
    newCouponList = _.get(action, 'payload[1].Data', []);

    console.log(' |--- Ofi Set Coupon List');
    console.log(' | new list: ', newCouponList);
    console.log(' | old state: ', state);

    /* Set the new state. */
    newState = [ ...state.ofiCouponList, ...newCouponList ];

    console.log(' | new state: ', newState);

    /* Return. */
    return newState;
}
