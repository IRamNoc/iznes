/* Angular/vendor imports. */
import {Injectable} from '@angular/core';
/* Package Imports. */
import {Observable} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import _ from 'lodash';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils/index';
import {MyMessagesService} from '@setl/core-req-services';
import {MessageActionsConfig, MessageConnectionConfig} from '@setl/core-messages';

/* Service Class. */
@Injectable()
export class MessagesService {

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet: Observable<any>;
    @select(['wallet', 'walletDirectory', 'walletList']) getWalletDirectory: Observable<any>;

    language;
    subscriptionsArray: Array<Subscription> = [];

    connectedWallet;
    walletDirectory;

    /* Constructor. */
    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService) {

        this.subscriptionsArray.push(
            this.getConnectedWallet.subscribe(
                (function (newWalletId) {
                    this.connectedWallet = newWalletId;
                }).bind(this)
            )
        );

        this.subscriptionsArray.push(
            this.getWalletDirectory.subscribe(
                (function (data) {
                    this.walletDirectory = data;
                }).bind(this)
            )
        );
    }

    /**
     * Send Message
     *
     * @param recipientsArr - Array of WalletId'
     * @param subjectStr
     * @param bodyStr
     * @param {string} action
     * @returns {Promise<any>}
     */
    public sendMessage(recipientsArr, subjectStr, bodyStr, action: MessageActionsConfig|MessageConnectionConfig = null) {
        const bodyObj = {
            general: btoa(bodyStr),
            action: JSON.stringify(action)
        };

        const body = JSON.stringify(bodyObj);
        const subject = btoa(subjectStr);

        const recipients = {};
        let senderPub;

        // get pub key for recipients
        for (const i in recipientsArr) {
            const walletId = recipientsArr[i];

            const wallet = _.find(this.walletDirectory, (obj) => {
                return obj.walletID === parseInt(walletId, 10);
            });

            recipients[walletId] = wallet.commuPub;
        }

        // get current wallet
        const currentWallet = _.find(this.walletDirectory, (obj) => {
            return obj.walletID === parseInt(this.connectedWallet, 10);
        });
        console.log('Current Wallet contents: ', currentWallet);
        senderPub = currentWallet.commuPub;

        return this.sendMessageRequest(subject, body, this.connectedWallet, senderPub, recipients);
    }

    /**
     * Send Message Request
     *
     * @param subject
     * @param body
     * @param senderId
     * @param senderPub
     * @param recipients
     *
     * @returns {Promise<any>}
     */
    public sendMessageRequest(subject, body, senderId, senderPub, recipients) {
        return new Promise((resolve, reject) => {

            const asyncTaskPipe = this.myMessageService.sendMessage(
                subject,
                body,
                senderId,
                senderPub,
                recipients
            );

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    resolve(data);
                },
                (data) => {
                    reject(data);
                })
            );
        });
    }

    /**
     * Mark Message as Acted
     *
     * @param walletId
     * @param mailsToMark
     * @returns {Promise<any>}
     */
    public markMessageAsActed(walletId, mailsToMark, hash) {
        return this.markMessageAsActedRequest(walletId, mailsToMark, hash);
    }

    /**
     * Mark Message as Acted Request
     *
     * @param subject
     * @param body
     * @param senderId
     * @param senderPub
     * @param recipients
     *
     * @returns {Promise<any>}
     */
    public markMessageAsActedRequest(walletId, mailsToMark, hash) {
        return new Promise((resolve, reject) => {
            const asyncTaskPipe = this.myMessageService.markAsActed(walletId, mailsToMark, hash);

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    resolve(data);
                },
                (data) => {
                    reject(data);
                })
            );
        });
    }

}
