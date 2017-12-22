import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as ConnectionActions from './actions';
import {MyConnectionState} from './model';

const initialState: MyConnectionState = {
    requestedConnections: false,
    connectionList: []
};

/**
 * Get existing connections
 * @param state
 * @param action
 */
function handleSetConnectionList(state, action) {
    let connectionList = [];
    const response = action.payload[1].Data;

    response.map((connection) => {
        const data = {
            leiId: connection.LeiID,
            leiSender: connection.LeiSender,
            keyDetail: connection.keyDetail,
            connectionId: connection.connectionID,
            status: connection.status === '1',
        };

        connectionList.push(data);
    });

    return Object.assign({}, state, {connectionList});
}

/**
 * Set the "requestedConnections" flag to true
 * @param state
 * @returns {{} & any & {requestedConnections: boolean}}
 */
function handleSetRequestedConnections(state) {
    const requestedConnections = true;

    return Object.assign({}, state, {requestedConnections});
}

/**
 * Set the "requestedConnections" flag to false
 *
 * @param state
 * @returns {{} & any & {requestedConnections: boolean}}
 */
function handleClearRequestedConnections(state) {
    const requestedConnections = false;

    return Object.assign({}, state, {requestedConnections});
}

//
export const MyConnectionReducer = (state: MyConnectionState = initialState, action: AsyncTaskResponseAction) => {
    switch (action.type) {
        case ConnectionActions.SET_CONNECTIONS_LIST:
            return handleSetConnectionList(state, action);

        case ConnectionActions.SET_REQUESTED_CONNECTIONS:
            return handleSetRequestedConnections(state);

        case ConnectionActions.CLEAR_REQUESTED_CONNECTIONS:
            return handleClearRequestedConnections(state);

        default:
            return state;
    }
};


