import {combineReducers, Reducer} from "redux";
/*
 Ofi Invest
 */
import {OfiFundInvestReducer, OfiFundInvestState} from "./ofi-fund-invest";
/*
 Ofi client tx
 */
import {
    clearRequestedClientTxList,
    OfiClientTxReducer,
    OfiClientTxState,
    SET_CLIENT_TX_LIST,
    setRequestedClientTxList
} from "./ofi-client-txs";
/*
 Ofi Corp Actions
 */
import {OfiCorpActionsReducer, OfiCorpActionsState} from "./ofi-corp-actions";
/*
 Ofi Product
 */
import {
    OfiProductReducer,
    OfiProductState,
    SET_FUND_LIST,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_SICAV_LIST,
    OfiFundShare,
    SET_FUND_SHARE
} from "./ofi-product";
/*
 Ofi Orders
 */
import {OfiOrdersReducer, OfiOrdersState} from "./ofi-orders";
/*
 Ofi My Informations
 */
import {KycReducer, KycState, setamkyclist, setrequested, clearrequested} from './ofi-kyc';

export {
    SET_FUND_ACCESS_MY,
    clearRequestedFundAccessMy,
    setRequestedFundAccessMy,
    ofiListOfFundsComponentActions
} from './ofi-fund-invest';


export {
    SET_CLIENT_TX_LIST,
    setRequestedClientTxList,
    clearRequestedClientTxList
} from './ofi-client-txs';


export {
    /* Coupons */
    getOfiCouponList,
    OFI_SET_COUPON_LIST,
    ofiCouponActions,

    /* User issued assets */
    getOfiUserIssuedAssets,
    OFI_SET_USER_ISSUED_ASSETS,
    ofiClearRequestedIssuedAssets,
    ofiSetRequestedUserIssuedAssets
} from './ofi-corp-actions';


export {
    /* Manage orders */
    // getOfiManageOrderList,
    OFI_SET_MANAGE_ORDER_LIST,
    ofiClearRequestedManageOrder,
    ofiSetRequestedManageOrder,
    ofiClearNewOrderManageOrder,
    ofiSetNewOrderManageOrder,
    ofiManageOrderActions,

    /* Home orders */
    getOfiHomeOrderList,
    OFI_SET_HOME_ORDER_LIST,
    ofiSetRequestedHomeOrder,
    ofiClearRequestedHomeOrder,

    /* Home orders buffer */
    OFI_SET_HOME_ORDER_BUFFER,
    OFI_RESET_HOME_ORDER_BUFFER,
    OFI_SET_HOME_ORDER_FILTER,
    OFI_RESET_HOME_ORDER_FILTER,
    getOfiHomeOrderViewBuffer,
    getOfiHomeOrderViewFilter,

    /* My orders */
    // getOfiMyOrderList,
    OFI_SET_MY_ORDER_LIST,
    ofiClearRequestedMyOrder,
    ofiSetRequestedMyOrder,
    ofiMyOrderActions,

    // Collective report
    setRequestedCollectiveArchive,
    clearRequestedCollectiveArchive,
    SET_COLLECTIVE_ARCHIVE
} from './ofi-orders';

export {
    OfiProductState,
    OfiProductReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_SICAV_LIST,
    SET_FUND_LIST,
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
    // FUND SHARE LIST
    SET_AM_ALL_FUND_SHARE_LIST,
    setRequestedAmAllFundShare,
    clearRequestedAmAllFundShare,
    setRequestedIznesShares,
    GET_IZN_SHARES_LIST,
    // FUND SHARE
    OfiFundShare,
    SET_FUND_SHARE,
    setRequestedFundShare,
    clearRequestedFundShare,
} from './ofi-product';

export {
    setrequested,
    setamkyclist,
    clearrequested
} from './ofi-kyc';


export interface OfiState {
    ofiFundInvest: OfiFundInvestState;
    ofiCorpActions: OfiCorpActionsState;
    ofiProduct: OfiProductState;
    ofiOrders: OfiOrdersState;
    ofiClientTx: OfiClientTxState;
    ofiKyc: KycState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiFundInvest: OfiFundInvestReducer,
    ofiCorpActions: OfiCorpActionsReducer,
    ofiProduct: OfiProductReducer,
    ofiOrders: OfiOrdersReducer,
    ofiClientTx: OfiClientTxReducer,
    ofiKyc: KycReducer,
});
