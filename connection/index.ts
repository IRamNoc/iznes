import {combineReducers, Reducer} from 'redux';
import {MyConnectionState} from './my-connections/model';
import {MyConnectionReducer} from './my-connections/reducer';
import {
    CLEAR_REQUESTED_CONNECTIONS, clearRequestedConnections, SET_CONNECTIONS_LIST, SET_REQUESTED_CONNECTIONS, setConnectionsList,
    setRequestedConnections
} from './my-connections/actions';

export {
    SET_CONNECTIONS_LIST,
    SET_REQUESTED_CONNECTIONS,
    CLEAR_REQUESTED_CONNECTIONS,
    setConnectionsList,
    setRequestedConnections,
    clearRequestedConnections
};

export interface ConnectionState {
    myConnections: MyConnectionState;
}

export const ConnectionReducer: Reducer<ConnectionState> = combineReducers<ConnectionState>({
    myConnection: MyConnectionReducer,
});
