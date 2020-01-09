/* Core/Redux imports. */
import {Action} from 'redux';
import * as _ from 'lodash';

/* Local types. */
import {OfiUserAssetsState} from './';
import * as ofiCouponActions from './actions';
import {OFI_SET_REQUESTED_USER_ISSUED_ASSETS, OFI_CLEAR_REQUESTED_USER_ISSUED_ASSETS} from './actions';
import {immutableHelper} from '@setl/utils';

/* Initial state. */
const initialState: OfiUserAssetsState = {
    ofiUserAssetList: [],
    requested: false
};

/* Reducer. */
export const OfiUserAssetsReducer = function (state: OfiUserAssetsState = initialState,
                                              action: Action) {
    switch (action.type) {
        /* Set Asset List. */
        case ofiCouponActions.OFI_SET_USER_ISSUED_ASSETS:
            return ofiSetUserAssetList(state, action);

        case OFI_SET_REQUESTED_USER_ISSUED_ASSETS:
            return toggleRequestedUserIssuedAsset(state, true);

        case OFI_CLEAR_REQUESTED_USER_ISSUED_ASSETS:
            return toggleRequestedUserIssuedAsset(state, false);

        /* Default. */
        default:
            return state;
    }
};

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
function ofiSetUserAssetList(state: OfiUserAssetsState, action: Action) {
    /* Variables. */
    const newAssetList = _.get(action, 'payload[1].Data', []);

    /* Set the new state. */
    const ofiUserAssetList = immutableHelper.reduce(newAssetList, (result, item) => {
        result.push({
            address: item.get('addr', ''),
            asset: item.get('asset', ''),
            companyName: item.get('companyName', ''),
            isin: item.get('isin', ''),
            managementCompanyId: item.get('managementCompanyID', ''),
            status: item.get('status', ''),
            walletId: item.get('walletID', 0)
        });
        return result;
    }, []);

    /* Return. */
    return Object.assign({}, state, {
        ofiUserAssetList
    });
}

/**
 * Toggle requested user issued asset
 *
 * @param state
 * @param requested
 */
function toggleRequestedUserIssuedAsset(state: OfiUserAssetsState, requested: boolean) {
    return Object.assign({}, state, {
        requested
    });
}
