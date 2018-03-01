import {Reducer, combineReducers} from 'redux';

import {
    ManagementCompanyState,
    ManagementCompanyReducer,
    SET_MANAGEMENT_COMPANY_LIST,
} from './management-company';

import {
    SicavState,
    SicavReducer,
    SET_SICAV_LIST,
} from './sicav';

import {
    FundState,
    FundReducer,
    SET_FUND_LIST,
} from './fund';

import {
    OfiManageNavState,
    OfiManageNavReducer,
    // LIST
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    clearRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,
    getOfiNavFundsListCurrentRequest,
    // VIEW
    SET_NAV_FUND_VIEW,
    setRequestedNavFundView,
    clearRequestedNavFundView,
    ofiSetCurrentNavFundViewRequest,
    getOfiNavFundViewCurrentRequest,
    // HISTORY
    SET_NAV_FUND_HISTORY,
    setRequestedNavFundHistory,
    clearRequestedNavFundHistory,
    ofiSetCurrentNavFundHistoryRequest,
    getOfiNavFundHistoryCurrentRequest,
    // LATEST
    OfiNavLatestState,
    OfiNavLatestReducer,
    SET_NAV_LATEST,
    setRequestedNavLatest,
    clearRequestedNavLatest,
    ofiSetCurrentNavLatestRequest,
    getOfiNavLatestCurrentRequest
} from './nav';

import {
   OfiFundShareState,
   OfiFundShareReducer,
   SET_AM_ALL_FUND_SHARE_LIST,
   SET_REQUESTED_AM_All_FUND_SHARE,
   CLEAR_REQUESTED_AM_All_FUND_SHARE
} from './fundshare';

export {
    ManagementCompanyState,
    ManagementCompanyReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SicavState,
    SicavReducer,
    SET_SICAV_LIST,
    FundState,
    FundReducer,
    SET_FUND_LIST,
    // LIST
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    clearRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,
    getOfiNavFundsListCurrentRequest,
    // VIEW
    SET_NAV_FUND_VIEW,
    setRequestedNavFundView,
    clearRequestedNavFundView,
    ofiSetCurrentNavFundViewRequest,
    getOfiNavFundViewCurrentRequest,
    // HISTORY
    SET_NAV_FUND_HISTORY,
    setRequestedNavFundHistory,
    clearRequestedNavFundHistory,
    ofiSetCurrentNavFundHistoryRequest,
    getOfiNavFundHistoryCurrentRequest,
    // LATEST
    OfiNavLatestState,
    OfiNavLatestReducer,
    SET_NAV_LATEST,
    setRequestedNavLatest,
    clearRequestedNavLatest,
    ofiSetCurrentNavLatestRequest,
    getOfiNavLatestCurrentRequest,

    // Fund Share
    SET_REQUESTED_AM_All_FUND_SHARE,
    CLEAR_REQUESTED_AM_All_FUND_SHARE,
    SET_AM_ALL_FUND_SHARE_LIST
};

export interface OfiProductState {
    ofiManagementCompany: ManagementCompanyState;
    ofiSicav: SicavState;
    ofiFund: FundState;
    ofiFundShare: OfiFundShareState;
    ofiManageNav: OfiManageNavState;
    ofiNavLatest: OfiNavLatestState;
}

export const OfiProductReducer: Reducer<OfiProductState> = combineReducers<OfiProductState>({
    ofiManagementCompany: ManagementCompanyReducer,
    ofiSicav: SicavReducer,
    ofiFund: FundReducer,
    ofiFundShare: OfiFundShareReducer,
    ofiManageNav: OfiManageNavReducer,
    ofiNavLatest: OfiNavLatestReducer
});
