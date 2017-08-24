import {
    MyMessagesState,
    MyMessagesReducer,
    SET_MESSAGE_LIST,
    getMyMessagesList,
    DONE_RUN_DECRYPT,
    getNeedRunDecryptState,
    setDecryptedContent
} from './my-messages';

import {combineReducers, Reducer} from 'redux';

export {
    SET_MESSAGE_LIST, getMyMessagesList, DONE_RUN_DECRYPT, getNeedRunDecryptState, setDecryptedContent
};

export interface MessageState {
    myMessages: MyMessagesState;
}

export const messageReducer: Reducer<MessageState> = combineReducers<MessageState>({
    myMessages: MyMessagesReducer
});
