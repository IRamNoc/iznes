import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {OfiFundShare, OfiFundShareState, CurrentRequest} from './model';

const initialState: OfiFundShareState = {
    FundShare: {},
    requestedFundShare: false,
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
            return handleSetOfiNavFundsList(state, action);

        case actions.SET_REQUESTED_FUND_SHARE:
            return toggleFundShareRequested(state, true);

        case actions.CLEAR_REQUESTED_FUND_SHARE:
            return toggleFundShareRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set am all fund share list
 *
 * @param state
 * @param action
 * @return {OfiFundShareState}
 */
function handleSetOfiNavFundsList(state: OfiFundShareState, action: Action): OfiFundShareState {
    const fundShareData = _.get(action, 'payload[1].Data', []);
    let fundShare: { [shareId: string]: OfiFundShare } = {};
    try {
        fundShare = immutableHelper.reduce(fundShareData, (result: { [shareId: string]: any }, item) => {
            const shareId = item.get('fundShareID', 0);

            if (shareId === 0) {
                throw new Error('ShareId should not be zero');
            }

            result[shareId] = {
                fundShareID: shareId,
                fundShareName: item.get('fundShareName', ''),
                fundID: item.get('fundID', ''),
                isin: item.get('isin', ''),
                shareClassCode: item.get('shareClassCode', ''),
                shareClassInvestmentStatus: item.get('shareClassInvestmentStatus', ''),
                shareClassCurrency: item.get('shareClassCurrency', ''),
                valuationFrequency: item.get('valuationFrequency', ''),
                historicOrForwardPricing: item.get('historicOrForwardPricing', ''),
                hasCoupon: item.get('hasCoupon', ''),
                couponType: item.get('couponType', ''),
                freqOfDistributionDeclaration: item.get('freqOfDistributionDeclaration', ''),
                maximumNumDecimal: item.get('maximumNumDecimal', ''),
                subscriptionCategory: item.get('subscriptionCategory', ''),
                subscriptionCurrency: item.get('subscriptionCurrency', ''),
                minInitialSubscriptionInShare: item.get('minInitialSubscriptionInShare', ''),
                minInitialSubscriptionInAmount: item.get('minInitialSubscriptionInAmount', ''),
                minSubsequentSubscriptionInShare: item.get('minSubsequentSubscriptionInShare', ''),
                minSubsequentSubscriptionInAmount: item.get('minSubsequentSubscriptionInAmount', ''),
                redemptionCategory: item.get('redemptionCategory', ''),
                redemptionCurrency: item.get('redemptionCurrency', ''),
                minInitialRedemptionInShare: item.get('minInitialRedemptionInShare', ''),
                minInitialRedemptionInAmount: item.get('minInitialRedemptionInAmount', ''),
                minSubsequentRedemptionInShare: item.get('minSubsequentRedemptionInShare', ''),
                minSubsequentRedemptionInAmount: item.get('minSubsequentRedemptionInAmount', ''),
                portfolioCurrencyHedge: item.get('portfolioCurrencyHedge', ''),
                tradeDay: item.get('tradeDay', ''),
                subscriptionCutOffTime: item.get('subscriptionCutOffTime', ''),
                subscriptionCutOffTimeZone: item.get('subscriptionCutOffTimeZone', ''),
                subscriptionSettlementPeriod: item.get('subscriptionSettlementPeriod', ''),
                redemptionCutOffTime: item.get('redemptionCutOffTime', ''),
                redemptionCutOffTimeZone: item.get('redemptionCutOffTimeZone', ''),
                redemptionSettlementPeriod: item.get('redemptionSettlementPeriod', ''),
                subscriptionRedemptionCalendar: item.get('subscriptionRedemptionCalendar', ''),
                maxManagementFee: item.get('maxManagementFee', ''),
                maxSubscriptionFee: item.get('maxSubscriptionFee', ''),
                maxRedemptionFee: item.get('maxRedemptionFee', ''),
                investorProfile: item.get('investorProfile', ''),
                keyFactOptionalData: item.get('keyFactOptionalData', ''),
                characteristicOptionalData: item.get('characteristicOptionalData', ''),
                calendarOptionalData: item.get('calendarOptionalData', ''),
                profileOptionalData: item.get('profileOptionalData', ''),
                priipOptionalData: item.get('priipOptionalData', ''),
                listingOptionalData: item.get('listingOptionalData', ''),
                taxationOptionalData: item.get('taxationOptionalData', ''),
                solvencyIIOptionalData: item.get('solvencyIIOptionalData', ''),
                representationOptionalData: item.get('representationOptionalData', '')
            };

            return result;
        }, {});
    } catch (e) {
        fundShare = {};
    }

    return Object.assign({}, state, {
        fundShare
    });
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