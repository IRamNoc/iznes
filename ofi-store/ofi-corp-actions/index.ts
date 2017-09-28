import {combineReducers, Reducer} from 'redux';

/* Coupon List */
import {
    OfiCouponListReducer
} from './coupon-list'
export {
    OFI_SET_COUPON_LIST,
    getOfiCouponList
} from './coupon-list';

export interface OfiCorpActionsState {
    ofiCouponList: Array<any>;
}

export const OfiCorpActionsReducer: Reducer<OfiCorpActionsState> = combineReducers<OfiCorpActionsState>({
    ofiCouponList: OfiCouponListReducer,
});
