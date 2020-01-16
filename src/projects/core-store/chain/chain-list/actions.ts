import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Common, SagaHelper} from '@setl/utils';

/**
 * Set Management Company
 * @type {string}
 */
export const SET_CHAINS_LIST = `${name}/SET_CHAINS_LIST`;

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_CHAIN = `${name}/SET_REQUESTED_CHAIN`;
export const setRequestedChain = kAction(SET_REQUESTED_CHAIN);


/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_CHAIN = `${name}/CLEAR_REQUESTED_CHAIN`;
export const clearRequestedChain = kAction(CLEAR_REQUESTED_CHAIN);


