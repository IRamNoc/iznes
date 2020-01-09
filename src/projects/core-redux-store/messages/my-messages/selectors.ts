import {createSelector} from 'reselect';
import {MessageState} from '../index';
import {MyMessagesState} from './index';

const getMessage = (state): MessageState => state.message;

export const getMyMessages = createSelector(
    getMessage,
    (state: MessageState) => state.myMessages
);

export const getMyMessagesList = createSelector(
    getMyMessages,
    (state: MyMessagesState) => state.messageList
);

export const getNeedRunDecryptState = createSelector(
    getMyMessages,
    (state: MyMessagesState) => state.needRunDecrypt
);


