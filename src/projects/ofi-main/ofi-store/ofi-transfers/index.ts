import {combineReducers, Reducer} from 'redux';
import {
    ManageTransfers,
    OfiManageTransferListReducer,
} from './manage-transfers';

export {
    ManageTransfers,
    OfiManageTransferListReducer,
    OFI_SET_MANAGE_TRANSFER_LIST,
    ofiClearRequestedManageTransfer,
    ofiSetRequestedManageTransfer,
    ofiManageTransferActions,
} from './manage-transfers';

export interface OfiTransfersState {
    manageTransfers: ManageTransfers;
}

export const OfiTransfersReducer: Reducer<OfiTransfersState> = combineReducers<OfiTransfersState>({
    manageTransfers: OfiManageTransferListReducer,
});
