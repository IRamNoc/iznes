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
} from './fund';

import {
    UmbrellaFundState,
    umbrellaFundReducer,
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
    ProductConfiguration,
    SET_PRODUCT_CONFIGURATION,
    SET_REQUESTED_CONFIGURATION,
    CLEAR_REQUESTED_CONFIGURATION,
    setRequestedConfiguration,
    clearRequestedConfiguration,
    OfiProductConfigReducer,
    OfiProductConfigState,
} from './configuration';

import { leiReducer, LeiState } from '@ofi/ofi-main/ofi-store/ofi-product/lei';

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
    // UMBRELLA FUNDS
    UmbrellaFundState,
    umbrellaFundReducer,
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
    ofiFundShareAudit: OfiFundShareAuditState;
    ofiFundShareDocs: OfiFundShareDocsState;
    lei: LeiState;
    ofiManageNav: OfiManageNavState;
    ofiNavLatest: OfiNavLatestState;
    ofiNavAudit: OfiNavAuditState;
    ofiProductConfiguration: OfiProductConfigState;
    ofiProductCharacteristics: productCharacteristicsState;
}

export const OfiProductReducer: Reducer<OfiProductState> = combineReducers<OfiProductState>({
    ofiManagementCompany: ManagementCompanyReducer,
    ofiSicav: SicavReducer,
    ofiFund: FundReducer,
    ofiFundShareList: OfiFundShareListReducer,
    ofiUmbrellaFund: umbrellaFundReducer,
    ofiFundShare: OfiFundShareReducer,
    ofiFundShareAudit: OfiFundShareAuditReducer,
    ofiFundShareDocs: OfiFundShareDocsReducer,
    lei: leiReducer,
    ofiManageNav: OfiManageNavReducer,
    ofiNavLatest: OfiNavLatestReducer,
    ofiNavAudit: OfiNavAuditReducer,
    ofiProductConfiguration: OfiProductConfigReducer,
    ofiProductCharacteristics: productCharacteristicsReducer,
});
