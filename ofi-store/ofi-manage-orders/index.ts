import {combineReducers, Reducer} from 'redux';

/* Order List */
import {
    OfiOrdersState,
    OfiOrderListReducer
} from './orders'
export {
    OFI_SET_ORDER_LIST,
    getOfiOrderList
} from './orders';

export interface OfiManageOrderState {
    ofiManageOrders: OfiOrdersState
}

export const OfiManageOrdersReducer: Reducer<OfiManageOrderState> = combineReducers<OfiManageOrderState>({
    ofiManageOrders: OfiOrderListReducer,
});
