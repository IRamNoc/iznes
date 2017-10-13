import {combineReducers, Reducer} from 'redux';

/* Manage Orders */
import {
    ManageOrders,
    OfiManageOrderListReducer,
} from './manage-orders'
export {
    OFI_SET_MANAGE_ORDER_LIST,
    getOfiManageOrderList,
} from './manage-orders';

/* My Orders */
import {
    MyOrders,
    OfiMyOrderListReducer,
} from './my-orders'
export {
    OFI_SET_MY_ORDER_LIST,
    getOfiMyOrderList,
} from './my-orders';

export interface OfiOrdersState {
    manageOrders: ManageOrders;
    myOrders: MyOrders;
}

export const OfiOrdersReducer: Reducer<OfiOrdersState> = combineReducers<OfiOrdersState>({
    manageOrders: OfiManageOrderListReducer,
    myOrders: OfiMyOrderListReducer,
});
