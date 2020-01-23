import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_FUND_SHARE_AUDIT = `${name}/SET_REQUESTED_FUND_SHARE_AUDIT`;
export const setRequestedFundShareAudit = kAction(SET_REQUESTED_FUND_SHARE_AUDIT);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_FUND_SHARE_AUDIT = `${name}/CLEAR_REQUESTED_FUND_SHARE_AUDIT`;
export const clearRequestedFundShareAudit = kAction(CLEAR_REQUESTED_FUND_SHARE_AUDIT);

/**
 *  Set fund share audit
 */
export const SET_FUND_SHARE_AUDIT = `${name}/SET_FUND_SHARE_AUDIT`;
