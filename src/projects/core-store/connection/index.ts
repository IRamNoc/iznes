import { combineReducers, Reducer } from 'redux';
import { MyConnectionState } from './my-connections/model';
import { MyConnectionReducer } from './my-connections/reducer';
import {
    SET_FROM_CONNECTION_LIST,
    SET_TO_CONNECTION_LIST,
    SET_REQUESTED_FROM_CONNECTIONS,
    SET_REQUESTED_TO_CONNECTIONS,
    CLEAR_REQUESTED_FROM_CONNECTIONS,
    CLEAR_REQUESTED_TO_CONNECTIONS,
    setFromConnectionList,
    setToConnectionList,
    setRequestedFromConnections,
    setRequestedToConnections,
    clearRequestedFromConnections,
    clearRequestedToConnections,
} from './my-connections/actions';

export {
    SET_FROM_CONNECTION_LIST,
    SET_TO_CONNECTION_LIST,
    SET_REQUESTED_FROM_CONNECTIONS,
    SET_REQUESTED_TO_CONNECTIONS,
    CLEAR_REQUESTED_FROM_CONNECTIONS,
    CLEAR_REQUESTED_TO_CONNECTIONS,
    setFromConnectionList,
    setToConnectionList,
    setRequestedFromConnections,
    setRequestedToConnections,
    clearRequestedFromConnections,
    clearRequestedToConnections,
};

export interface ConnectionState {
    myConnections: MyConnectionState;
}

export const ConnectionReducer: Reducer<ConnectionState> = combineReducers<ConnectionState>({
    myConnections: MyConnectionReducer,
});
