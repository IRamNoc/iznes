import {pipeP, identity} from 'ramda';
import {call, fork, put, take} from 'redux-saga/effects';
import {RUN_ASYNC_TASK} from './actions';


/**
 * Convert standard Redux action to @angular-redux/store specific action.
 * @param action: standard Redux action.
 * @return {{}&{action: {}, type: string, timestamp: number}&{action: any}}: @angular-redux/store action.
 *
 * Standard Redux action:
 * {
 *      type: string,
 *      other?...
 * }
 *
 * @angular-redux/store action.
 * {
 *      type: 'PERFORM_ACTION',
 *      timestamp: number (milliseconds)
 *      action: {
 *                  type: string,
 *                  other?...
 *              }
 * }
 */
function toNgReduxStoreAction(action) {
    const timeNow = Math.floor(Date.now() / 1);
    const anAction = Object.assign({}, {action: {}, type: 'PERFORM_ACTION', timestamp: timeNow}, {action: action});
    return anAction;
}

/**
 * Convert @angular-redux/store action to standard Redux action.
 * @param action
 */
function toStandardReduxAction(action) {
    return action.action;
}

/**
 * Common asynchronous task runner.
 * Normally for async call.
 *
 * @param descriptor: In essence is function definition.
 * @param args: Arguments that pass into the descriptor.
 * @return {Promise<any>} Return the result in synchronous fashion( Still asynchronous).
 */
const runAsyncTask = async (descriptor, args) => {
    const fn = pipeP(...descriptor.pipe);
    try {
        const result = await fn(...args);
        return {resolved: result};
    } catch (error) {
        return {rejected: error};
    }
}

/**
 * Handle a asynchronous task and dispatch success/failure action depend on the result.
 *
 * @param successTypes: List of action type when call is success.
 * @param failureTypes: List of action type when call is failt.
 * @param descriptor: Async call to make.
 * @param args: Arguments for the async call.
 * @param successCallback: callback on successful.
 * @param failureCallback: callback on failure.
 */
function* doRunAsyncTask(successTypes, failureTypes, descriptor, args, successCallback, failureCallback) {
    const {resolved, rejected} = yield call(runAsyncTask, descriptor, args)
    if (resolved) {
        for (const successType of successTypes) {
            yield put({type: successType, payload: resolved});

        }

        successCallback(resolved);
    } else {
        for (const failureType of failureTypes) {
            yield put({type: failureType, payload: rejected});
        }
        failureCallback(rejected);
    }
}

/**
 * Redux-saga watcher for:
 * Watch all our async call task
 */
function* watchRunAsyncTasks() {
    while (true) {

        const {
            successTypes
            , failureTypes
            , descriptor
            , args
            , successCallback
            , failureCallback
        } = yield take(RUN_ASYNC_TASK);

        yield fork(doRunAsyncTask, successTypes, failureTypes, descriptor, args, successCallback, failureCallback);

    }
}

/******************************************************************************************************************
 *
 * Exports
 *
 *****************************************************************************************************************/

/**
 * Saga for async task
 */
export function* asyncTaskSaga() {
    yield fork(watchRunAsyncTasks);
}

/**
 * Convert the @angular-redux/store action to standard Redux action when the come into saga middleware,
 * So saga middleware can handle the actions as normal.
 *
 * This middleware should be apply before all saga middlewares (Might be some other middleware as well).
 *
 * @param store
 * @return new Store
 */
export const preSagaMiddleWare = store => next => action => {
    return next(toStandardReduxAction(action));
};

/**
 * Convert the standard Redux action to @angular-redux/store action. So @angular-redux/store and handle action
 * as normal.
 *
 * The middleware should be apply after all saga middlewares (Might be some other middleware as well).
 *
 * @param store
 * @return new store
 */
export const postSagaMiddleWare = store => next => action => {
    return next(toNgReduxStoreAction(action));
};
