import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';
import {kAction} from '@setl/utils/common';

export const SET_WALLET_HOLDING = `${name}/SET_WALLET_HOLDING`;
export const SET_ISSUE_HOLDING = `${name}/SET_ISSUE_HOLDING`;

/**
 * Set (Set to true) request wallet holding state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_WALLET_HOLDING = `${name}/SET_REQUESTED_WALLET_HOLDING`;
export const setRequestedWalletHolding = kAction(SET_REQUESTED_WALLET_HOLDING);

/**
 * Clear (set to false) request wallet holding state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_WALLET_HOLDING = `${name}/CLEAR_REQUESTED_WALLET_HOLDING`;
export const clearRequestedWalletHolding = kAction(CLEAR_REQUESTED_WALLET_HOLDING);

/**
 * Set (Set to true) request all wallet holding state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_ALL_WALLET_HOLDING = `${name}/SET_REQUESTED_ALL_WALLET_HOLDING`;
export const setRequestedAllWalletHolding = kAction(SET_REQUESTED_ALL_WALLET_HOLDING);

/**
 * Clear (set to false) request all wallet holding state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_ALL_WALLET_HOLDING = `${name}/CLEAR_REQUESTED_ALL_WALLET_HOLDING`;
export const clearRequestedAllWalletHolding = kAction(CLEAR_REQUESTED_ALL_WALLET_HOLDING);




