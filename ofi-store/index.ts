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
    Ofi Product
 */
import {
    OfiProductState,
    OfiProductReducer,
    SET_MANAGEMENT_COMPANY_LIST,
} from './ofi-product';

/*
    Ofi Manage Orders
 */
import {
    OfiManageOrdersState,
    OfiManageOrdersReducer
} from './ofi-manage-orders';
export {
    /* Orders List. */
    getOfiOrderList,
    OFI_SET_ORDER_LIST,
} from './ofi-manage-orders';

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
    ofiManageOrders: OfiManageOrdersState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiFundInvest: OfiFundInvestReducer,
    ofiCorpActions: OfiCorpActionsReducer,
    ofiProduct: OfiProductReducer,
    ofiManageOrders: OfiManageOrdersReducer,
});
