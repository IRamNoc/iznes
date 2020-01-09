import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set (Set to true) request all instrument state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_ALL_INSTRUMENTS = `${name}/SET_REQUESTED_ALL_INSTRUMENTS`;
export const setRequesteAllInstruments = kAction(SET_REQUESTED_ALL_INSTRUMENTS);


/**
 * Clear (set to false) request all instrument state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_ALL_INSTRUMENTS = `${name}/CLEAR_REQUESTED_ALL_INSTRUMENTS`;
export const clearRequestedAllInstruments = kAction(CLEAR_REQUESTED_ALL_INSTRUMENTS);

/**
 *  Set all instrument list
 */
export const SET_ALL_INSTRUMENTS_LIST = `${name}/SET_ALL_INSTRUMENTS_LIST`;
