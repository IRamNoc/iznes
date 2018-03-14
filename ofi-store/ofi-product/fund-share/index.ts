import {combineReducers, Reducer} from 'redux';

import {
    OfiFundShareState,
    OfiFundShareReducer,
    SET_FUND_SHARE,
    SET_REQUESTED_FUND_SHARE,
    CLEAR_REQUESTED_FUND_SHARE,
    OfiFundShare,
    setRequestedFundShare,
    clearRequestedFundShare,
    getOfiFundShareCurrentRequest
 } from './share';

 import {
    OfiFundShareSelectedFund,
    OfiFundShareSelectedFundState,
    SET_FUND_SHARE_SELECTED_FUND,
    SET_REQUESTED_FUND_SHARE_SELECTED_FUND,
    CLEAR_REQUESTED_FUND_SHARE_SELECTED_FUND,
    setRequestedFundShareSelectedFund,
    clearRequestedFundShareSelectedFund,
    getOfiFundShareSelectedFundCurrentRequest,
    OfiFundShareSelectedFundReducer
 } from './selected-fund';

 export {
    // Fund Share
    OfiFundShareReducer,
    OfiFundShareState,
    SET_FUND_SHARE,
    SET_REQUESTED_FUND_SHARE,
    CLEAR_REQUESTED_FUND_SHARE,
    OfiFundShare,
    setRequestedFundShare,
    clearRequestedFundShare,
    getOfiFundShareCurrentRequest,
    // Selected Fund
    OfiFundShareSelectedFundReducer,
    OfiFundShareSelectedFund,
    OfiFundShareSelectedFundState,
    SET_FUND_SHARE_SELECTED_FUND,
    SET_REQUESTED_FUND_SHARE_SELECTED_FUND,
    CLEAR_REQUESTED_FUND_SHARE_SELECTED_FUND,
    setRequestedFundShareSelectedFund,
    clearRequestedFundShareSelectedFund,
    getOfiFundShareSelectedFundCurrentRequest
}

export interface OfiFundShareGroupState {
    ofiShare: OfiFundShareState;
    ofiSelectedFund: OfiFundShareSelectedFundState;
}

export const OfiFundShareGroupReducer: Reducer<OfiFundShareGroupState> = combineReducers<OfiFundShareGroupState>({
    ofiShare: OfiFundShareReducer,
    ofiSelectedFund: OfiFundShareSelectedFundReducer
});