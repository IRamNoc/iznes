import {createSelector} from 'reselect';
import {OfiState} from '../../index';
import {OfiCorpActionsState} from '../index';

const getOfi = (state): OfiState => {
    return state.ofi
};

const getOfiCorpActions = createSelector(
    getOfi,
    (state: OfiState) => {
        return state.ofiCorpActions
    }
);

export const getOfiCouponList = createSelector(
    getOfiCorpActions,
    (state: OfiCorpActionsState) => {
        return state.ofiCouponList
    }
);
