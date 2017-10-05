/* Core/Redux imports. */
import {Action} from 'redux';
import _ from 'lodash';

/* Local types. */
import {OfiUserAssetsState} from './';
import * as ofiCouponActions from './actions';

/* Initial state. */
const initialState: OfiUserAssetsState = {
    ofiUserAssetList: []
};

/* Reducer. */
export const OfiUserAssetsReducer = function (
    state: OfiUserAssetsState = initialState,
    action: Action
) {
    switch (action.type) {
        /* Set Asset List. */
        case ofiCouponActions.OFI_SET_USER_ISSUED_ASSETS:
            return ofiSetUserAssetList(state, action);

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
 * @param {state} OfiUserAssetsState - the current state.
 * @param {action} Action - the action requested.
 *
 * @return {newState} object - the new state.
 */
function ofiSetUserAssetList ( state: OfiUserAssetsState, action: Action ) {
    /* Variables. */
    let
    newState,
    newAssetList = _.get(action, 'payload[1].Data', []);

    /* Set the new state. */
    newState = {
        ofiUserAssetList: [ ...state.ofiUserAssetList, ...newAssetList ]
    };

    /* Return. */
    return newState;
}
