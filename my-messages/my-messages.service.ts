import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {DecryptMessagesBody, RequestOwnMessagesBody, SendMessageBody, MailInitBody} from './my-messages.service.model';


@Injectable()
export class MyMessagesService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    requestOwnMessages(mailId, fromWalletId, toWalletId, pageCount, pageSize, arrangementId, arrangementStatus, isDeleted, isAction, search): any {
        const messageBody: RequestOwnMessagesBody = {
            RequestName: 'email_get',
            token: this.memberSocketService.token,
            mailId: mailId, // specific id
            fromWalletId: fromWalletId, // senders wallet id
            toWalletId: toWalletId, // recipents wallet id
            sinceMessageId: 0,
            pageCount: pageCount, // which page to load
            pageSize: pageSize, // how many message to load on that page
            arrangementId: arrangementId, // workflow id
            isDraft: 0,
            isDeleted: isDeleted,
            isAction: isAction,
            search: search, // search doesn't work?
            arrangementStatus: arrangementStatus, // workflow status
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    decryptMessage(walletId: string, bobPub: string, encryptedMessage: string): any {

        const messageBody: DecryptMessagesBody = {
            RequestName: 'email_decrypt',
            token: this.memberSocketService.token,
            walletId: walletId,
            bobPub: bobPub,
            encryptedMessage: encryptedMessage,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }


    sendMessage(subject, body, senderId, senderPub, recipients, parentId = 0, arrangementId = 0, arrangementStatus = 0, attachment = 0, hasAction = 0, isDraft = 0): any {
        const messageBody: SendMessageBody = {
            RequestName: 'email_send',
            token: this.memberSocketService.token,
            mailSubject: subject, // specific id
            mailBody: body, // senders wallet id
            senderId: senderId, // recipents wallet id
            senderPub: senderPub,
            recipients: recipients, // which page to load
            parentId: parentId, // how many message to load on that page
            arrangementId: arrangementId, // workflow id
            arrangementStatus: arrangementStatus,
            attachment: attachment,
            hasAction: hasAction,
            isDraft: isDraft
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }


    requestMailInit(walletId, search = '') {
        const messageBody: MailInitBody = {
            RequestName: 'mail_initial_connect',
            token: this.memberSocketService.token,
            walletId: walletId, // specific id
            search: search,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
