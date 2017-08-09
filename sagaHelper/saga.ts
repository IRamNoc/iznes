import {pipeP, identity} from 'ramda'
import {call, fork, put, take} from 'redux-saga/effects'
import {RUN_TASK} from './actions'

const runTask = async (descriptor, args) => {
    console.log('hit run task');
    const fn = pipeP(...descriptor.pipe)
    try {
        const result = await fn(...args)
        return {resolved: result}
    } catch (error) {
        return {rejected: error}
    }
}

function* doRunTask(successType, failureType, descriptor, args) {
    console.log('hit do run task');
    const {resolved, rejected} = yield call(runTask, descriptor, args)
    if (resolved) {
        yield put({type: successType, payload: resolved})
    } else {
        yield put({type: failureType, payload: rejected})
    }
}

function* watchRunTasks() {
    while (true) {
        console.log('hit watch');
        const {
            successType
            , failureType
            , descriptor
            , args
        } = yield take(RUN_TASK)
        yield fork(doRunTask, successType, failureType, descriptor, args)
    }
}

export default function*() {
    yield fork(watchRunTasks)
}
