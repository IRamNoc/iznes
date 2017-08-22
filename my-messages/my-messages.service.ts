import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {DecryptMessagesBody, RequestOwnMessagesBody} from './my-messages.service.model';


@Injectable()
export class MyMessagesService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    requestOwnMessages(mailId, fromWalletId, toWalletId, sinceMessageId, pageCount, pageSize, arrangementId, arrangementStatus, isDraft, isDeleted, isAction, search): any {
        const messageBody: RequestOwnMessagesBody = {
            RequestName: 'email_get',
            token: this.memberSocketService.token,
            mailId: mailId,
            fromWalletId: fromWalletId,
            toWalletId: toWalletId,
            sinceMessageId: sinceMessageId,
            pageCount: pageCount,
            pageSize: pageSize,
            arrangementId: arrangementId,
            isDraft: isDraft,
            isDeleted: isDeleted,
            isAction: isAction,
            search: search,
            arrangementStatus: arrangementStatus,
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
