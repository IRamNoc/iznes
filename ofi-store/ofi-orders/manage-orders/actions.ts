import { name } from './__init__';
import { kAction, kPayloadAction } from '@setl/utils/common';
import { Action, ActionCreator } from 'redux';
import { OrderTab } from './model';

/**
 * Set the order list.
 */
export const OFI_SET_MANAGE_ORDER_LIST = `${name}/OFI_SET_MANAGE_ORDER_LIST`;

/**
 * Set (Set to true) request manage order list state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_MANAGE_ORDER = `${name}/OFI_SET_REQUESTED_MANAGE_ORDER`;
export const ofiSetRequestedManageOrder = kAction(OFI_SET_REQUESTED_MANAGE_ORDER);

/**
 * Clear (set to false) request manage order list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const OFI_CLEAR_REQUESTED_MANAGE_ORDER = `${name}/OFI_CLEAR_REQUESTED_MANAGE_ORDER`;
export const ofiClearRequestedManageOrder = kAction(OFI_CLEAR_REQUESTED_MANAGE_ORDER);

export const OFI_UPDATE_ORDER = `${name}/OFI_UPDATE_ORDER`;
export const ofiUpdateOrder = data => kPayloadAction(OFI_UPDATE_ORDER, data)();

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
    tabs: Array<OrderTab>;
}

export const setAllTabs: ActionCreator<SetAllTab> = (tabs: Array<OrderTab>) => (
    {
        type: SET_ALL_TABS,
        tabs
    }
);

export const OFI_SET_ORDERS_FILTERS = `${name}/OFI_SET_ORDERS_FILTERS`;
export const OFI_CLEAR_ORDERS_FILTERS = `${name}/OFI_SET_ORDERS_FILTERS`;
export const ofiSetOrdersFilters = kAction(OFI_SET_ORDERS_FILTERS);
export const ofiClearOrdersFilters = kAction(OFI_SET_ORDERS_FILTERS);
