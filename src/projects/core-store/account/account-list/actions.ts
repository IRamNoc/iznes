import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 *  Set account list
 */
export const SET_ACCOUNT_LIST = `${name}/SET_ACCOUNT_LIST`;

/**
 * Set (Set to true) request account list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_ACCOUNT_LIST = `${name}/SET_REQUESTED_ACCOUNT_LIST `;
export const setRequestedAccountList = kAction(SET_REQUESTED_ACCOUNT_LIST);


/**
 * Clear (set to false) request account list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_ACCOUNT_LIST = `${name}/CLEAR_REQUESTED_ACCOUNT_LIST  `;
export const clearRequestedAccountList = kAction(CLEAR_REQUESTED_ACCOUNT_LIST);



