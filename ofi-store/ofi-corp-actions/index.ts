import {combineReducers, Reducer} from 'redux';

import {OfiCouponState} from './coupons';

/* Coupon List */
import {
    OfiCouponListReducer
} from './coupons'
export {
    OFI_SET_COUPON_LIST,
    getOfiCouponList
} from './coupons';

export interface OfiCorpActionsState {
    ofiCoupon: OfiCouponState
}

export const OfiCorpActionsReducer: Reducer<OfiCorpActionsState> = combineReducers<OfiCorpActionsState>({
    ofiCoupon: OfiCouponListReducer,
});
