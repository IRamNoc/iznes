import {createSelector} from 'reselect';
import {OfiState} from '../../index';
import {Orders} from '.';
import {OfiManageOrdersState} from '../index';

const getOfi = (state): OfiState => {
    return state.ofi
};

const getOfiCorpActions = createSelector(
    getOfi,
    (state: OfiState): OfiManageOrdersState => {
        return state.ofiManageOrders
    }
);

export const getOfiManageOrders = createSelector(
    getOfiCorpActions,
    (state: OfiManageOrdersState): Orders => {
        return state.manageOrders
    }
);

export const getOfiOrderList = createSelector(
    getOfiManageOrders,
    (state: Orders): Array<any> => {
        return state.orderList
    }
);
