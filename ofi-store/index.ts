import {Reducer, combineReducers} from 'redux';

import {
    OfiFundInvestState,
    OfiFundInvestReducer
} from './ofi-fund-invest';

import {
    OfiCorpActionsState,
    OfiCorpActionsReducer
} from './ofi-corp-actions';
export {
    /* Coupons */
    getOfiCouponList,
    OFI_SET_COUPON_LIST,

    /* User issued assets */
    getOfiUserIssuedAssets,
    OFI_SET_USER_ISSUED_ASSETS,
} from './ofi-corp-actions';

export {
    SET_FUND_ACCESS_MY,
    clearRequestedFundAccessMy,
    setRequestedFundAccessMy
} from './ofi-fund-invest';

export interface OfiState {
    ofiFundInvest: OfiFundInvestState;
    ofiCorpActions: OfiCorpActionsState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiFundInvest: OfiFundInvestReducer,
    ofiCorpActions: OfiCorpActionsReducer,
});
