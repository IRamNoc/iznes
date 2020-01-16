import {
    Action,
    ActionCreator,
} from 'redux';

import {name} from './__init__';
import * as Common from '@setl/utils/common';
import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';

/**
 * Login request action
 */
export const LOGIN_REQUEST = `${name}/LOGIN_REQUEST`;
export const loginRequestAC = Common.kAction(LOGIN_REQUEST);

/**
 * Set user detail
 */
export const SET_LOGIN_DETAIL = `${name}/SET_LOGIN_DETAIL`;
export const setLoginDetai: ActionCreator<AsyncTaskResponseAction> = (payload) => ({
    type: SET_LOGIN_DETAIL,
    payload: payload
});

/**
 * Reset user detail
 *
 */
export const RESET_LOGIN_DETAIL = `${name}/RESET_LOGIN_DETAIL`;
export const resetLoginDetail: ActionCreator<AsyncTaskResponseAction> = (payload) => ({
    type: RESET_LOGIN_DETAIL,
    payload: payload
});

/**
 * Set User Details
 * @type {string}
 */
export const SET_USER_DETAILS = `${name}/SET_USER_DETAILS`;

