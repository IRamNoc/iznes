import { combineReducers, Reducer } from 'redux';
import { MyConnectionState } from './my-connections/model';
import { CREATE_CONNECTION, GET_CONNECTIONS } from './my-connections/actions';
import { MyConnectionReducer } from './my-connections/reducer';

export { GET_CONNECTIONS, CREATE_CONNECTION };

export interface ConnectionState {
    myConnections: MyConnectionState;
}

export const ConnectionReducer: Reducer<ConnectionState> = combineReducers<ConnectionState>({
    myConnection: MyConnectionReducer,
});
