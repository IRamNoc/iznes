import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {CouponTab} from './model';

/**
 * Set the coupon list.
 */
export const OFI_SET_COUPON_LIST = `${name}/OFI_SET_COUPON_LIST`;

// update tabs
export const SET_ALL_TABS = `${name}/SET_ALL_TABS`;

export interface SetAllTab extends Action {
    tabs: Array<CouponTab>;
}

export const setAllTabs: ActionCreator<SetAllTab> = (tabs: Array<CouponTab>) => (
    {
        type: SET_ALL_TABS,
        tabs
    }
);
