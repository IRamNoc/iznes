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
    clearRequestedClientTxList,
    OfiClientTxReducer,
    OfiClientTxState,
    SET_CLIENT_TX_LIST,
    setRequestedClientTxList,
} from './ofi-client-txs';
/*
 Ofi Corp Actions
 */
import { OfiCorpActionsReducer, OfiCorpActionsState } from './ofi-corp-actions';
/*
 Ofi Product
 */
import {
    OfiFundShare,
    OfiProductReducer,
    OfiProductState,
    SET_FUND_SHARE,
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
import { clearrequested, KycReducer, KycState, setamkyclist, setrequested } from './ofi-kyc';

/* Currencies */
import { CurrencyState, CurrencyActions, CurrencyReducer } from './ofi-currencies';

export {
    SET_FUND_ACCESS_MY,
    clearRequestedFundAccessMy,
    setRequestedFundAccessMy,
    ofiListOfFundsComponentActions,
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
    /* Manage orders */
    // getOfiManageOrderList,
    OFI_SET_MANAGE_ORDER_LIST,
    ofiClearRequestedManageOrder,
    ofiSetRequestedManageOrder,
    ofiManageOrderActions,
    ofiUpdateOrder,

    // Collective report
    setRequestedCollectiveArchive,
    clearRequestedCollectiveArchive,
    SET_COLLECTIVE_ARCHIVE,
} from './ofi-orders';

export {
    OFI_SET_CENTRALIZATION_REPORTS_LIST,
    OFI_SET_BASE_CENTRALIZATION_HISTORY,
    OFI_SET_CENTRALIZATION_HISTORY,
    ofiClearRequestedCentralisationHistoryReports,
    ofiSetRequestedCentralisationHistoryReports,
    ofiCentralisationHistoryReportsActions,
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
    OFI_SET_CLIENT_REFERENTIAL_AUDIT
} from './ofi-kyc';

/* Currencies */
export { CurrencyActions } from './ofi-currencies';

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
});
