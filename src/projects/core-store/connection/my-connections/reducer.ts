import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as ConnectionActions from './actions';
import {MyConnectionState} from './model';

const initialState: MyConnectionState = {
    requestedFromConnectionList: false,
    requestedToConnectionList: false,
    fromConnectionList: [],
    toConnectionList: [],
};

/**
 * Get the "from" connections
 * @param state
 * @param action
 */
function handleSetFromConnectionList(state, action) {
    const response = action.payload[1].Data;
    let fromConnectionList = [];

    response.map((connection) => {
        const data = {
            leiId: connection.LeiID,
            leiSender: connection.LeiSender,
            keyDetail: connection.keyDetail,
            connectionId: connection.connectionID,
            status: connection.status,
        };

        fromConnectionList.push(data);
    });

    return Object.assign({}, state, { fromConnectionList });
}

/**
 * Get the "to" connections
 * @param state
 * @param action
 */
function handleSetToConnectionList(state, action) {
    const response = action.payload[1].Data;
    let toConnectionList = [];

    response.map((connection) => {
        const data = {
            leiId: connection.LeiID,
            leiSender: connection.LeiSender,
            keyDetail: connection.keyDetail,
            connectionId: connection.connectionID,
            status: connection.status,
        };

        toConnectionList.push(data);
    });

    return Object.assign({}, state, { toConnectionList });
}

/**
 * Set the "requestedFromConnectionList" flag to true
 * @param state
 * @returns {{} & any & {requestedFromConnectionList: boolean}}
 */
function handleSetRequestedFromConnections(state) {
    const requestedFromConnectionList = true;

    return Object.assign({}, state, { requestedFromConnectionList });
}

/**
 * Set the "requestedFromConnectionList" flag to false
 *
 * @param state
 * @returns {{} & any & {requestedFromConnectionList: boolean}}
 */
function handleClearRequestedFromConnections(state) {
    const requestedFromConnectionList = false;

    return Object.assign({}, state, { requestedFromConnectionList });
}

/**
 * Set the "requestedToConnectionList" flag to true
 * @param state
 * @returns {{} & any & {requestedToConnectionList: boolean}}
 */
function handleSetRequestedToConnections(state) {
    const requestedToConnectionList = true;

    return Object.assign({}, state, { requestedToConnectionList });
}

/**
 * Set the "requestedToConnectionList" flag to false
 *
 * @param state
 * @returns {{} & any & {requestedToConnectionList: boolean}}
 */
function handleClearRequestedToConnections(state) {
    const requestedToConnectionList = false;

    return Object.assign({}, state, { requestedToConnectionList });
}

export const MyConnectionReducer = (state: MyConnectionState = initialState, action: AsyncTaskResponseAction): MyConnectionState => {
    switch (action.type) {
        case ConnectionActions.SET_FROM_CONNECTION_LIST:
            return handleSetFromConnectionList(state, action);

        case ConnectionActions.SET_TO_CONNECTION_LIST:
            return handleSetToConnectionList(state, action);

        case ConnectionActions.SET_REQUESTED_FROM_CONNECTIONS:
            return handleSetRequestedFromConnections(state);

        case ConnectionActions.CLEAR_REQUESTED_FROM_CONNECTIONS:
            return handleClearRequestedFromConnections(state);

        case ConnectionActions.SET_REQUESTED_TO_CONNECTIONS:
            return handleSetRequestedToConnections(state);

        case ConnectionActions.CLEAR_REQUESTED_TO_CONNECTIONS:
            return handleClearRequestedToConnections(state);

        default:
            return state;
    }
};


