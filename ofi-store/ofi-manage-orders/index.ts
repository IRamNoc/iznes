import {combineReducers, Reducer} from 'redux';

/* Order List */
import {
    Orders,
    OfiOrderListReducer
} from './orders'
export {
    OFI_SET_ORDER_LIST,
    getOfiOrderList
} from './orders';

export interface OfiManageOrdersState {
    manageOrders: Orders
}

export const OfiManageOrdersReducer: Reducer<OfiManageOrdersState> = combineReducers<OfiManageOrdersState>({
    manageOrders: OfiOrderListReducer,
});
