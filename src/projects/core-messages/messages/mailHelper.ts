import { NgRedux } from '@angular-redux/store';
import { MyMessagesService } from '@setl/core-req-services/my-messages/my-messages.service';
import { SagaHelper, commonHelper } from '@setl/utils';
import {
    SET_MESSAGE_LIST,
    setDecryptedContent,
} from '@setl/core-store';
import { Injectable } from '@angular/core';

@Injectable()
export class MailHelper {
    public constructor(
        private ngRedux: NgRedux<any>,
        private myMessageService: MyMessagesService,
    ) {
    }

    public retrieveMessages(walletId, type = 'inbox', page = 0, pageSize = 15, search = null) {
        let isAction: boolean;
        let isDeleted: boolean;
        let isSent: boolean;
        switch (type) {
        case 'inbox':
            isAction = false;
            isDeleted = false;
            isSent = false;
            break;
        case 'action':
            isAction = true;
            isDeleted = false;
            isSent = false;
            break;
        case 'workflow':
            isAction = false;
            isDeleted = false;
            isSent = false;
            break;
        case 'sent':
            isAction = false;
            isDeleted = false;
            isSent = true;
            break;
        case 'deleted':
            isAction = false;
            isDeleted = true;
            isSent = false;
            break;
        }
        const requestIsAction = isAction === true ? 1 : 0;
        const requestIsDeleted = isDeleted === true ? 1 : 0;
        const fromWallet = isSent === true ? walletId : 0;
        const toWallet = isSent === true ? 0 : walletId;
        const asyncTaskPipe = this.myMessageService.requestOwnMessages(
            0,
            fromWallet,
            toWallet,
            page,
            pageSize,
            0,
            0,
            requestIsDeleted,
            requestIsAction,
            search,
        );
        this.ngRedux.dispatch(
            SagaHelper.runAsync(
                [SET_MESSAGE_LIST],
                [],
                asyncTaskPipe, {},
            ),
        );
    }

    /**
     * Decrypt Message
     *
     * @param {Object} message Message Object
     * @param {String} type    Message Type (e.g. sent)
     *
     * @return {Promise}
     */
    public decryptMessage(message, type = 'inbox') {
        let bobWalletId = message.recipientId;
        let alicePublicKey = message.senderPub;
        if (type === 'sent') {
            bobWalletId = message.senderId;
            alicePublicKey = message.recipientPub;
        }
        return new Promise((resolve, reject) => {
            const asyncTaskPipe = this.myMessageService.decryptMessage(
                bobWalletId,
                alicePublicKey,
                message.content,
            );
            this.ngRedux.dispatch(
                SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    (response) => {
                        this.ngRedux.dispatch(setDecryptedContent(message.mailId, response));
                        if (response.length === 3 && response[1].Data.decryptedMessage) {
                            let decoded;
                            try {
                                decoded = commonHelper.b64DecodeUnicode(response[1].Data.decryptedMessage);
                            } catch (e) {
                                decoded = response[1].Data.decryptedMessage;
                            }
                            decoded = JSON.parse(decoded);
                            message.action = decoded.action;
                            message.content = window.atob(decoded.general);
                            if (message.content.substring(0, 11) === '{"general":') {
                                decoded = JSON.parse(message.content);
                                message.action = decoded.action;
                                message.content = window.atob(decoded.general);
                            }
                            message.isDecrypted = true;
                            resolve(message);
                        }
                        reject();
                    },
                ),
            );
        });
    }

    public deleteMessage(walletId, message, deleteMessages) {
        const asyncTaskPipe = this.myMessageService.deleteMessage(
            walletId,
            [message.mailId],
            deleteMessages,
        );
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe, () => {}, () => {}));
    }

    public markMessageAsRead(walletId, mailId) {
        // Create a saga pipe.
        const asyncTaskPipe = this.myMessageService.markRead(
            walletId,
            [mailId],
        );
        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe, () => {}, () => {}));
    }
}
