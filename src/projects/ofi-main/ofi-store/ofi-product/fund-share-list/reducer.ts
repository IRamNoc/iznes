import { Action } from 'redux';
import * as _ from 'lodash';
import { immutableHelper } from '@setl/utils';

import * as actions from './actions';

import { AllFundShareDetail, IznesShareDetail, OfiFundShareListState } from './model';
import { OrderedMap } from 'immutable';

const initialState: OfiFundShareListState = {
    amAllFundShareList: {},
    requestedAmAllFundShareList: false,
    iznShareList: {},
    requestedIznesShare: false
};

/**
 *  Ofi fund share reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundShareListReducer = function (state: OfiFundShareListState = initialState, action: Action): OfiFundShareListState {
    switch (action.type) {
    case actions.SET_AM_ALL_FUND_SHARE_LIST:
        return handleSetOfiNavFundsList(state, action);

    case actions.SET_REQUESTED_AM_All_FUND_SHARE:
        return toggleAmAllFundShareListRequested(state, true);

    case actions.CLEAR_REQUESTED_AM_All_FUND_SHARE:
        return toggleAmAllFundShareListRequested(state, false);

    case actions.SET_REQUESTED_IZN_SHARES:
        return handleSetIznesShareListRequested(state);

    case actions.CLEAR_REQUESTED_IZN_SHARES:
        return handleClearIznesShareListRequested(state);

    case actions.GET_IZN_SHARES_LIST:
        return handleGetIznesShareList(state, action);

    default:
        return state;
    }
};

/**
 * Handle set am all fund share list
 *
 * @param state
 * @param action
 * @return {OfiFundShareListState}
 */
function handleSetOfiNavFundsList(state: OfiFundShareListState, action: Action): OfiFundShareListState {
    const fundShareListData = _.get(action, 'payload[1].Data', []);
    let amAllFundShareList: { [shareId: string]: AllFundShareDetail } = {};
    try {
        amAllFundShareList = immutableHelper.reduce(fundShareListData, (result: { [shareId: string]: AllFundShareDetail }, item) => {

            const shareId = item.get('shareID', 0);

            if (shareId === 0) {
                throw new Error('ShareId should not be zero');
            }

            result[shareId] = {
                shareId: item.get('shareID', 0),
                shareName: item.get('shareName', ''),
                fundId: item.get('fundID', 0),
                fundName: item.get('fundName', 'fund name here'),
                fundShareIsin: item.get('fundShareIsin', 'isin here'),
                fundShareStatus: item.get('fundStatus', 0),
            };

            return result;
        }, {});
    } catch (e) {
        amAllFundShareList = {};
    }

    return Object.assign({}, state, {
        amAllFundShareList
    });
}

/**
 * Toggle requested
 * @param state
 * @return {OfiFundShareState}
 */
function toggleAmAllFundShareListRequested(state: OfiFundShareListState, requestedAmAllFundShareList): OfiFundShareListState {

    return Object.assign({}, state, {
        requestedAmAllFundShareList
    });
}

function handleSetIznesShareListRequested(state: OfiFundShareListState) {
    return Object.assign({}, state, {
        requestedIznesShare: true
    });
}

function handleClearIznesShareListRequested(state: OfiFundShareListState) {
    return Object.assign({}, state, {
        requestedIznesShare: false
    });
}

function handleGetIznesShareList(state: OfiFundShareListState, action: Action) {
    const data = _.get(action, 'payload[1].Data', []);
    let iznShareList = OrderedMap();

    data.map((share) => {
        const shareData: IznesShareDetail = {
            fundShareID: share.fundShareID,
            draft: share.draft,
            draftUser: share.draftUser,
            draftDate: share.draftDate,
            fundShareName: share.fundShareName,
            fundID: share.fundID,
            isin: share.isin,
            shareClassCode: share.shareClassCode,
            shareClassInvestmentStatus: share.shareClassInvestmentStatus,
            shareClassCurrency: share.shareClassCurrency,
            iban: share.iban,
            mainIban: share.mainIban,
            valuationFrequency: share.valuationFrequency,
            historicOrForwardPricing: share.historicOrForwardPricing,
            hasCoupon: share.hasCoupon,
            couponType: share.couponType,
            freqOfDistributionDeclaration: share.freqOfDistributionDeclaration,
            status: share.status,
            master: share.master,
            feeder: share.feeder,
            allowSellBuy: share.allowSellBuy,
            sellBuyCalendar: share.sellBuyCalendar,
            maximumNumDecimal: share.maximumNumDecimal,
            subscriptionCategory: share.subscriptionCategory,
            subscriptionQuantityRoundingRule: share.subscriptionQuantityRoundingRule,
            subscriptionCurrency: share.subscriptionCurrency,
            minInitialSubscriptionInShare: share.minInitialSubscriptionInShare,
            minInitialSubscriptionInAmount: share.minInitialSubscriptionInAmount,
            minSubsequentSubscriptionInShare: share.minSubsequentSubscriptionInShare,
            minSubsequentSubscriptionInAmount: share.minSubsequentSubscriptionInAmount,
            redemptionCategory: share.redemptionCategory,
            redemptionQuantityRoundingRule: share.redemptionQuantityRoundingRule,
            redemptionCurrency: share.redemptionCurrency,
            minSubsequentRedemptionInShare: share.minSubsequentRedemptionInShare,
            minSubsequentRedemptionInAmount: share.minSubsequentRedemptionInAmount,
            portfolioCurrencyHedge: share.portfolioCurrencyHedge,
            subscriptionCutOffTime: share.subscriptionCutOffTime,
            subscriptionCutOffTimeZone: share.subscriptionCutOffTimeZone,
            subscriptionSettlementPeriod: share.subscriptionSettlementPeriod,
            subscriptionSettlementPivotDate: share.subscriptionSettlementPivotDate,
            subscriptionPaymentInstructionTrigger: share.subscriptionPaymentInstructionTrigger,
            subscriptionValuationReference: share.subscriptionValuationReference,
            redemptionCutOffTime: share.redemptionCutOffTime,
            redemptionCutOffTimeZone: share.redemptionCutOffTimeZone,
            redemptionSettlementPeriod: share.redemptionSettlementPeriod,
            redemptionSettlementPivotDate: share.redemptionSettlementPivotDate,
            redemptionValuationReference: share.redemptionValuationReference,
            subscriptionRedemptionCalendar: share.subscriptionRedemptionCalendar,
            maxManagementFee: share.maxManagementFee,
            maxSubscriptionFee: share.maxSubscriptionFee,
            maxRedemptionFee: share.maxRedemptionFee,
            subscriptionFeeInFavourOfFund: share.subscriptionFeeInFavourOfFund,
            subscriptionFeeInFavourOfFundCalculation: share.subscriptionFeeInFavourOfFundCalculation,
            redemptionFeeInFavourOfFund: share.redemptionFeeInFavourOfFund,
            redemptionFeeInFavourOfFundCalculation: share.redemptionFeeInFavourOfFundCalculation,
            investorProfile: share.investorProfile,
            keyFactOptionalData: share.keyFactOptionalData,
            profileOptionalData: share.profileOptionalData,
            priipOptionalData: share.priipOptionalData,
            listingOptionalData: share.listingOptionalData,
            taxationOptionalData: share.taxationOptionalData,
            solvencyIIOptionalData: share.solvencyIIOptionalData,
            representationOptionalData: share.representationOptionalData,
            fundName: share.fundName,
            umbrellaFundID: share.umbrellaFundID,
            managementCompanyName: share.managementCompanyName,
            managementCompanyId: share.managementCompanyID,
            subscriptionStartDate: share.subscriptionStartDate,
            launchDate: share.launchDate,
            fundShareStatus: share.fundShareStatus,
            mifiidChargesOngoing: share.mifiidChargesOngoing,
            mifiidChargesOneOff: share.mifiidChargesOneOff,
            mifiidTransactionCosts: share.mifiidTransactionCosts,
            mifiidServicesCosts: share.mifiidServicesCosts,
            mifiidIncidentalCosts: share.mifiidIncidentalCosts,
            subscriptionTradeCyclePeriod: share.subscriptionTradeCyclePeriod,
            numberOfPossibleSubscriptionsWithinPeriod: share.numberOfPossibleSubscriptionsWithinPeriod,
            weeklySubscriptionDealingDays: share.weeklySubscriptionDealingDays,
            monthlySubscriptionDealingDays: share.monthlySubscriptionDealingDays,
            yearlySubscriptionDealingDays: share.yearlySubscriptionDealingDays,
            redemptionTradeCyclePeriod: share.redemptionTradeCyclePeriod,
            numberOfPossibleRedemptionsWithinPeriod: share.numberOfPossibleRedemptionsWithinPeriod,
            weeklyRedemptionDealingDays: share.weeklyRedemptionDealingDays,
            monthlyRedemptionDealingDays: share.monthlyRedemptionDealingDays,
            yearlyRedemptionDealingDays: share.yearlyRedemptionDealingDays,
            navPeriodForSubscription: share.navPeriodForSubscription,
            navPeriodForRedemption: share.navPeriodForRedemption,
            classification: share.classification,
        };

        iznShareList = iznShareList.set(share.fundShareID, shareData);
    });

    return Object.assign({}, state, {
        iznShareList: iznShareList.toJS()
    });
}
