/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import {HoldingHistoryDetails, OfiHoldingHistoryState } from './model';
import * as ofiHoldingHistoryActions from './actions';
import {List, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: OfiHoldingHistoryState = {
    holdingHistoryList: List(),
    requested: false,
    holdingHistoryRequested: false,
};

/* Reducer. */
export const OfiHoldingHistoryListReducer = (state: OfiHoldingHistoryState = initialState, action: Action) => {
    switch (action.type) {
        case ofiHoldingHistoryActions.OFI_SET_HOLDING_HISTORY_LIST:
            return handleGetHoldingHistory(state, action);

        case ofiHoldingHistoryActions.OFI_SET_REQUESTED_HOLDING_HISTORY:
            return toggleRequestState(state, true);

        case ofiHoldingHistoryActions.OFI_CLEAR_REQUESTED_HOLDING_HISTORY:
            return toggleRequestState(state, false);

        default:
            return state;
    }
};

const handleGetHoldingHistory = (state, action) => {
    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    if (data.Status !== 'Fail' && data.Message !== 'No holding history found') {
        const holdingHistoryList = formatDataResponse(data);

        return Object.assign({}, state, {
            holdingHistoryList,
        });
    }

    // handle error message here.
    console.log(data);

    return state;
};

const formatDataResponse = (rawData) => {
    let response = List();

    if (rawData.length > 0) {
        rawData.forEach((item) => {
            const holdingHistoryItem = {
                companyID: item.companyID,
                companyName: item.companyName,
                fundID: item.fundID,
                fundName: item.fundName,
                fundShareID: item.fundShareID,
                fundShareName: item.fundShareName,
                isin: item.isin,
                currency: item.currency,
                buyCentralizationCalendar: item.buyCentralizationCalendar,
                buyNAVCalendar: item.buyNAVCalendar,
                buySettlementCalendar: item.buySettlementCalendar,
                sellCentralizationCalendar: item.sellCentralizationCalendar,
                sellNAVCalendar: item.sellNAVCalendar,
                sellSettlementCalendar: item.sellSettlementCalendar,
                investorWalletID: item.investorWalletID,
                investorWalletName: item.investorWalletName,
                investorCompanyName: item.investorCompanyName,
                subportfolioID: item.subportfolioID,
                subportfolioLabel: item.subportfolioLabel,
                orderType: item.orderType,
                quantity: item.quantity,
                amount: item.amount,
                amountWithCost: item.amountWithCost,
                settlementDate: item.settlementDate,
                valuationDate: item.valuationDate,
                cutoffDate: item.cutoffDate,
                orderDate: item.orderDate,
                valuationPrice: item.valuationPrice,
                latestValuationPrice: item.latestValuationPrice,
                latestValuationDate: item.latestValuationDate,
            };
            response = response.push(holdingHistoryItem);
        });
    }
    return response;
}

function toggleRequestState(state: OfiHoldingHistoryState, requested: boolean): OfiHoldingHistoryState {
    return Object.assign({}, state, {requested});
}
