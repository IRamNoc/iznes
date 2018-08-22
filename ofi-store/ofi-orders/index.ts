import {combineReducers, Reducer} from 'redux';
import {
    ManageOrders,
    OfiManageOrderListReducer,
} from './manage-orders';
import {
    OfiCollectiveArchiveReducer,
    OfiCollectiveArchiveState,
} from './collective-archive';

export {
    ManageOrders,
    OfiManageOrderListReducer,
    OFI_SET_MANAGE_ORDER_LIST,
    ofiClearRequestedManageOrder,
    ofiSetRequestedManageOrder,
    ofiManageOrderActions,
} from './manage-orders';

export {
    OfiCollectiveArchiveReducer,
    OfiCollectiveArchiveState,
    SET_COLLECTIVE_ARCHIVE,
    setRequestedCollectiveArchive,
    clearRequestedCollectiveArchive,
} from './collective-archive';

export interface OfiOrdersState {
    manageOrders: ManageOrders;
    collectiveArchive: OfiCollectiveArchiveState;
}

export const OfiOrdersReducer: Reducer<OfiOrdersState> = combineReducers<OfiOrdersState>({
    manageOrders: OfiManageOrderListReducer,
    collectiveArchive: OfiCollectiveArchiveReducer
});
