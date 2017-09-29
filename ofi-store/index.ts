import {Reducer, combineReducers} from 'redux';

import {
    OfiFundInvestState,
    OfiFundInvestReducer
} from './ofi-fund-invest';

import {
    OfiCorpActionsState,
    OfiCorpActionsReducer
} from './ofi-corp-actions';

import {
    OfiProductState,
    OfiProductReducer,
    SET_MANAGEMENT_COMPANY_LIST,
} from './ofi-product';

export {
    getOfiCouponList,
    OFI_SET_COUPON_LIST
} from './ofi-corp-actions';

export {
    SET_FUND_ACCESS_MY,
    clearRequestedFundAccessMy,
    setRequestedFundAccessMy
} from './ofi-fund-invest';

export {
    OfiProductState,
    OfiProductReducer,
    SET_MANAGEMENT_COMPANY_LIST
}

export interface OfiState {
    ofiFundInvest: OfiFundInvestState;
    ofiCorpActions: OfiCorpActionsState;
    ofiProduct: OfiProductState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiFundInvest: OfiFundInvestReducer,
    ofiCorpActions: OfiCorpActionsReducer,
    ofiProduct: OfiProductReducer,
});
