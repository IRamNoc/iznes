import {createSelector} from 'reselect';
import {OfiState} from '../../index';
import {OfiCouponState} from '.';
import {OfiCorpActionsState} from '../index';

const getOfi = (state): OfiState => {
    return state.ofi
};

const getOfiCorpActions = createSelector(
    getOfi,
    (state: OfiState): OfiCorpActionsState => {
        return state.ofiCorpActions
    }
);

export const getOfiCoupon = createSelector(
    getOfiCorpActions,
    (state: OfiCorpActionsState): OfiCouponState => {
        return state.ofiCoupon
    }
);

export const getOfiCouponList = createSelector(
    getOfiCoupon,
    (state: OfiCouponState): Array<any> => {
        return state.ofiCouponList
    }
);
