import {
    ActionCreator
} from 'redux';

import {name} from './__init__';
import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';

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
