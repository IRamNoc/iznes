import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {DecryptMessagesBody, RequestOwnMessagesBody} from './my-messages.service.model';


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
}
