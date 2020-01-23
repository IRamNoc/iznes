import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Common, SagaHelper} from '@setl/utils';

/**
 * Set Highlight Elmt List
 * @type {string}
 */
export const SET_HIGHLIGHT_LIST = `${name}/SET_HIGHLIGHT_LIST`;

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_APPLIED_HIGHLIGHT = `${name}/SET_APPLIED_HIGHLIGHT`;
export const setAppliedHighlight = kAction(SET_APPLIED_HIGHLIGHT);


/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_APPLIED_HIGHLIGHT = `${name}/CLEAR_APPLIED_HIGHLIGHT`;
export const clearAppliedHighlight = kAction(CLEAR_APPLIED_HIGHLIGHT);


