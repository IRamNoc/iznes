import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';
import {kAction} from '@setl/utils/common';

/**
 * Set wallet list
 */
export const SET_WALLET_ADDRESSES = `${name}/SET_WALLET_ADDRESSES`;

/**
 * Set (Set to true) request wallet address state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_WALLET_ADDRESSES = `${name}/SET_REQUESTED_WALLET_ADDRESSES`;
export const setRequestedWalletAddresses = kAction(SET_REQUESTED_WALLET_ADDRESSES);

/**
 * Clear (set to false) request wallet address state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_WALLET_ADDRESSES = `${name}/CLEAR_REQUESTED_WALLET_ADDRESSES`;
export const clearRequestedWalletAddresses = kAction(CLEAR_REQUESTED_WALLET_ADDRESSES);

