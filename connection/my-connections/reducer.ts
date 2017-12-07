import { AsyncTaskResponseAction } from '@setl/utils/sagaHelper/actions';
import * as ConnectionActions from './actions';
import { MyConnectionState } from './model';

const initialState: MyConnectionState = {
    connectionList: []
};

const handleCreateConnection = (state, action) => {
    console.log('handleCreateConnection : ', state, action.payload);
};

export const MyConnectionReducer = (state: MyConnectionState = initialState, action: AsyncTaskResponseAction) => {
    switch (action.type) {
        case ConnectionActions.GET_CONNECTIONS:
            return state;

        case ConnectionActions.CREATE_CONNECTION:
            return this.handleCreateConnection(state, action);

        default:
            return state;
    }
};


