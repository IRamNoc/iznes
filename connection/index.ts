import { combineReducers, Reducer } from 'redux';
import { MyConnectionState } from './my-connections/model';
import { MyConnectionReducer } from './my-connections/reducer';
import {
    CREATE_CONNECTION,
    GET_CONNECTIONS,
    SET_REQUESTED_CONNECTIONS,
    setRequestedConnections
} from './my-connections/actions';

export { GET_CONNECTIONS, CREATE_CONNECTION, SET_REQUESTED_CONNECTIONS, setRequestedConnections };

export interface ConnectionState {
    myConnections: MyConnectionState;
}

export const ConnectionReducer: Reducer<ConnectionState> = combineReducers<ConnectionState>({
    myConnection: MyConnectionReducer,
});
