import { name } from './__init__';
import { kAction } from '@setl/utils/common';

/**
 *  Set User Types
 */
export const SET_USER_TYPES = `${name}/SET_USER_TYPES`;

/**
 * Set (Set to true) request account list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_USER_TYPES = `${name}/SET_REQUESTED_USER_TYPES`;
export const setRequestedUserTypes = kAction(SET_REQUESTED_USER_TYPES);

/**
 * Clear (set to false) request account list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_USER_TYPES = `${name}/CLEAR_REQUESTED_USER_TYPES`;
export const clearRequestedUserTypes = kAction(CLEAR_REQUESTED_USER_TYPES);
