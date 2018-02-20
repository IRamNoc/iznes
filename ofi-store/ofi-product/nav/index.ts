import {combineReducers, Reducer} from 'redux';

import {
    OfiNavFundsListState,
    OfiNavFundsListReducer,

    // Actions
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    clearRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,

    // selector
    getOfiNavFundsListCurrentRequest
} from './nav-funds-list';

export {
    // Actions
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    clearRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,

    // selector
    getOfiNavFundsListCurrentRequest
};

import {
    OfiNavFundViewState,
    OfiNavFundViewReducer,

    // Actions
    SET_NAV_FUND_VIEW,
    setRequestedNavFundView,
    clearRequestedNavFundView,
    ofiSetCurrentNavFundViewRequest,

    // selector
    getOfiNavFundViewCurrentRequest
} from './nav-fund-view';

export {
    // Actions
    SET_NAV_FUND_VIEW,
    setRequestedNavFundView,
    clearRequestedNavFundView,
    ofiSetCurrentNavFundViewRequest,

    // selector
    getOfiNavFundViewCurrentRequest
};

import {
    OfiNavFundHistoryState,
    OfiNavFundHistoryReducer,

    // Actions
    SET_NAV_FUND_HISTORY,
    setRequestedNavFundHistory,
    clearRequestedNavFundHistory,
    ofiSetCurrentNavFundHistoryRequest,

    // selector
    getOfiNavFundHistoryCurrentRequest
} from './nav-fund-history';

export {
    // Actions
    SET_NAV_FUND_HISTORY,
    setRequestedNavFundHistory,
    clearRequestedNavFundHistory,
    ofiSetCurrentNavFundHistoryRequest,

    // selector
    getOfiNavFundHistoryCurrentRequest
};

export interface OfiManageNavState {
    ofiNavFundsList: OfiNavFundsListState;
    ofiNavFundView: OfiNavFundViewState;
    ofiNavFundHistory: OfiNavFundHistoryState;
}

export const OfiManageNavReducer: Reducer<OfiManageNavState> = combineReducers<OfiManageNavState>({
    ofiNavFundsList: OfiNavFundsListReducer,
    ofiNavFundView: OfiNavFundViewReducer,
    ofiNavFundHistory: OfiNavFundHistoryReducer
});

