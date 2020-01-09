import { name } from './__init__';
import { kAction } from '@setl/utils/common';

/**
 *  Set User Permission Areas
 */
export const SET_ACCOUNT_ADMIN_PERMISSION_AREAS = `${name}/SET_ACCOUNT_ADMIN_PERMISSION_AREAS`;

/**
 * Set (Set to true) request account list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS = `${name}/SET_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS`;
export const setRequestedAccountAdminPermissionAreas = kAction(SET_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS);

/**
 * Clear (set to false) request account list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS = `${name}/CLEAR_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS`;
export const clearRequestedAccountAdminPermissionAreas = kAction(CLEAR_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS);
