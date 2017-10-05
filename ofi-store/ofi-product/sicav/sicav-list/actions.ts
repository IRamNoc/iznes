import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Common, SagaHelper} from '@setl/utils';

/**
 * Set Management Company
 * @type {string}
 */
export const SET_SICAV_LIST = `${name}/SET_SICAV_LIST`;

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_SICAV = `${name}/SET_REQUESTED_SICAV`;
export const setRequestedSicav = kAction(SET_REQUESTED_SICAV);


/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_SICAV = `${name}/CLEAR_REQUESTED_SICAV`;
export const clearRequestedSicav = kAction(CLEAR_REQUESTED_SICAV);


