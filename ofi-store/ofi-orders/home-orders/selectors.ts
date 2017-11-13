import {createSelector} from "reselect";
import {OfiState} from "../../index";
import {HomeOrders} from ".";
import {OfiOrdersState} from "../index";

const getOfi = (state): OfiState => {
    return state.ofi
};

const getOfiOrders = createSelector(
    getOfi,
    (state: OfiState): OfiOrdersState => {
        return state.ofiOrders
    }
);

export const getOfiHomeOrders = createSelector(
    getOfiOrders,
    (state: OfiOrdersState): HomeOrders => {
        return state.homeOrders
    }
);

export const getOfiHomeOrderViewBuffer = createSelector(
    getOfiHomeOrders,
    (state: HomeOrders): number => {
        return state.orderBuffer
    }
);

export const getOfiHomeOrderViewFilter = createSelector(
    getOfiHomeOrders,
    (state: HomeOrders): string => {
        return state.orderFilter
    }
);

export const getOfiHomeOrderList = createSelector(
    getOfiHomeOrders,
    (state: HomeOrders): Array<any> => {
        return state.orderList
    }
);
