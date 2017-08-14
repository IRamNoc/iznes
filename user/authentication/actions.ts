import {
    ActionCreator
} from 'redux';

import {name} from './__init__';
import {AsyncTaskResponseAction} from '@setl/utils/SagaHelper/actions';

/**
 * Set login authentication
 */
export const SET_AUTH_LOGIN_DETAIL = `${name}/SET_AUTH_LOGIN_DETAIL`;

/**
 * Reset login authentication
 */
export const RESET_AUTH_LOGIN_DETAIL = `${name}/RESET_AUTH_LOGIN_DETAIL`;

