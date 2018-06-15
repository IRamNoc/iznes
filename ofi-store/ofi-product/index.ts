import { Reducer, combineReducers } from 'redux';

import {
    ManagementCompanyState,
    ManagementCompanyReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_INV_MANAGEMENT_COMPANY_LIST,
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
    UmbrellaFundState,
    UmbrellaFundReducer,
    SET_UMBRELLA_FUND_LIST,
    setRequestedUmbrellaFund,
} from './umbrella-fund';

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
    getOfiNavLatestCurrentRequest,
} from './nav';

import {
    NavAuditDetail,
    OfiNavAuditState,
    OfiNavAuditReducer,
    setRequestedNavAudit,
    clearRequestedNavAudit,
    SET_NAV_AUDIT,
    SET_REQUESTED_NAV_AUDIT,
    CLEAR_REQUESTED_NAV_AUDIT,
} from './nav-audit';

import {
    SET_REQUESTED_PRODUCT_CHARACTERISTICS,
    SET_PRODUCT_CHARACTERISTICS,
    productCharacteristicsReducer,
    productCharacteristicsState,
    setProductCharacteristics,
} from './product-characteristics';

import {
    OfiFundShareListState,
    OfiFundShareListReducer,
    SET_AM_ALL_FUND_SHARE_LIST,
    SET_REQUESTED_AM_All_FUND_SHARE,
    CLEAR_REQUESTED_AM_All_FUND_SHARE,
    setRequestedAmAllFundShare,
    clearRequestedAmAllFundShare,
    setRequestedIznesShares,
    GET_IZN_SHARES_LIST,
} from './fund-share-list';

import {
    OfiFundShare,
    SET_FUND_SHARE,
    OfiFundShareState,
    OfiFundShareReducer,
    setRequestedFundShare,
    clearRequestedFundShare,
} from './fund-share';

import {
    FundShareAuditDetail,
    OfiFundShareAuditState,
    OfiFundShareAuditReducer,
    setRequestedFundShareAudit,
    clearRequestedFundShareAudit,
    SET_FUND_SHARE_AUDIT,
    SET_REQUESTED_FUND_SHARE_AUDIT,
    CLEAR_REQUESTED_FUND_SHARE_AUDIT,
} from './fund-share-audit';

import {
    OfiFundShareDocuments,
    SET_FUND_SHARE_DOCS,
    OfiFundShareDocsState,
    OfiFundShareDocsReducer,
    setRequestedFundShareDocs,
    clearRequestedFundShareDocs,
} from './fund-share-docs';

import {
    OFI_SET_CURRENT_FUND_SHARE_SF,
    ofiSetCurrentFundShareSelectedFund,
    getOfiFundShareSelectedFund,
    OfiFundShareSelectedFundReducer,
    OfiFundShareSelectedFundState,
} from './fund-share-sf';

import {
    ProductConfiguration,
    SET_PRODUCT_CONFIGURATION,
    SET_REQUESTED_CONFIGURATION,
    CLEAR_REQUESTED_CONFIGURATION,
    setRequestedConfiguration,
    clearRequestedConfiguration,
    OfiProductConfigReducer,
    OfiProductConfigState,
} from './configuration';

export {
    ManagementCompanyState,
    ManagementCompanyReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_INV_MANAGEMENT_COMPANY_LIST,
    SicavState,
    SicavReducer,
    SET_SICAV_LIST,
    // FUNDS
    FundState,
    FundReducer,
    SET_FUND_LIST,
    // UMBRELLA FUNDS
    UmbrellaFundState,
    UmbrellaFundReducer,
    SET_UMBRELLA_FUND_LIST,
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
    // AUDIT
    NavAuditDetail,
    OfiNavAuditState,
    OfiNavAuditReducer,
    setRequestedNavAudit,
    clearRequestedNavAudit,
    SET_NAV_AUDIT,
    SET_REQUESTED_NAV_AUDIT,
    CLEAR_REQUESTED_NAV_AUDIT,
    // Fund Share List
    OfiFundShareListState,
    OfiFundShareListReducer,
    SET_REQUESTED_AM_All_FUND_SHARE,
    CLEAR_REQUESTED_AM_All_FUND_SHARE,
    SET_AM_ALL_FUND_SHARE_LIST,
    setRequestedAmAllFundShare,
    clearRequestedAmAllFundShare,
    setRequestedIznesShares,
    GET_IZN_SHARES_LIST,
    // FUND SHARE
    OfiFundShare,
    SET_FUND_SHARE,
    OfiFundShareState,
    OfiFundShareReducer,
    setRequestedFundShare,
    clearRequestedFundShare,
    // FUND SHARE DOCS
    OfiFundShareDocuments,
    SET_FUND_SHARE_DOCS,
    OfiFundShareDocsState,
    OfiFundShareDocsReducer,
    setRequestedFundShareDocs,
    clearRequestedFundShareDocs,
    // FUND SHARE AUDIT
    FundShareAuditDetail,
    OfiFundShareAuditState,
    OfiFundShareAuditReducer,
    setRequestedFundShareAudit,
    clearRequestedFundShareAudit,
    SET_FUND_SHARE_AUDIT,
    SET_REQUESTED_FUND_SHARE_AUDIT,
    CLEAR_REQUESTED_FUND_SHARE_AUDIT,
    // FUND SHARE SELECTED FUND
    OFI_SET_CURRENT_FUND_SHARE_SF,
    ofiSetCurrentFundShareSelectedFund,
    getOfiFundShareSelectedFund,
    OfiFundShareSelectedFundReducer,
    // PRODUCT CONFIGURATION
    ProductConfiguration,
    SET_PRODUCT_CONFIGURATION,
    SET_REQUESTED_CONFIGURATION,
    CLEAR_REQUESTED_CONFIGURATION,
    setRequestedConfiguration,
    clearRequestedConfiguration,
    OfiProductConfigReducer,
    OfiProductConfigState,
    // PRODUCT CHARACTERISTICS
    SET_REQUESTED_PRODUCT_CHARACTERISTICS,
    SET_PRODUCT_CHARACTERISTICS,
    setProductCharacteristics,
};

export interface OfiProductState {
    ofiManagementCompany: ManagementCompanyState;
    ofiSicav: SicavState;
    ofiFund: FundState;
    ofiFundShareList: OfiFundShareListState;
    ofiUmbrellaFund: UmbrellaFundState;
    ofiFundShare: OfiFundShareState;
    ofiFundShareDocs: OfiFundShareDocsState;
    ofiFundShareSelectedFund: OfiFundShareSelectedFundState;
    ofiManageNav: OfiManageNavState;
    ofiNavLatest: OfiNavLatestState;
    ofiProductConfiguration: OfiProductConfigState;
    ofiProductCharacteristics: productCharacteristicsState;
}

export const OfiProductReducer: Reducer<OfiProductState> = combineReducers<OfiProductState>({
    ofiManagementCompany: ManagementCompanyReducer,
    ofiSicav: SicavReducer,
    ofiFund: FundReducer,
    ofiFundShareList: OfiFundShareListReducer,
    ofiUmbrellaFund: UmbrellaFundReducer,
    ofiFundShare: OfiFundShareReducer,
    ofiFundShareAudit: OfiFundShareAuditReducer,
    ofiFundShareDocs: OfiFundShareDocsReducer,
    ofiFundShareSelectedFund: OfiFundShareSelectedFundReducer,
    ofiManageNav: OfiManageNavReducer,
    ofiNavLatest: OfiNavLatestReducer,
    ofiNavAudit: OfiNavAuditReducer,
    ofiProductConfiguration: OfiProductConfigReducer,
    ofiProductCharacteristics: productCharacteristicsReducer,
});
