import { AsyncTaskResponseAction } from '@setl/utils/sagaHelper/actions';
import * as ConnectionActions from './actions';
import { MyConnectionState } from './model';

const initialState: MyConnectionState = {
    requestedConnections: false,
    connectionList: []
};

/**
 * Get existing connections
 * @param state
 * @param action
 */
function handleGetConnections(state, action) {
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

    return Object.assign({}, state, { connectionList });
}

/**
 * Set the "requestedConnections" flag to true
 * @param state
 * @returns {{} & any & {requestedConnections: boolean}}
 */
function handleSetRequestedConnections(state) {
    const requestedConnections = true;

    return Object.assign({}, state, { requestedConnections });
}

/**
 * Create a new connection
 *
 * @param state
 * @param action
 * @returns {{} & any & {walletId: any; connectionId: *}}
 */
function handleCreateConnection(state, action) {
    const response = action.payload[1].Data[0];

    const connection = {
        walletId: response.leiId,
        connectionId: response.leiSender,
    };

    return Object.assign({}, state, connection);
}

export const MyConnectionReducer = (state: MyConnectionState = initialState, action: AsyncTaskResponseAction) => {
    switch (action.type) {
        case ConnectionActions.GET_CONNECTIONS:
            return handleGetConnections(state, action);

        case ConnectionActions.CREATE_CONNECTION:
            return handleCreateConnection(state, action);

        case ConnectionActions.SET_REQUESTED_CONNECTIONS:
            return handleSetRequestedConnections(state);

        default:
            return state;
    }
};


