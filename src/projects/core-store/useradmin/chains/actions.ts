import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 *  Set chain list
 */
export const SET_CHAIN_LIST = `${name}/SET_CHAIN_LIST`;

/**
 * Set (Set to true) request chain list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_CHAIN_LIST = `${name}/SET_REQUESTED_CHAIN_LIST`;
export const setRequestedChainList = kAction(SET_REQUESTED_CHAIN_LIST);


/**
 * Clear (set to false) request chain list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_CHAIN_LIST = `${name}/CLEAR_REQUESTED_CHAIN_LIST`;
export const clearRequestedChainList = kAction(CLEAR_REQUESTED_CHAIN_LIST);

