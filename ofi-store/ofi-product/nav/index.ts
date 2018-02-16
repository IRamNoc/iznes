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

export interface OfiManageNavState {
    ofiNavFundsList: OfiNavFundsListState;
    ofiNavFundView: OfiNavFundViewState;
}

export const OfiManageNavReducer: Reducer<OfiManageNavState> = combineReducers<OfiManageNavState>({
    ofiNavFundsList: OfiNavFundsListReducer,
    ofiNavFundView: OfiNavFundViewReducer
});

