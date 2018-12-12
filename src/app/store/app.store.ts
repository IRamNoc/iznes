import {
    createStore,
    Store,
    compose,
    StoreEnhancer,
    applyMiddleware,
} from 'redux';

import {
    AppState,
    rootReducer
} from './app.reducer';

import {SagaHelper} from '@setl/utils';
import createSagaMiddleware from 'redux-saga';

// Dev extension for monitor redux in browser dev tool.
const devtools: StoreEnhancer<AppState> =
    window['__REDUX_DEVTOOLS_EXTENSION__'] ?
        window['__REDUX_DEVTOOLS_EXTENSION__']() : f => f;

// Async Saga
const appSaga = SagaHelper.asyncTaskSaga;

/**
 * create saga middleware with saga
 * @type {SagaMiddleware<C>}
 */
const sagaMiddleware = createSagaMiddleware();

const composeMiddlewares = window['__REDUX_DEVTOOLS_EXTENSION__'] ? compose(
    devtools,
    applyMiddleware(SagaHelper.preSagaMiddleWare),
    applyMiddleware(sagaMiddleware),
    applyMiddleware(SagaHelper.postSagaMiddleWare)
) : compose(
    applyMiddleware(sagaMiddleware)
);

/**
 * Return store with middlewares
 * @return {Store<S>}
 */
export function createAppStore(): Store<any> {
    return createStore<any, any, any, any>(
        rootReducer,
        composeMiddlewares
    );
}

export {appSaga, sagaMiddleware};
