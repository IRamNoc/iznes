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
    SET_SICAV_LIST
} from "./ofi-product";
/*
 Ofi Orders
 */
import {OfiOrdersReducer, OfiOrdersState} from "./ofi-orders";

export {
    SET_FUND_ACCESS_MY,
    clearRequestedFundAccessMy,
    setRequestedFundAccessMy
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

    /* User issued assets */
    getOfiUserIssuedAssets,
    OFI_SET_USER_ISSUED_ASSETS,
    ofiClearRequestedIssuedAssets,
    ofiSetRequestedUserIssuedAssets
} from './ofi-corp-actions';


export {
    /* Manage orders */
    getOfiManageOrderList,
    OFI_SET_MANAGE_ORDER_LIST,

    /* Home orders */
    getOfiHomeOrderList,
    OFI_SET_HOME_ORDER_LIST,
    ofiSetRequestedHomeOrder,
    ofiClearRequestedHomeOrder,
    ofiClearRequestedManageOrder,
    ofiSetRequestedManageOrder,

    /* Home orders buffer */
    OFI_SET_HOME_ORDER_BUFFER,
    OFI_RESET_HOME_ORDER_BUFFER,
    OFI_SET_HOME_ORDER_FILTER,
    OFI_RESET_HOME_ORDER_FILTER,
    getOfiHomeOrderViewBuffer,
    getOfiHomeOrderViewFilter,

    /* My orders */
    getOfiMyOrderList,
    OFI_SET_MY_ORDER_LIST,
    ofiClearRequestedMyOrder,
    ofiSetRequestedMyOrder,

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
    SET_MANAGE_NAV_LIST,
    setRequestedManageNavList,
    clearRequestedManageNavList,
    ofiSetCurrentManageNavRequest,
    getOfiManageNavListCurrentRequest
} from './ofi-product';

export interface OfiState {
    ofiFundInvest: OfiFundInvestState;
    ofiCorpActions: OfiCorpActionsState;
    ofiProduct: OfiProductState;
    ofiOrders: OfiOrdersState;
    ofiClientTx: OfiClientTxState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiFundInvest: OfiFundInvestReducer,
    ofiCorpActions: OfiCorpActionsReducer,
    ofiProduct: OfiProductReducer,
    ofiOrders: OfiOrdersReducer,
    ofiClientTx: OfiClientTxReducer,
});
