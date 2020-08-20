import { name } from './__init__';
import { kAction, kPayloadAction } from '@setl/utils/common';
import { Action, ActionCreator } from 'redux';
import { TransferTab } from './model';

/**
 * Set the order list.
 */
export const OFI_SET_MANAGE_TRANSFER_LIST = `${name}/OFI_SET_MANAGE_TRANSFER_LIST`;

/**
 * Set (Set to true) request manage order list state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_MANAGE_TRANSFER = `${name}/OFI_SET_REQUESTED_MANAGE_TRANSFER`;
export const ofiSetRequestedManageTransfer = kAction(OFI_SET_REQUESTED_MANAGE_TRANSFER);

/**
 * Clear (set to false) request manage order list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const OFI_CLEAR_REQUESTED_MANAGE_TRANSFER = `${name}/OFI_CLEAR_REQUESTED_MANAGE_TRANSFER`;
export const ofiClearRequestedManageTransfer = kAction(OFI_CLEAR_REQUESTED_MANAGE_TRANSFER);

export const OFI_UPDATE_TRANSFER = `${name}/OFI_UPDATE_TRANSFER`;
export const ofiUpdateTransfer = data => kPayloadAction(OFI_UPDATE_TRANSFER, data)();

export const SET_CURRENT_PAGE = `${name}/SET_CURRENT_PAGE`;
export const setCurrentPage = number => kPayloadAction(SET_CURRENT_PAGE, { number })();

export const SET_TOTAL_RESULTS = `${name}/SET_TOTAL_RESULTS`;
export const setTotalResults = results => kPayloadAction(SET_TOTAL_RESULTS, { results })();

export const resetTotalResults = () => setTotalResults(0);

export const INCREMENT_TOTAL_RESULTS = `${name}/INCREMENT_TOTAL_RESULTS`;
export const incrementTotalResults = kAction(INCREMENT_TOTAL_RESULTS);

// update tabs
export const SET_ALL_TABS = `${name}/SET_ALL_TABS`;

export interface SetAllTab extends Action {
    tabs: Array<TransferTab>;
}

export const setAllTabs: ActionCreator<SetAllTab> = (tabs: Array<TransferTab>) => (
{
    type: SET_ALL_TABS,
    tabs,
}
);

export const OFI_SET_TRANSFERS_FILTERS = `${name}/OFI_SET_TRANSFERS_FILTERS`;
export const OFI_CLEAR_TRANSFERS_FILTERS = `${name}/OFI_CLEAR_TRANSFERS_FILTERS`;
export const ofiSetTransfersFilters = kAction(OFI_SET_TRANSFERS_FILTERS);
export const ofiClearTransferesFilters = kAction(OFI_CLEAR_TRANSFERS_FILTERS);
