// import {createSelector} from 'reselect';
// import {OfiState} from '../../index';
// import {ManageOrders} from '.';
// import {OfiOrdersState} from '../index';
//
// const getOfi = (state): OfiState => {
//     return state.ofi
// };
//
// const getOfiOrders = createSelector(
//     getOfi,
//     (state: OfiState): OfiOrdersState => {
//         return state.ofiOrders
//     }
// );
//
// export const getOfiManageOrders = createSelector(
//     getOfiOrders,
//     (state: OfiOrdersState): ManageOrders => {
//         return state.manageOrders
//     }
// );
//
// export const getOfiManageOrderList = createSelector(
//     getOfiManageOrders,
//     (state: ManageOrders): Array<any> => {
//         return state.orderList
//     }
// );
