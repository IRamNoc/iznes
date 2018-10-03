import { ActionCreator } from 'redux';
import { kAction } from '@setl/utils/common';

import { name } from './__init__';
import { AsyncTaskResponseAction } from '@setl/utils/sagaHelper/actions';

/**
 * Set login authentication
 */
export const SET_AUTH_LOGIN_DETAIL = `${name}/SET_AUTH_LOGIN_DETAIL`;

/**
 * Reset login authentication
 */
export const RESET_AUTH_LOGIN_DETAIL = `${name}/RESET_AUTH_LOGIN_DETAIL`;

/**
 * Set New Password
 * @type {string}
 */
export const SET_NEW_PASSWORD = `${name}/SET_NEW_PASSWORD`;

/**
 * Set Must Change Password boolean flag
 * @type {string}
 */
export const CLEAR_MUST_CHANGE_PASSWORD = `${name}/CLEAR_MUST_CHANGE_PASSWORD`;

/**
 * Reset homepage back to /home for investors who are logged in when their kyc is accepted.
 * @type {string}
 */
export const RESET_HOMEPAGE = `${name}/RESET_HOMEPAGE`;
export const resetHomepage = kAction(RESET_HOMEPAGE);

/**
 * Update the two factor authentication flag.
 * @type {string}
 */
export const UPDATE_TWO_FACTOR = `${name}/UPDATE_TWO_FACTOR`;
