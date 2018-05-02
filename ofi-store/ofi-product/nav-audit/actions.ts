import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_NAV_AUDIT = `${name}/SET_REQUESTED_NAV_AUDIT`;
export const setRequestedNavAudit = kAction(SET_REQUESTED_NAV_AUDIT);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_NAV_AUDIT = `${name}/CLEAR_REQUESTED_NAV_AUDIT`;
export const clearRequestedNavAudit = kAction(CLEAR_REQUESTED_NAV_AUDIT);

/**
 *  Set fund share audit
 */
export const SET_NAV_AUDIT = `${name}/SET_NAV_AUDIT`;
