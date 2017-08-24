import * as actions from './actions';
import {asyncTaskSaga, preSagaMiddleWare, postSagaMiddleWare} from './saga';

// Creates a task descriptor
const create = (fn) => {
    return {pipe: [fn]};
};

// Pipes task descriptors
const pipe = (...ds) => ds.reduce((piped, d) => {
    piped.pipe = piped.pipe.concat(d.pipe);
    return piped;
}, {pipe: []});

const runAsync = actions.runAsyncTask;
const runAsyncCallback = actions.runAsyncTaskCallback;

export
{
    actions,
    asyncTaskSaga,
    create,
    pipe,
    runAsync,
    runAsyncCallback,
    preSagaMiddleWare,
    postSagaMiddleWare
};


