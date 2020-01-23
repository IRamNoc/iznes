import { Action } from 'redux';
import * as _ from 'lodash';

import * as actions from './actions';

import { OfiFundShare, OfiFundShareState, CurrentRequest } from './model';

const initialState: OfiFundShareState = {
    fundShare: {},
    requested: false,
    currentRequest: {}
};

/**
 *  Ofi fund share reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundShareReducer = function (state: OfiFundShareState = initialState, action: Action): OfiFundShareState {
    switch (action.type) {
        case actions.SET_FUND_SHARE:
            return handleSetFundShare(state, action);

        case actions.UPDATE_FUND_SHARE:
            return handleSetFundShare(state, action);

        case actions.SET_REQUESTED_FUND_SHARE:
            return toggleFundShareRequested(state, true);

        case actions.CLEAR_REQUESTED_FUND_SHARE:
            return toggleFundShareRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set fund share
 *
 * @param state
 * @param action
 * @return {OfiFundShareState}
 */
function handleSetFundShare(state: OfiFundShareState, action: Action): OfiFundShareState {
    const fundShareData = _.get(action, 'payload[1].Data', []);

    if (!fundShareData.length) {
        return state;
    }

    const shareNewData = {};

    fundShareData.forEach((share) => {
        shareNewData[share.fundShareID] = {
            ...share,
            minInitialSubscriptionInShare: share.minInitialSubscriptionInShare,
            minInitialSubscriptionInAmount: share.minInitialSubscriptionInAmount,
            minSubsequentSubscriptionInShare: share.minSubsequentSubscriptionInShare,
            minSubsequentSubscriptionInAmount: share.minSubsequentSubscriptionInAmount,
            minSubsequentRedemptionInShare: share.minSubsequentRedemptionInShare,
            minSubsequentRedemptionInAmount: share.minSubsequentRedemptionInAmount,
            maxManagementFee: share.maxManagementFee,
            maxSubscriptionFee: share.maxSubscriptionFee,
            maxRedemptionFee: share.maxRedemptionFee,
            mifiidChargesOngoing: share.mifiidChargesOngoing,
            mifiidChargesOneOff: share.mifiidChargesOneOff,
            mifiidTransactionCosts: share.mifiidTransactionCosts,
            mifiidServicesCosts: share.mifiidServicesCosts,
            mifiidIncidentalCosts: share.mifiidIncidentalCosts,
        };
    });

    return {
        ...state,
        fundShare: {
            ...state.fundShare,
            ...shareNewData,
        },
    };
}

/**
 * Toggle requested
 * @param state
 * @return {OfiFundShareState}
 */
function toggleFundShareRequested(state: OfiFundShareState, requestedFundShare): OfiFundShareState {
    return Object.assign({}, state, {
        requestedFundShare
    });
}

/**
 * Handle set requested
 * @param state
 * @param action
 * @return {{}&OfiFundShareState&{currentRequest: CurrentRequest, requested: boolean}}
 */
function handleSetCurrentRequest(state: OfiFundShareState, action: Action): OfiFundShareState {
    const currentRequest: CurrentRequest = _.get(action, 'currentRequest');

    return Object.assign({}, state, {
        currentRequest
    });
}
