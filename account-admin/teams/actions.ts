import { name } from './__init__';
import { kAction } from '@setl/utils/common';

/**
 *  Set User Teams
 */
export const SET_ACCOUNT_ADMIN_TEAMS = `${name}/SET_ACCOUNT_ADMIN_TEAMS`;

/**
 * Set (Set to true) request account list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_ACCOUNT_ADMIN_TEAMS = `${name}/SET_REQUESTED_ACCOUNT_ADMIN_TEAMS `;
export const setRequestedAccountAdminTeams = kAction(SET_REQUESTED_ACCOUNT_ADMIN_TEAMS);

/**
 * Clear (set to false) request account list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS = `${name}/CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS  `;
export const clearRequestedAccountAdminTeams = kAction(CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS);
