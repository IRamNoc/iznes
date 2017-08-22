import {AsyncTaskResponseAction} from '@setl/utils/SagaHelper/actions';
import * as MyMessageActions from './actions';
import {MyMessagesState, MessageDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyMessagesState = {
    messageList: []
};


export const MyMessagesReducer = function (state: MyMessagesState = initialState,
                                           action: AsyncTaskResponseAction) {
    switch (action.type) {
        case MyMessageActions.SET_MESSAGE_LIST:
            const messageData = _.get(action, 'payload[1].Data', []);

            console.log(messageData[0]);

            const messageList = formatMessagesDataResponse(messageData);

            const newState = Object.assign({}, state, {
                messageList
            });

            // console.log(action);
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

            const formattedDetail = {
                mailId: thisMessageDetail.get('mailID'),
                senderId: thisMessageDetail.get('creatorID'),
                senderPub: thisMessageDetail.get('senderPub'),
                subject: thisMessageDetail.get('subject'),
                date: thisMessageDetail.get('mailDate'),
                isActive: thisMessageDetail.get('isActive'),
                isRead: thisMessageDetail.get('isRead'),
            };


            return formattedDetail;
        }
    );

    return messageDetailList.toJS();
}
