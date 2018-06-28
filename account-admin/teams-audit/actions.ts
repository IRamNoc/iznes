import { name } from './__init__';
import { kAction } from '@setl/utils/common';

/**
 *  Set User Teams Audit
 */
export const SET_ACCOUNT_ADMIN_TEAMS_AUDIT = `${name}/SET_ACCOUNT_ADMIN_TEAMS_AUDIT`;

/**
 * Set (Set to true) request account list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT = `${name}/SET_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT`;
export const setRequestedAccountAdminTeamsAudit = kAction(SET_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT);

/**
 * Clear (set to false) request account list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT = `${name}/CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT`;
export const clearRequestedAccountAdminTeamsAudit = kAction(CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT);
