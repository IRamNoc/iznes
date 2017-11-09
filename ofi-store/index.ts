import {Reducer, combineReducers} from 'redux';

/*
 Ofi Invest
 */
import {
    OfiFundInvestState,
    OfiFundInvestReducer
} from './ofi-fund-invest';

export {
    SET_FUND_ACCESS_MY,
    clearRequestedFundAccessMy,
    setRequestedFundAccessMy
} from './ofi-fund-invest';

/*
 Ofi client tx
 */
import {
    OfiClientTxReducer,
    OfiClientTxState,

    SET_CLIENT_TX_LIST,
    setRequestedClientTxList,
    clearRequestedClientTxList
} from './ofi-client-txs';

export {
    SET_CLIENT_TX_LIST,
    setRequestedClientTxList,
    clearRequestedClientTxList
} from './ofi-client-txs';

/*
 Ofi Corp Actions
 */
import {
    OfiCorpActionsState,
    OfiCorpActionsReducer
} from './ofi-corp-actions';

/*
 Ofi Product
 */
import {
    OfiProductState,
    OfiProductReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_SICAV_LIST,
    SET_FUND_LIST,

} from './ofi-product';

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

/*
 Ofi Orders
 */
import {
    OfiOrdersState,
    OfiOrdersReducer
} from './ofi-orders';

export {
    /* Manage orders */
    getOfiManageOrderList,
    OFI_SET_MANAGE_ORDER_LIST,

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

    /* My orders */
    getOfiMyOrderList,
    OFI_SET_MY_ORDER_LIST,

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
