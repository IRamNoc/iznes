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
        console.log(data);

        const holdingHistoryList = formatDataResponse(data);

        return Object.assign({}, state, {
            holdingHistoryList,
        });
    }

    return state;
};

const formatDataResponse = (rawData) => {
    let response = List();

    if (rawData.length > 0) {
        rawData.forEach((iteratee) => {
            const holdingHistoryItem = {
                fundId: iteratee.fundId,
                fundName: iteratee.fundName,
                fundLei: iteratee.fundLei,
                fundCurrency: iteratee.fundCurrency,
                fundAum: iteratee.fundAum,
                fundHolderNumber: iteratee.fundHolderNumber,
                shareId: iteratee.shareId,
                shareName: iteratee.shareName,
                shareIsin: iteratee.shareIsin,
                shareNav: iteratee.shareNav,
                shareUnitNumber: iteratee.shareUnitNumber,
                shareCurrency: iteratee.shareCurrency,
                shareAum: iteratee.shareAum,
                shareHolderNumber: iteratee.shareHolderNumber,
                shareRatio: iteratee.shareRatio,
            };
            response = response.push(holdingHistoryItem);
        });
    }
    return response;
}

function toggleRequestState(state: OfiHoldingHistoryState, requested: boolean): OfiHoldingHistoryState {
    return Object.assign({}, state, {requested});
}
