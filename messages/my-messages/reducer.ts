import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyMessageActions from './actions';
import {MyMessagesState, MessageDetail} from './model';
import {SagaHelper, Common} from '@setl/utils';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyMessagesState = {
    messageList: [],
    needRunDecrypt: false
};

export const MyMessagesReducer = function (state: MyMessagesState = initialState,
                                           action) {

    let newState;
    let needRunDecrypt;
    let messageList;

    switch (action.type) {
        case MyMessageActions.SET_MESSAGE_LIST:
            const messageData = _.get(action, 'payload[1].Data', []);

            console.log(messageData[0]);

            messageList = formatMessagesDataResponse(messageData);

            needRunDecrypt = true;

            newState = Object.assign({}, state, {
                messageList,
                needRunDecrypt
            });

            // console.log(action);
            return newState;

        case MyMessageActions.DONE_RUN_DECRYPT:

            needRunDecrypt = false;
            newState = Object.assign({}, state, {
                needRunDecrypt
            });
            return newState;

        case MyMessageActions.SET_DECRYPTED_CONTENT:
            const currentMessageList = state.messageList;
            const thisMailId = action['mailId'];

            const newContent = action['decrypted'][1]['Data'];
            messageList = updateDecryptedMessage(currentMessageList, thisMailId, newContent);

            newState = Object.assign({}, state, {
                messageList
            });

            return newState;


        default:
            return state;
    }
};

function formatMessagesDataResponse(rawMessagesData: Array<any>): Array<MessageDetail> {

    const rawMessagesDataList = fromJS(rawMessagesData);
    let messageDetailList = List<MessageDetail>();

    messageDetailList = rawMessagesDataList.map(
        function (thisMessageDetail) {
            let subject, content;
            try {
                subject = window.atob(thisMessageDetail.get('subject'));
            } catch (e) {
                // something failed
                subject = thisMessageDetail.get('subject');
            }

            content = thisMessageDetail.get('mailBody');

            return {
                mailId: thisMessageDetail.get('mailID'),
                senderId: thisMessageDetail.get('creatorID'),
                senderPub: thisMessageDetail.get('creatorPub'),
                senderImg: thisMessageDetail.get('creatorPub'),
                recipientId: thisMessageDetail.get('receipientID'),
                recipientPub: thisMessageDetail.get('recipientPub'),
                recipientImg: thisMessageDetail.get('recipientPub'),
                subject: subject,
                date: thisMessageDetail.get('mailDate'),
                isActive: thisMessageDetail.get('isActive'),
                isRead: thisMessageDetail.get('isRead'),
                content: content,
                action: null
            };


        }
    );

    return messageDetailList.toJS();
}

function updateDecryptedMessage(rawMessagesData: Array<any>, mailId, newContent) {
    let messageDetailList;

    messageDetailList = rawMessagesData.map(
        (thisMessageDetail) => {

            const thisMailId = thisMessageDetail.mailId;

            if (thisMailId === mailId) {
                const decryptedObject = JSON.parse(newContent);
                const content = atob(decryptedObject.general);
                const action = decryptedObject.action;

                return Object.assign({}, thisMessageDetail, {
                    content, action
                });
            } else {
                return thisMessageDetail;
            }


            // let subject, content;
            // try {
            //     subject = window.atob(thisMessageDetail.get('subject'));
            // } catch (e) {
            //     // something failed
            //     subject = thisMessageDetail.get('subject');
            // }
            //
            // content = thisMessageDetail.get('mailBody');
            //
            // return {
            //     mailId: thisMessageDetail.get('mailID'),
            //     senderId: thisMessageDetail.get('creatorID'),
            //     senderPub: thisMessageDetail.get('creatorPub'),
            //     senderImg: thisMessageDetail.get('creatorPub'),
            //     recipientId: thisMessageDetail.get('receipientID'),
            //     recipientPub: thisMessageDetail.get('recipientPub'),
            //     recipientImg: thisMessageDetail.get('recipientPub'),
            //     subject: subject,
            //     date: thisMessageDetail.get('mailDate'),
            //     isActive: thisMessageDetail.get('isActive'),
            //     isRead: thisMessageDetail.get('isRead'),
            //     content: content,
            //     needDecrypt: true
            // };


        }
    );

    return messageDetailList;
}
