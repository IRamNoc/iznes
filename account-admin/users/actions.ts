import { name } from './__init__';
import { kAction } from '@setl/utils/common';

/**
 *  Set User Users
 */
export const SET_ACCOUNT_ADMIN_USERS = `${name}/SET_ACCOUNT_ADMIN_USERS`;

/**
 * Set (Set to true) request account list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_ACCOUNT_ADMIN_USERS = `${name}/SET_REQUESTED_ACCOUNT_ADMIN_USERS`;
export const setRequestedAccountAdminUsers = kAction(SET_REQUESTED_ACCOUNT_ADMIN_USERS);

/**
 * Clear (set to false) request account list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS = `${name}/CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS`;
export const clearRequestedAccountAdminUsers = kAction(CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS);
