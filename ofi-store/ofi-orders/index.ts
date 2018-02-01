import {combineReducers, Reducer} from "redux";
/* Manage Orders */
import {ManageOrders, OfiManageOrderListReducer} from "./manage-orders";
/* My Orders */
import {MyOrders, OfiMyOrderListReducer} from "./my-orders";
/* Home Orders */
import {HomeOrders, OfiHomeOrderListReducer} from "./home-orders";
// Collective Archive
import {OfiCollectiveArchiveReducer, OfiCollectiveArchiveState} from "./collective-archive";

export {
    OFI_SET_MANAGE_ORDER_LIST,
    getOfiManageOrderList,
    ofiClearRequestedManageOrder,
    ofiSetRequestedManageOrder,
    ofiManageOrderActions
} from './manage-orders';


export {
    OFI_SET_MY_ORDER_LIST,
    getOfiMyOrderList,
    ofiClearRequestedMyOrder,
    ofiSetRequestedMyOrder,
    ofiMyOrderActions
} from './my-orders';


export {
    OFI_SET_HOME_ORDER_LIST,
    OFI_SET_HOME_ORDER_BUFFER,
    OFI_RESET_HOME_ORDER_BUFFER,
    OFI_SET_HOME_ORDER_FILTER,
    OFI_RESET_HOME_ORDER_FILTER,
    getOfiHomeOrderList,
    getOfiHomeOrderViewBuffer,
    getOfiHomeOrderViewFilter,
    ofiSetRequestedHomeOrder,
    ofiClearRequestedHomeOrder
} from './home-orders';


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
