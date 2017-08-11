import {
    Action,
    ActionCreator,
} from 'redux';

import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';

const AsyncTaskResponseAction = SagaHelper.actions.AsyncTaskResponseAction;

/**
 * Login request action
 */
export const LOGIN_REQUEST = `${name}/LOGIN_REQUEST`;
export const loginRequestAC = Common.kAction(LOGIN_REQUEST);

/**
 * Login success action
 */
export const LOGIN_SUCCESS = `${name}/LOGIN_SUCCESS`;
export const loginSuccess: ActionCreator<SagaHelper.actions.AsyncTaskResponseAction> = (payload) => ({
    type: LOGIN_SUCCESS,
    payload: payload
});

/**
 * Login fail action
 *
 */
export const LOGIN_FAIL = `${name}/LOGIN_FAIL`;
export const loginFail: ActionCreator<SagaHelper.actions.AsyncTaskResponseAction> = (payload) => ({
    type: LOGIN_FAIL,
    payload: payload
});

