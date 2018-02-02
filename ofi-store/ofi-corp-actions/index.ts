import {combineReducers, Reducer} from 'redux';

/* Coupon List */
import {
    OfiCouponState,
    OfiCouponListReducer
} from './coupons';
export {
    OFI_SET_COUPON_LIST,
    getOfiCouponList,
    ofiCouponActions
} from './coupons';

/* Asset List */
import {
    OfiUserAssetsState,
    OfiUserAssetsReducer
} from './assets';
export {
    OFI_SET_USER_ISSUED_ASSETS,
    getOfiUserIssuedAssets,
    ofiClearRequestedIssuedAssets,
    ofiSetRequestedUserIssuedAssets
} from './assets';

export interface OfiCorpActionsState {
    ofiCoupon: OfiCouponState;
    ofiUserAssets: OfiUserAssetsState;
}

export const OfiCorpActionsReducer: Reducer<OfiCorpActionsState> = combineReducers<OfiCorpActionsState>({
    ofiCoupon: OfiCouponListReducer,
    ofiUserAssets: OfiUserAssetsReducer,
});
