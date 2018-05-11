import {Action} from 'redux';
import * as _ from 'lodash';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {AllFundShareDetail, IznesShareDetail, OfiFundShareListState} from './model';
import {OrderedMap} from 'immutable';

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
            fundShareName: share.fundShareName,
            fundID: share.fundID,
            isin: share.isin,
            shareClassCode: share.shareClassCode,
            shareClassInvestmentStatus: share.shareClassInvestmentStatus,
            shareClassCurrency: share.shareClassCurrency,
            valuationFrequency: share.valuationFrequency,
            historicOrForwardPricing: share.historicOrForwardPricing,
            hasCoupon: share.hasCoupon,
            couponType: share.couponType,
            freqOfDistributionDeclaration: share.freqOfDistributionDeclaration,
            status: share.status,
            master: share.master,
            feeder: share.feeder,
            maximumNumDecimal: share.maximumNumDecimal,
            subscriptionCategory: share.subscriptionCategory,
            subscriptionCurrency: share.subscriptionCurrency,
            minInitialSubscriptionInShare: convertBlockchainNumber(share.minInitialSubscriptionInShare),
            minInitialSubscriptionInAmount: convertBlockchainNumber(share.minInitialSubscriptionInAmount),
            minSubsequentSubscriptionInShare: convertBlockchainNumber(share.minSubsequentSubscriptionInShare),
            minSubsequentSubscriptionInAmount: convertBlockchainNumber(share.minSubsequentSubscriptionInAmount),
            redemptionCategory: share.redemptionCategory,
            redemptionCurrency: share.redemptionCurrency,
            minInitialRedemptionInShare: convertBlockchainNumber(share.minInitialRedemptionInShare),
            minInitialRedemptionInAmount: convertBlockchainNumber(share.minInitialRedemptionInAmount),
            minSubsequentRedemptionInShare: convertBlockchainNumber(share.minSubsequentRedemptionInShare),
            minSubsequentRedemptionInAmount: convertBlockchainNumber(share.minSubsequentRedemptionInAmount),
            portfolioCurrencyHedge: share.portfolioCurrencyHedge,
            subscriptionCutOffTime: share.subscriptionCutOffTime,
            subscriptionCutOffTimeZone: share.subscriptionCutOffTimeZone,
            subscriptionSettlementPeriod: share.subscriptionSettlementPeriod,
            redemptionCutOffTime: share.redemptionCutOffTime,
            redemptionCutOffTimeZone: share.redemptionCutOffTimeZone,
            redemptionSettlementPeriod: share.redemptionSettlementPeriod,
            subscriptionRedemptionCalendar: share.subscriptionRedemptionCalendar,
            maxManagementFee: convertBlockchainNumber(share.maxManagementFee),
            maxSubscriptionFee: convertBlockchainNumber(share.maxSubscriptionFee),
            maxRedemptionFee: convertBlockchainNumber(share.maxRedemptionFee),
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
            mifiidChargesOngoing: convertBlockchainNumber(share.mifiidChargesOngoing),
            mifiidChargesOneOff: convertBlockchainNumber(share.mifiidChargesOneOff),
            mifiidTransactionCosts: convertBlockchainNumber(share.mifiidTransactionCosts),
            mifiidServicesCosts: convertBlockchainNumber(share.mifiidServicesCosts),
            mifiidIncidentalCosts: convertBlockchainNumber(share.mifiidIncidentalCosts),
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
            navPeriodForRedemption: share.navPeriodForRedemption
        };

        iznShareList = iznShareList.set(share.fundShareID, shareData);
    });

    return Object.assign({}, state, {
        iznShareList: iznShareList.toJS()
    });
}

function convertBlockchainNumber(number: any): number {
    // TODO:    we need a better way of getting the divisible number,
    //          could not think of one at time of writing. pz.
    return parseInt(number) / 100000;
}
