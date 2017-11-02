import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 *  Set collective archive.
 */
export const SET_COLLECTIVE_ARCHIVE = `${name}/SET_COLLECTIVE_ARCHIVE`;

/**
 * Set (Set to true) request collective archive state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_COLLECTIVE_ARCHIVE = `${name}/SET_REQUESTED_COLLECTIVE_ARCHIVE`;
export const setRequestedCollectiveArchive = kAction(SET_REQUESTED_COLLECTIVE_ARCHIVE);


/**
 * Clear (set to false) request collective archive state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_COLLECTIVE_ARCHIVE = `${name}/CLEAR_REQUESTED_COLLECTIVE_ARCHIVE`;
export const clearRequestedCollectiveArchive = kAction(CLEAR_REQUESTED_COLLECTIVE_ARCHIVE);
