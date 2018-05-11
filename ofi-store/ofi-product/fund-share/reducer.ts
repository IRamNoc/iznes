import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {OfiFundShare, OfiFundShareState, CurrentRequest} from './model';

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
            return handleSetOfiFundShare(state, action);
        
        case actions.UPDATE_FUND_SHARE:
            return handleSetOfiFundShare(state, action);

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
function handleSetOfiFundShare(state: OfiFundShareState, action: Action): OfiFundShareState {
    const fundShareData = _.get(action, 'payload[1].Data', []);
    let fundShare: { [shareId: string]: OfiFundShare } = {};
    try {
        fundShare = immutableHelper.reduce(fundShareData, (result: { [shareId: string]: any }, item) => {
            const shareId = item.get('fundShareID', 0);

            if (shareId === 0) {
                throw new Error('ShareId should not be zero');
            }

            result = {
                fundShareID: shareId,
                fundShareName: item.get('fundShareName', ''),
                fundID: item.get('fundID', ''),
                isin: item.get('isin', ''),
                shareClassCode: item.get('shareClassCode', ''),
                shareClassInvestmentStatus: item.get('shareClassInvestmentStatus', ''),
                subscriptionStartDate: item.get('subscriptionStartDate', ''),
                launchDate: item.get('launchDate', ''),
                shareClassCurrency: item.get('shareClassCurrency', ''),
                valuationFrequency: item.get('valuationFrequency', ''),
                historicOrForwardPricing: item.get('historicOrForwardPricing', ''),
                hasCoupon: item.get('hasCoupon', ''),
                couponType: item.get('couponType', ''),
                freqOfDistributionDeclaration: item.get('freqOfDistributionDeclaration', ''),
                status: item.get('status', ''),
                master: item.get('master', ''),
                feeder: item.get('feeder', ''),
                maximumNumDecimal: item.get('maximumNumDecimal', ''),
                subscriptionCategory: item.get('subscriptionCategory', ''),
                subscriptionCurrency: item.get('subscriptionCurrency', ''),
                minInitialSubscriptionInShare: convertBlockchainNumber(item.get('minInitialSubscriptionInShare', '')),
                minInitialSubscriptionInAmount: convertBlockchainNumber(item.get('minInitialSubscriptionInAmount', '')),
                minSubsequentSubscriptionInShare: convertBlockchainNumber(item.get('minSubsequentSubscriptionInShare', '')),
                minSubsequentSubscriptionInAmount: convertBlockchainNumber(item.get('minSubsequentSubscriptionInAmount', '')),
                redemptionCategory: item.get('redemptionCategory', ''),
                redemptionCurrency: item.get('redemptionCurrency', ''),
                minInitialRedemptionInShare: convertBlockchainNumber(item.get('minInitialRedemptionInShare', '')),
                minInitialRedemptionInAmount: convertBlockchainNumber(item.get('minInitialRedemptionInAmount', '')),
                minSubsequentRedemptionInShare: convertBlockchainNumber(item.get('minSubsequentRedemptionInShare', '')),
                minSubsequentRedemptionInAmount: convertBlockchainNumber(item.get('minSubsequentRedemptionInAmount', '')),
                subscriptionTradeCyclePeriod: item.get('subscriptionTradeCyclePeriod', ''),
                numberOfPossibleSubscriptionsWithinPeriod: item.get('numberOfPossibleSubscriptionsWithinPeriod', ''),
                weeklySubscriptionDealingDays: item.get('weeklySubscriptionDealingDays', ''),
                monthlySubscriptionDealingDays: item.get('monthlySubscriptionDealingDays', ''),
                yearlySubscriptionDealingDays: item.get('yearlySubscriptionDealingDays', ''),
                redemptionTradeCyclePeriod: item.get('redemptionTradeCyclePeriod', ''),
                numberOfPossibleRedemptionsWithinPeriod: item.get('numberOfPossibleRedemptionsWithinPeriod', ''),
                weeklyRedemptionDealingDays: item.get('weeklyRedemptionDealingDays', ''),
                monthlyRedemptionDealingDays: item.get('monthlyRedemptionDealingDays', ''),
                yearlyRedemptionDealingDays: item.get('yearlyRedemptionDealingDays', ''),
                navPeriodForSubscription: item.get('navPeriodForSubscription', ''),
                navPeriodForRedemption: item.get('navPeriodForRedemption', ''),
                portfolioCurrencyHedge: item.get('portfolioCurrencyHedge', ''),
                subscriptionCutOffTime: item.get('subscriptionCutOffTime', ''),
                subscriptionCutOffTimeZone: item.get('subscriptionCutOffTimeZone', ''),
                subscriptionSettlementPeriod: item.get('subscriptionSettlementPeriod', ''),
                redemptionCutOffTime: item.get('redemptionCutOffTime', ''),
                redemptionCutOffTimeZone: item.get('redemptionCutOffTimeZone', ''),
                redemptionSettlementPeriod: item.get('redemptionSettlementPeriod', ''),
                subscriptionRedemptionCalendar: item.get('subscriptionRedemptionCalendar', ''),
                maxManagementFee: convertBlockchainNumber(item.get('maxManagementFee', '')),
                maxSubscriptionFee: convertBlockchainNumber(item.get('maxSubscriptionFee', '')),
                maxRedemptionFee: convertBlockchainNumber(item.get('maxRedemptionFee', '')),
                investorProfile: item.get('investorProfile', ''),
                mifiidChargesOngoing: convertBlockchainNumber(item.get('mifiidChargesOngoing', '')),
                mifiidChargesOneOff: convertBlockchainNumber(item.get('mifiidChargesOneOff', '')),
                mifiidTransactionCosts: convertBlockchainNumber(item.get('mifiidTransactionCosts', '')),
                mifiidServicesCosts: convertBlockchainNumber(item.get('mifiidServicesCosts', '')),
                mifiidIncidentalCosts: convertBlockchainNumber(item.get('mifiidIncidentalCosts', '')),
                keyFactOptionalData: item.get('keyFactOptionalData', ''),
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

function convertBlockchainNumber(number: any): number {
    // TODO:    we need a better way of getting the divisible number,
    //          could not think of one at time of writing. pz.
    return parseInt(number) / 100000;
}