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
   OfiFundShareListState,
   OfiFundShareListReducer,
   SET_AM_ALL_FUND_SHARE_LIST,
   SET_REQUESTED_AM_All_FUND_SHARE,
   CLEAR_REQUESTED_AM_All_FUND_SHARE,
   setRequestedAmAllFundShare,
   clearRequestedAmAllFundShare
} from './fund-share-list';

import {
    OfiFundShare,
    SET_FUND_SHARE,
    OfiFundShareState,
    OfiFundShareReducer,
    setRequestedFundShare,
    clearRequestedFundShare
 } from './fund-share';

 import {
    OFI_SET_CURRENT_FUND_SHARE_SF,
    ofiSetCurrentFundShareSelectedFund,
    getOfiFundShareSelectedFund,
    OfiFundShareSelectedFundReducer,
    OfiFundShareSelectedFundState
 } from './fund-share-sf';

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
    // Fund Share List
    OfiFundShareListState,
    OfiFundShareListReducer,
    SET_REQUESTED_AM_All_FUND_SHARE,
    CLEAR_REQUESTED_AM_All_FUND_SHARE,
    SET_AM_ALL_FUND_SHARE_LIST,
    setRequestedAmAllFundShare,
    clearRequestedAmAllFundShare,
    // FUND SHARE
    OfiFundShare,
    SET_FUND_SHARE,
    OfiFundShareState,
    OfiFundShareReducer,
    setRequestedFundShare,
    clearRequestedFundShare,
    // FUND SHARE SELECTED FUND
    OFI_SET_CURRENT_FUND_SHARE_SF,
    ofiSetCurrentFundShareSelectedFund,
    getOfiFundShareSelectedFund,
    OfiFundShareSelectedFundReducer
};

export interface OfiProductState {
    ofiManagementCompany: ManagementCompanyState;
    ofiSicav: SicavState;
    ofiFund: FundState;
    ofiFundShareList: OfiFundShareListState;
    ofiFundShare: OfiFundShareState;
    ofiFundShareSelectedFund: OfiFundShareSelectedFundState;
    ofiManageNav: OfiManageNavState;
    ofiNavLatest: OfiNavLatestState;
}

export const OfiProductReducer: Reducer<OfiProductState> = combineReducers<OfiProductState>({
    ofiManagementCompany: ManagementCompanyReducer,
    ofiSicav: SicavReducer,
    ofiFund: FundReducer,
    ofiFundShareList: OfiFundShareListReducer,
    ofiFundShare: OfiFundShareReducer,
    ofiFundShareSelectedFund: OfiFundShareSelectedFundReducer,
    ofiManageNav: OfiManageNavReducer,
    ofiNavLatest: OfiNavLatestReducer
});
