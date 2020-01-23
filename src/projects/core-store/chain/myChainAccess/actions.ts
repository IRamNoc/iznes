import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set my chain access.
 */
export const SET_MY_CHAIN_ACCESS = `${name}/SET_MY_CHAIN_ACCESS`;

/**
 * Set (Set to true) request requested my chain access state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_MY_CHAIN_ACCESS = `${name}/SET_REQUESTED_MY_CHAIN_ACCESS`;
export const setRequestedMyChainAccess = kAction(SET_REQUESTED_MY_CHAIN_ACCESS);


/**
 * Clear (set to false) request my chain access state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_MY_CHAIN_ACCESS = `${name}/CLEAR_REQUESTED_MY_CHAIN_ACCESS`;
export const clearRequestedMyChainAccess = kAction(CLEAR_REQUESTED_MY_CHAIN_ACCESS);
