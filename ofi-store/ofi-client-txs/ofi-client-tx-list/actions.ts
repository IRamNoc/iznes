import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 *  Set fund access my
 */
export const SET_CLIENT_TX_LIST = `${name}/SET_CLIENT_TX_LIST`;

/**
 * Set (Set to true) request wallet client tx list state.
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_CLIENT_TX_LIST = `${name}/SET_REQUESTED_CLIENT_TX_LIST`;
export const setRequestedClientTxList = kAction(SET_REQUESTED_CLIENT_TX_LIST);


/**
 * Clear (set to false) request wallet client tx list state.
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_CLIENT_TX_LIST = `${name}/CLEAR_REQUESTED_CLIENT_TX_LIST`;
export const clearRequestedClientTxList = kAction(CLEAR_REQUESTED_CLIENT_TX_LIST);
