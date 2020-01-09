import { AsyncTaskResponseAction } from '@setl/utils/sagaHelper/actions';
import * as MyMessageActions from './actions';
import { MyMessagesState, MessageDetail } from './model';
import { SagaHelper, Common } from '@setl/utils';
import * as _ from 'lodash';
import { List, fromJS, Map } from 'immutable';
import { setDecryptedContent } from './actions';
import { commonHelper } from '@setl/utils';
import * as moment from 'moment-timezone';

const initialState: MyMessagesState = {
    messageList: [],
    needRunDecrypt: false,
    counts: [],
    requestMailInitial: true,
    requestMailList: true
};

export const MyMessagesReducer = function (state: MyMessagesState = initialState, action) {


    switch (action.type) {
    case MyMessageActions.SET_MESSAGE_LIST:
        return setMessageList(MyMessageActions.SET_MESSAGE_LIST, action, state);

    case MyMessageActions.DONE_RUN_DECRYPT:
        return decryptMessage(MyMessageActions.DONE_RUN_DECRYPT, action, state);

    case MyMessageActions.SET_DECRYPTED_CONTENT:
        return handleSetDecryptedContent(MyMessageActions.DONE_RUN_DECRYPT, action, state);

    case MyMessageActions.SET_MESSAGE_COUNTS:

        return handleMessageCounts(MyMessageActions.SET_MESSAGE_COUNTS, action, state);

    case MyMessageActions.SET_REQUEST_MAIL_INIT:
        return toggleRequestMailInit(MyMessageActions.SET_REQUEST_MAIL_INIT, action, state, true);

    case MyMessageActions.CLEAR_REQUEST_MAIL_INIT:
        return toggleRequestMailInit(MyMessageActions.CLEAR_REQUEST_MAIL_INIT, action, state, false);

    case MyMessageActions.SET_REQUEST_MAIL_LIST:
        return toggleRequestMailList(MyMessageActions.SET_REQUEST_MAIL_LIST, action, state, true);

    case MyMessageActions.CLEAR_REQUEST_MAIL_LIST:
        return toggleRequestMailList(MyMessageActions.CLEAR_REQUEST_MAIL_LIST, action, state, false);

    default:
        return state;
    }
};

/**
 * Set Message List
 *
 * @param actionType
 * @param action
 * @param state
 * @returns {any}
 */
function setMessageList(actionType, action, state) {
    let newState;
    let needRunDecrypt;
    let messageList;

    const messageData = _.get(action, 'payload[1].Data', []);

    messageList = formatMessagesDataResponse(messageData);
    needRunDecrypt = true;

    newState = Object.assign({}, state, {
        messageList,
        needRunDecrypt
    });

    return newState;
};

/**
 * Handle Message Counts
 *
 * @param actionType
 * @param action
 * @param state
 * @returns {any}
 */
function handleMessageCounts(actionType, action, state) {
    let newState;

    const messageData = _.get(action, 'payload[1].Data', [])[0];

    const counts = {
        inbox: messageData.numberOfInboxMails,
        sent: messageData.numberOfOutboxMails,
        inboxUnread: messageData.numberOfUnreadMails,
        draft: messageData.numberOfDraftMails,
        deleted: messageData.numberOfDeletedMails,
        action: messageData.numberOfUnreadActions,
        totalActions: messageData.numberOfTotalActions,
        unreadArrangement: messageData.numberofUnReadArrangementMsgs,
        totalArrangement: messageData.numberOfTotalArrangementMsgs,
    };

    newState = Object.assign({}, state, {
        counts
    });

    return newState;
};

/**
 * Decrypt Message
 *
 * @param actionType
 * @param action
 * @param state
 * @returns {any}
 */
function decryptMessage(actionType, action, state) {
    let newState;
    let needRunDecrypt;

    needRunDecrypt = false;
    newState = Object.assign({}, state, {
        needRunDecrypt
    });
    return newState;
}

/**
 * Toggle Request Mail Init Called
 *
 * @param actionType
 * @param action
 * @param state
 * @param toggle {true|false}
 *
 * @returns {any}
 */
function toggleRequestMailInit(actionType, action, state, toggle) {
    let newState;

    const requestMailInitial = toggle;
    newState = Object.assign({}, state, {
        requestMailInitial
    });
    return newState;
}

function toggleRequestMailList(actionType, action, state, toggle) {
    let newState;

    const requestMailList = toggle;
    newState = Object.assign({}, state, {
        requestMailList
    });
    return newState;
}

/**
 * Handle Decryption of Content
 *
 * @param actionType
 * @param action
 * @param state
 * @returns {any}
 */
function handleSetDecryptedContent(actionType, action, state) {
    let newState;
    let messageList;

    const currentMessageList = state.messageList;
    const thisMailId = action['mailId'];

    const newContent = action['decrypted'][1]['Data'].decryptedMessage;
    messageList = updateDecryptedMessage(currentMessageList, thisMailId, newContent);

    newState = Object.assign({}, state, {
        messageList
    });

    return newState;
}


function formatMessagesDataResponse(rawMessagesData: Array<any>): Array<MessageDetail> {

    const rawMessagesDataList = fromJS(rawMessagesData);
    let messageDetailList = List<MessageDetail>();

    messageDetailList = rawMessagesDataList.map(
        (thisMessageDetail) => {
            let subject;
            let content;
            try {
                subject = commonHelper.b64DecodeUnicode(thisMessageDetail.get('subject'));
            } catch (e) {
                // something failed
                subject = thisMessageDetail.get('subject');
            }

            content = thisMessageDetail.get('mailBody');
            const date = moment(
                `${thisMessageDetail.get('mailDate')} UTC+00:00`,
                'YYYY-MM-DD HH:mm:ss ZZ',
            )
            .tz(moment.tz.guess())
            .format('YYYY-MM-DD HH:mm:ss');

            return {
                mailId: thisMessageDetail.get('mailID'),
                senderId: thisMessageDetail.get('creatorID'),
                senderPub: thisMessageDetail.get('creatorPub'),
                senderImg: thisMessageDetail.get('creatorPub'),
                recipientId: thisMessageDetail.get('receipientID'),
                recipientPub: thisMessageDetail.get('recipientPub'),
                recipientImg: thisMessageDetail.get('recipientPub'),
                subject,
                date,
                isActive: thisMessageDetail.get('isActive'),
                isRead: thisMessageDetail.get('isRead'),
                isActed: thisMessageDetail.get('isActed'),
                content,
                action: { type: null },
                isDecrypted: false,
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
                let decryptedObject = JSON.parse(newContent);
                let content = commonHelper.b64DecodeUnicode(decryptedObject.general);
                let action = decryptedObject.action;
                const isDecrypted = true;

                if (content.substring(0, 11) === '{"general":') {
                    decryptedObject = JSON.parse(content);
                    content = commonHelper.b64DecodeUnicode(decryptedObject.general);
                    action = decryptedObject.action;
                }

                if (action == 'null') action = { type: null };

                return Object.assign({}, thisMessageDetail, {
                    content, action, isDecrypted
                });
            } else {
                return thisMessageDetail;
            }
        }
    );

    return messageDetailList;
}
