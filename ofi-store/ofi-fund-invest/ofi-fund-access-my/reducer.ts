import {OfiFundAccessMyState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';

import {
    SET_FUND_ACCESS_MY,
    SET_REQUESTED_FUND_ACCESS_MY,
    CLEAR_REQUESTED_FUND_ACCESS_MY,
} from './actions';

const initialState: OfiFundAccessMyState = {
    fundAccessList: {},
    fundShareAccessList: {},
    requested: false
};

/**
 *  Ofi investor fund list reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundAccessMyReducer = function (state: OfiFundAccessMyState = initialState, action: Action): OfiFundAccessMyState {
    switch (action.type) {
        case SET_FUND_ACCESS_MY:
            return handleSetFundAccessMy(state, action);

        case SET_REQUESTED_FUND_ACCESS_MY:
            return handleSetRequestedFundAccessMy(state, action);

        case CLEAR_REQUESTED_FUND_ACCESS_MY:
            return handleClearRequestedFundAccessMy(state, action);

        default:
            return state;
    }
};

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiFundAccessMyState}
 */
function handleSetFundAccessMy(state: OfiFundAccessMyState, action: Action): OfiFundAccessMyState {
    const accessData = _.get(action, 'payload[1].Data', []);
    const accessDataImu = fromJS(accessData);
    console.log(accessData);
    const accessDataList = accessDataImu.reduce((result, item) => {
        const fundId = item.get('fundID', 0);
        if (!result.fundAccessList.hasOwnProperty(fundId)) {
            result.fundAccessList[fundId] = {
                fundId,
                fundName: item.get('fundName', ''),
                fundProspectus: item.get('fundProspectus', ''),
                fundReport: item.get('fundReport', ''),
                fundSicavId: item.get('fundSICAVID', 0)
            };
        }

        const shareId = item.get('shareID', 0);
        // let metaData = {};
        // try {
        //     metaData = JSON.parse(atob(item.get('metadata', '')));
        // } catch (e) {
        //     metaData = {};
        // }

        const price = item.get('price', 0);

        // Price should never be 0. if 0, jut ignore this fundshare.
        if (price === 0) {
            return result;
        }

        result.fundShareAccessList[shareId] = {
            shareId,
            fundShareID: item.get('fundShareID', 0),
            fundShareName: item.get('fundShareName', 'N/A'),
            fundID: item.get('fundID', 0),
            isin: item.get('isin', 'N/A'),
            shareClassCode: item.get('shareClassCode', 0),
            shareClassInvestmentStatus: item.get('shareClassInvestmentStatus', 0),
            shareClassCurrency: item.get('shareClassCurrency', 0),
            valuationFrequency: item.get('valuationFrequency', 0),
            historicOrForwardPricing: item.get('historicOrForwardPricing', 0),
            hasCoupon: item.get('hasCoupon', 0),
            couponType: item.get('couponType', 0),
            freqOfDistributionDeclaration: item.get('freqOfDistributionDeclaration', 0),
            maximumNumDecimal: 2 || item.get('maximumNumDecimal', 0),
            subscriptionCategory: item.get('subscriptionCategory', 0),
            subscriptionCurrency: item.get('subscriptionCurrency', 0),
            minInitialSubscriptionInShare: item.get('minInitialSubscriptionInShare', 0),
            minInitialSubscriptionInAmount: item.get('minInitialSubscriptionInAmount', 0),
            minSubsequentSubscriptionInShare: item.get('minSubsequentSubscriptionInShare', 0),
            minSubsequentSubscriptionInAmount: item.get('minSubsequentSubscriptionInAmount', 0),
            redemptionCategory: item.get('redemptionCategory', 0),
            redemptionCurrency: item.get('redemptionCurrency', 0),
            minInitialRedemptionInShare: item.get('minInitialRedemptionInShare', 0),
            minInitialRedemptionInAmount: item.get('minInitialRedemptionInAmount', 0),
            minSubsequentRedemptionInShare: item.get('minSubsequentRedemptionInShare', 0),
            minSubsequentRedemptionInAmount: item.get('minSubsequentRedemptionInAmount', 0),
            portfolioCurrencyHedge: item.get('portfolioCurrencyHedge', 0),
            tradeDay: item.get('tradeDay', 0),
            subscriptionCutOffTime: item.get('subscriptionCutOffTime', 0),
            subscriptionCutOffTimeZone: item.get('subscriptionCutOffTimeZone', 0),
            subscriptionSettlementPeriod: item.get('subscriptionSettlementPeriod', 0),
            redemptionCutOffTime: item.get('redemptionCutOffTime', 0),
            redemptionCutOffTimeZone: item.get('redemptionCutOffTimeZone', 0),
            redemptionSettlementPeriod: item.get('redemptionSettlementPeriod', 0),
            subscriptionRedemptionCalendar: item.get('subscriptionRedemptionCalendar', 0),
            maxManagementFee: item.get('maxManagementFee', 0),
            maxSubscriptionFee: item.get('maxSubscriptionFee', 0),
            maxRedemptionFee: item.get('maxRedemptionFee', 0),
            investorProfile: item.get('investorProfile', 0),
            shareStatus: item.get('shareStatus', 0),
            mifidiiOngoingCharges: item.get('mifidiiOngoingCharges', 'N/A'),
            mifidiiOneOffCharges: item.get('mifidiiOneOffCharges', 'N/A'),
            mifidiiTranInitiatedCosts: item.get('mifidiiTranInitiatedCosts', 'N/A'),
            mifidiiAncillaryServiceCharges: item.get('mifidiiAncillaryServiceCharges', 'N/A'),
            mifidiiIncidentalCosts: item.get('mifidiiIncidentalCosts', 'N/A'),
            keyFactOptionalData: item.get('keyFactOptionalData', {}),
            characteristicOptionalData: item.get('characteristicOptionalData', {}),
            calendarOptionalData: item.get('calendarOptionalData', {}),
            profileOptionalData: item.get('profileOptionalData', {}),
            priipOptionalData: item.get('priipOptionalData', {}),
            listingOptionalData: item.get('listingOptionalData', {}),
            taxationOptionalData: item.get('taxationOptionalData', {}),
            solvencyIIOptionalData: item.get('solvencyIIOptionalData', {}),
            representationOptionalData: item.get('representationOptionalData', {}),
            entryFee: item.get('entryFee', 0),
            exitFee: item.get('exitFee', 0),
            fundName: item.get('fundName', 0),
            price: 2500000 || item.get('price', 0),
            priceDate: item.get('priceDate', 'N/A'),
            companyName: item.get('companyName', 0)
        };

        return result;

    }, {
        fundAccessList: {},
        fundShareAccessList: {}
    });

    const fundAccessList = accessDataList.fundAccessList;
    const fundShareAccessList = accessDataList.fundShareAccessList;

    return Object.assign({}, state, {
        fundAccessList,
        fundShareAccessList
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiFundAccessMyState}
 */
function handleSetRequestedFundAccessMy(state: OfiFundAccessMyState, action: Action): OfiFundAccessMyState {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiFundAccessMyState}
 */
function handleClearRequestedFundAccessMy(state: OfiFundAccessMyState, action: Action): OfiFundAccessMyState {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}





