import {createSelector} from 'reselect';
import {OfiState} from '../../index';
import {MyOrders} from '.';
import {OfiOrdersState} from '../index';

const getOfi = (state): OfiState => {
    return state.ofi
};

const getOfiOrders = createSelector(
    getOfi,
    (state: OfiState): OfiOrdersState => {
        return state.ofiOrders
    }
);

export const getOfiMyOrders = createSelector(
    getOfiOrders,
    (state: OfiOrdersState): MyOrders => {
        return state.myOrders
    }
);

export const getOfiMyOrderList = createSelector(
    getOfiMyOrders,
    (state: MyOrders): Array<any> => {
        return state.orderList
    }
);
