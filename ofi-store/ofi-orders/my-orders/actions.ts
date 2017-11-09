import {name} from './__init__';
import {kAction} from '@setl/utils/common';

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
