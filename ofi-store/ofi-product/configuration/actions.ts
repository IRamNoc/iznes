import { name } from './__init__';
import { kAction } from '@setl/utils/common';

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_CONFIGURATION = `${name}/SET_REQUESTED_CONFIGURATION`;
export const setRequestedConfiguration = kAction(SET_REQUESTED_CONFIGURATION);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_CONFIGURATION = `${name}/CLEAR_REQUESTED_CONFIGURATION`;
export const clearRequestedConfiguration = kAction(CLEAR_REQUESTED_CONFIGURATION);

/**
 *  Set product config
 */
export const SET_PRODUCT_CONFIGURATION = `${name}/SET_PRODUCT_CONFIGURATION`;
