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
        console.log('SATGE 3: ', state);
        return state.ofiCoupon
    }
);

export const getOfiCouponList = createSelector(
    getOfiCoupon,
    (state: OfiCouponState): Array<any> => {
        console.log('SATGE 4: ', state);
        return state.ofiCouponList
    }
);
