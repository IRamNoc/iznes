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
} from './ofi-corp-actions';

/*
    Ofi Orders
 */
import {
    OfiOrdersState,
    OfiOrdersReducer
} from './ofi-orders';

export {
    getOfiMyOrderList,
    getOfiManageOrderList,
    OFI_SET_MANAGE_ORDER_LIST,
    OFI_SET_MY_ORDER_LIST,
} from './ofi-orders';

export {
    OfiProductState,
    OfiProductReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_SICAV_LIST,
    SET_FUND_LIST,
};

export interface OfiState {
    ofiFundInvest: OfiFundInvestState;
    ofiCorpActions: OfiCorpActionsState;
    ofiProduct: OfiProductState;
    ofiOrders: OfiOrdersState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiFundInvest: OfiFundInvestReducer,
    ofiCorpActions: OfiCorpActionsReducer,
    ofiProduct: OfiProductReducer,
    ofiOrders: OfiOrdersReducer,
});
