import { combineReducers, Reducer } from 'redux';
/*
 Ofi Invest
 */
import { OfiFundInvestReducer, OfiFundInvestState } from './ofi-fund-invest';
/*
 Ofi AM Dashboard
 */
import { OfiAmDashboardsReducer, OfiAmDashboardsState } from './ofi-am-dashboard';
/*
 Ofi client tx
 */
import {
    OfiClientTxReducer,
    OfiClientTxState,
} from './ofi-client-txs';
/*
 Ofi Corp Actions
 */
import { OfiCorpActionsReducer, OfiCorpActionsState } from './ofi-corp-actions';
/*
 Ofi Product
 */
import {
    OfiProductReducer,
    OfiProductState,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_SICAV_LIST,
} from './ofi-product';
/*
 Ofi Orders
 */
import { OfiOrdersReducer, OfiOrdersState } from './ofi-orders';
/*
 Ofi Reports
 */
import { OfiReportsReducer, OfiReportsState } from './ofi-reports';
/*
 Ofi My Informations
 */
import { KycReducer, KycState } from './ofi-kyc';

/* Currencies */
import { CurrencyState, CurrencyReducer } from './ofi-currencies';
import { OfiPortfolioManagerState, OfiPortfolioMangerReducer } from './ofi-portfolio-manager';
import {
    SubPortfolioBankingDetailsState,
    OfiSubPortfolioBankingDetailsReducer,
    RESET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
} from './ofi-sub-portfolio';

export {
    SET_FUND_ACCESS_MY,
    clearRequestedFundAccessMy,
    setRequestedFundAccessMy,
    ofiListOfFundsComponentActions,
    FundAccessMyActions,
} from './ofi-fund-invest';

export {
    SET_CLIENT_TX_LIST,
    setRequestedClientTxList,
    clearRequestedClientTxList,
} from './ofi-client-txs';

export {
    OFI_SET_FUNDS_BY_USER_LIST,
    ofiSetFundsByUserRequested,
    ofiClearFundsByUserRequested,
    OFI_SET_FUNDS_WITH_HOLDERS_LIST,
    ofiSetFundsWithHoldersRequested,
    ofiClearFundsWithHoldersRequested,
} from './ofi-am-dashboard';

export {
    /* Coupons */
    getOfiCouponList,
    OFI_SET_COUPON_LIST,
    ofiCouponActions,

    /* User issued assets */
    getOfiUserIssuedAssets,
    OFI_SET_USER_ISSUED_ASSETS,
    ofiClearRequestedIssuedAssets,
    ofiSetRequestedUserIssuedAssets,
} from './ofi-corp-actions';

export {
    OFI_SET_MANAGE_ORDER_LIST,
    ofiClearRequestedManageOrder,
    ofiSetRequestedManageOrder,
    ofiManageOrderActions,
} from './ofi-orders';

export {
    OFI_SET_AM_HOLDERS_LIST,
    ofiClearRequestedAmHolders,
    ofiSetRequestedAmHolders,
    ofiSetHolderDetailRequested,
    ofiClearHolderDetailRequested,
    OFI_GET_SHARE_HOLDER_DETAIL,
} from './ofi-reports';

export {
    OfiProductState,
    OfiProductReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_SICAV_LIST,
};

export {
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
    SET_NAV_LATEST,
    setRequestedNavLatest,
    clearRequestedNavLatest,
    ofiSetCurrentNavLatestRequest,
    getOfiNavLatestCurrentRequest,
    NavAuditDetail,
    OfiNavAuditState,
    OfiNavAuditReducer,
    setRequestedNavAudit,
    clearRequestedNavAudit,
    SET_NAV_AUDIT,
    SET_REQUESTED_NAV_AUDIT,
    CLEAR_REQUESTED_NAV_AUDIT,
    // FUND SHARE LIST
    SET_AM_ALL_FUND_SHARE_LIST,
    setRequestedAmAllFundShare,
    clearRequestedAmAllFundShare,
    setRequestedIznesShares,
    GET_IZN_SHARES_LIST,
    // FUND SHARE
    OfiFundShare,
    OfiFundShareDocuments,
    SET_FUND_SHARE,
    setRequestedFundShare,
    clearRequestedFundShare,
    // FUND SHARE AUDIT
    FundShareAuditDetail,
    OfiFundShareAuditState,
    OfiFundShareAuditReducer,
    setRequestedFundShareAudit,
    clearRequestedFundShareAudit,
    SET_FUND_SHARE_AUDIT,
    SET_REQUESTED_FUND_SHARE_AUDIT,
    CLEAR_REQUESTED_FUND_SHARE_AUDIT,
    // PRODUCT CONFIG
    ProductConfiguration,
    SET_PRODUCT_CONFIGURATION,
    SET_REQUESTED_CONFIGURATION,
    CLEAR_REQUESTED_CONFIGURATION,
    setRequestedConfiguration,
    clearRequestedConfiguration,
} from './ofi-product';

export {
    setrequested,
    setamkyclist,
    clearrequested,
    OFI_SET_MY_DOCUMENTS_LIST,
    OFI_SET_REQUESTED_MY_DOCUMENTS,
    OFI_CLEAR_REQUESTED_MY_DOCUMENTS,
    OFI_SET_REQUESTED_CLIENT_REFERENTIAL,
    OFI_SET_CLIENT_REFERENTIAL_AUDIT,
} from './ofi-kyc';

/* Currencies */
export { CurrencyActions } from './ofi-currencies';

/* Sub-Portfolio */
export {
    SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
    RESET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
    resetSubPortfolioBankingDetailsRequested,
    SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST,
} from './ofi-sub-portfolio';

/*--------------------------------------------------*/
/*--------------- OFI GLOBAL REDUCER ---------------*/

/*--------------------------------------------------*/
export interface OfiState {
    ofiCurrencies: CurrencyState;
    ofiFundInvest: OfiFundInvestState;
    ofiCorpActions: OfiCorpActionsState;
    ofiProduct: OfiProductState;
    ofiOrders: OfiOrdersState;
    ofiClientTx: OfiClientTxState;
    ofiKyc: KycState;
    ofiReports: OfiReportsState;
    ofiAmDashboard: OfiAmDashboardsState;
    ofiPortfolioManager: OfiPortfolioManagerState;
    ofiSubPortfolio: SubPortfolioBankingDetailsState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiCurrencies: CurrencyReducer,
    ofiFundInvest: OfiFundInvestReducer,
    ofiCorpActions: OfiCorpActionsReducer,
    ofiProduct: OfiProductReducer,
    ofiOrders: OfiOrdersReducer,
    ofiClientTx: OfiClientTxReducer,
    ofiKyc: KycReducer,
    ofiReports: OfiReportsReducer,
    ofiAmDashboard: OfiAmDashboardsReducer,
    ofiPortfolioManager: OfiPortfolioMangerReducer,
    ofiSubPortfolio: OfiSubPortfolioBankingDetailsReducer,
});
