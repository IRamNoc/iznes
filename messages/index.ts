import {
    MyMessagesState,
    MyMessagesReducer,
    SET_MESSAGE_LIST,
    getMyMessagesList
} from './my-messages';

import {combineReducers, Reducer} from 'redux';

export {
    SET_MESSAGE_LIST, getMyMessagesList
};

export interface MessageState {
    myMessages: MyMessagesState;
}

export const messageReducer: Reducer<MessageState> = combineReducers<MessageState>({
    myMessages: MyMessagesReducer
});
