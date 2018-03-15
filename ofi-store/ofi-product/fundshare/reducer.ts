import {Action} from 'redux';
import * as _ from 'lodash';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {AllFundShareDetail, IznesShareDetail, OfiFundShareState} from './model';
import {OrderedMap} from 'immutable';

const initialState: OfiFundShareState = {
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
export const OfiFundShareReducer = function (state: OfiFundShareState = initialState, action: Action): OfiFundShareState {
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
 * @return {OfiFundShareState}
 */
function handleSetOfiNavFundsList(state: OfiFundShareState, action: Action): OfiFundShareState {
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
function toggleAmAllFundShareListRequested(state: OfiFundShareState, requestedAmAllFundShareList): OfiFundShareState {

    return Object.assign({}, state, {
        requestedAmAllFundShareList
    });
}

function handleSetIznesShareListRequested(state: OfiFundShareState) {
    return Object.assign({}, state, {
        requestedIznesShare: true
    });
}

function handleClearIznesShareListRequested(state: OfiFundShareState) {
    return Object.assign({}, state, {
        requestedIznesShare: false
    });
}

function handleGetIznesShareList(state: OfiFundShareState, action: Action) {
    const data = _.get(action, 'payload[1].Data', []);
    let iznShareList = OrderedMap();

    data.map((share) => {
        const shareData: IznesShareDetail = {
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
            maximumNumDecimal: share.maximumNumDecimal,
            subscriptioinCategory: share.subscriptioinCategory,
            subscriptionCurrency: share.subscriptionCurrency,
            minInitialSubscriptionInShare: share.minInitialSubscriptionInShare,
            minInitialSubscriptionInAmount: share.minInitialSubscriptionInAmount,
            minSubsequentSubscriptionInShare: share.minSubsequentSubscriptionInShare,
            minSubsequentSubscriptionInAmount: share.minSubsequentSubscriptionInAmount,
            redemptionCategory: share.redemptionCategory,
            redemptionCurrency: share.redemptionCurrency,
            minInitialRedemptionInShare: share.minInitialRedemptionInShare,
            minInitialRedemptionInAmount: share.minInitialRedemptionInAmount,
            minSubsequentRedemptionInShare: share.minSubsequentRedemptionInShare,
            minSubsequentRedemptionInAmount: share.minSubsequentRedemptionInAmount,
            portfolioCurrencyHedge: share.portfolioCurrencyHedge,
            tradeDay: share.tradeDay,
            subscriptionCutOffTime: share.subscriptionCutOffTime,
            subscriptionCutOffTimeZone: share.subscriptionCutOffTimeZone,
            subscriptionSettlementPeriod: share.subscriptionSettlementPeriod,
            redemptionCutOffTime: share.redemptionCutOffTime,
            redemptionCutOffTimeZone: share.redemptionCutOffTimeZone,
            redemptionSettlementPeriod: share.redemptionSettlementPeriod,
            subscriptionRedemptionCalendar: share.subscriptionRedemptionCalendar,
            maxManagementFee: share.maxManagementFee,
            maxSubscriptionFee: share.maxSubscriptionFee,
            maxRedemptionFee: share.maxRedemptionFee,
            investorProfile: share.investorProfile,
            keyFactOptionalData: share.keyFactOptionalData,
            characteristicOptionalData: share.characteristicOptionalData,
            calendarOptionalData: share.calendarOptionalData,
            profileOptionalData: share.profileOptionalData,
            priipOptionalData: share.priipOptionalData,
            listingOptionalData: share.listingOptionalData,
            taxationOptionalData: share.taxationOptionalData,
            solvencyIIOptionalData: share.solvencyIIOptionalData,
            representationOptionalData: share.representationOptionalData,
            fundName: share.fundName,
            umbrellaFundID: share.umbrellaFundID,
        };

        iznShareList = iznShareList.set(share.fundShareID, shareData);
    });

    // TODO: to remove before it goes live
    console.log('handleGetIznesShareList (iznShareList): ', iznShareList);

    return Object.assign({}, state, {
        iznShareList
    });
}
