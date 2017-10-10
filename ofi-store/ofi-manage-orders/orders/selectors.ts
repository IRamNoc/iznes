import {createSelector} from 'reselect';
import {OfiState} from '../../index';
import {OfiOrdersState} from '.';
import {OfiManageOrderState} from '../index';

const getOfi = (state): OfiState => {
    return state.ofi
};

const getOfiCorpActions = createSelector(
    getOfi,
    (state: OfiState): OfiManageOrderState => {
        return state.ofiManageOrders
    }
);

export const getOfiManageOrders = createSelector(
    getOfiCorpActions,
    (state: OfiManageOrderState): OfiOrdersState => {
        return state.ofiManageOrders
    }
);

export const getOfiOrderList = createSelector(
    getOfiManageOrders,
    (state: OfiOrdersState): Array<any> => {
        return state.ofiOrderList
    }
);
