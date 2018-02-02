import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Action, ActionCreator} from 'redux';
import {OrderTab} from './model';

/**
 * Set the order list.
 */
export const OFI_SET_MY_ORDER_LIST = `${name}/OFI_SET_MY_ORDER_LIST`;

/**
 * Set (Set to true) request my order list state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_MY_ORDER = `${name}/OFI_SET_REQUESTED_MY_ORDER`;
export const ofiSetRequestedMyOrder = kAction(OFI_SET_REQUESTED_MY_ORDER);


/**
 * Clear (set to false) request my order list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const OFI_CLEAR_REQUESTED_MY_ORDER = `${name}/OFI_CLEAR_REQUESTED_MY_ORDER`;
export const ofiClearRequestedMyOrder = kAction(OFI_CLEAR_REQUESTED_MY_ORDER);

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
