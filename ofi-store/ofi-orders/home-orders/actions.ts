import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set the order list.
 */
export const OFI_SET_HOME_ORDER_LIST = `${name}/OFI_SET_HOME_ORDER_LIST`;

/**
 * Set the order buffer
 */
export const OFI_SET_HOME_ORDER_BUFFER = `${name}/OFI_SET_HOME_ORDER_BUFFER`;

/**
 * Reset the order buffer.
 */
export const OFI_RESET_HOME_ORDER_BUFFER = `${name}/OFI_RESET_HOME_ORDER_BUFFER`;

/**
 * Set the order filter
 */
export const OFI_SET_HOME_ORDER_FILTER = `${name}/OFI_SET_HOME_ORDER_FILTER`;

/**
 * Reset the order filter.
 */
export const OFI_RESET_HOME_ORDER_FILTER = `${name}/OFI_RESET_HOME_ORDER_FILTER`;

/**
 * Set (Set to true) request home order list state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_HOME_ORDER = `${name}/OFI_SET_REQUESTED_HOME_ORDER`;
export const ofiSetRequestedHomeOrder = kAction(OFI_SET_REQUESTED_HOME_ORDER);


/**
 * Clear (set to false) request home order list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const OFI_CLEAR_REQUESTED_HOME_ORDER = `${name}/OFI_CLEAR_REQUESTED_HOME_ORDER`;
export const ofiClearRequestedHomeOrder = kAction(OFI_CLEAR_REQUESTED_HOME_ORDER);

