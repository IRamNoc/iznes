import {combineReducers, Reducer} from 'redux';
import {
    ManageOrders,
    OfiManageOrderListReducer,
} from './manage-orders';

export {
    ManageOrders,
    OfiManageOrderListReducer,
    OFI_SET_MANAGE_ORDER_LIST,
    ofiClearRequestedManageOrder,
    ofiSetRequestedManageOrder,
    ofiManageOrderActions,
} from './manage-orders';

export interface OfiOrdersState {
    manageOrders: ManageOrders;
}

export const OfiOrdersReducer: Reducer<OfiOrdersState> = combineReducers<OfiOrdersState>({
    manageOrders: OfiManageOrderListReducer,
});
