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
    window['devToolsExtension'] ?
        window['devToolsExtension']() : f => f;

// Async Saga
const appSaga = SagaHelper.asyncTaskSaga;

/**
 * create saga middleware with saga
 * @type {SagaMiddleware<C>}
 */
const sagaMiddleware = createSagaMiddleware();

const composeMiddlewares = window['devToolsExtension'] ? compose(
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
    return createStore<any>(
        rootReducer,
        composeMiddlewares
    );
}

export {appSaga, sagaMiddleware};
