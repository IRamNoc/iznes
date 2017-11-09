import {combineReducers, Reducer} from 'redux';

/* Manage Orders */
import {
    ManageOrders,
    OfiManageOrderListReducer,
} from './manage-orders';

export {
    OFI_SET_MANAGE_ORDER_LIST,
    getOfiManageOrderList,
    ofiClearRequestedManageOrder,
    ofiSetRequestedManageOrder
} from './manage-orders';

/* My Orders */
import {
    MyOrders,
    OfiMyOrderListReducer,
} from './my-orders';

export {
    OFI_SET_MY_ORDER_LIST,
    getOfiMyOrderList,
    ofiClearRequestedMyOrder,
    ofiSetRequestedMyOrder
} from './my-orders';

/* Home Orders */
import {
    HomeOrders,
    OfiHomeOrderListReducer,
} from './home-orders';

export {
    OFI_SET_HOME_ORDER_LIST,
    OFI_SET_HOME_ORDER_BUFFER,
    OFI_RESET_HOME_ORDER_BUFFER,
    OFI_SET_HOME_ORDER_FILTER,
    OFI_RESET_HOME_ORDER_FILTER,
    getOfiHomeOrderList,
    getOfiHomeOrderViewBuffer,
    ofiSetRequestedHomeOrder,
    ofiClearRequestedHomeOrder
} from './home-orders';

// Collective Archive
import {
    OfiCollectiveArchiveState,
    OfiCollectiveArchiveReducer
} from './collective-archive';

export {
    SET_COLLECTIVE_ARCHIVE,
    setRequestedCollectiveArchive,
    clearRequestedCollectiveArchive
} from './collective-archive';

export interface OfiOrdersState {
    manageOrders: ManageOrders;
    myOrders: MyOrders;
    homeOrders: HomeOrders;
    collectiveArchive: OfiCollectiveArchiveState;
}

export const OfiOrdersReducer: Reducer<OfiOrdersState> = combineReducers<OfiOrdersState>({
    manageOrders: OfiManageOrderListReducer,
    myOrders: OfiMyOrderListReducer,
    homeOrders: OfiHomeOrderListReducer,
    collectiveArchive: OfiCollectiveArchiveReducer
});
