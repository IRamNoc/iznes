import { name } from './__init__';
import { kAction } from '@setl/utils/common';

/**
 *  Set User Users Audit
 */
export const SET_ACCOUNT_ADMIN_USERS_AUDIT = `${name}/SET_ACCOUNT_ADMIN_USERS_AUDIT`;

/**
 * Set (Set to true) request account list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT = `${name}/SET_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT`;
export const setRequestedAccountAdminUsersAudit = kAction(SET_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT);

/**
 * Clear (set to false) request account list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT = `${name}/CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT`;
export const clearRequestedAccountAdminUsersAudit = kAction(CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT);
