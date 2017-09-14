import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 *  Set walletNode list
 */
export const SET_WALLET_NODE_LIST = `${name}/SET_WALLET_NODE_LIST `;

/**
 * Set (Set to true) request wallet node list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_WALLET_NODE_LIST = `${name}/SET_REQUESTED_WALLET_NODE_LIST `;
export const setRequestedWalletNodeList = kAction(SET_REQUESTED_WALLET_NODE_LIST);


/**
 * Clear (set to false) request wallet node list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_WALLET_NODE_LIST = `${name}/CLEAR_REQUESTED_WALLET_NODE_LIST`;
export const clearRequestedWalletNodeList = kAction(CLEAR_REQUESTED_WALLET_NODE_LIST);

