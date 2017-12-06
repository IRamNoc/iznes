/* Angular/vendor imports. */
import {Injectable} from '@angular/core';

/* Package Imports. */
import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from "@setl/utils/index";
import {MyMessagesService} from '@setl/core-req-services';

/* Service Class. */
@Injectable()
export class MessagesService {

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['wallet', 'walletDirectory', 'walletList']) getWalletDirectory;

    language;
    subscriptionsArray: Array<Subscription> = [];

    public connectedWallet;

    /* Constructor. */
    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService) {

        this.subscriptionsArray.push(
            this.getConnectedWallet.subscribe(
                (newWalletId) => {
                    this.connectedWallet = newWalletId;
                }
            )
        );

        this.subscriptionsArray.push(
            this.getWalletDirectory.subscribe(
                (data) => {
                    this.getWalletDirectory = data;
                }
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
    public sendMessage(recipientsArr, subjectStr, bodyStr, action = '') {

        const bodyObj = {
            general: btoa(bodyStr),
            action: action
        };

        const body = JSON.stringify(bodyObj);
        const subject = btoa(subjectStr);

        const recipients = {};

        // get pub key for recipients
        for (const i in recipientsArr) {
            const walletId = recipientsArr[i];
            const recipientId = walletId;
            const recipientPub = this.getWalletDirectory[walletId].commuPub;
            recipients[recipientId] = recipientPub;
        }

        // get current wallet
        const currentWallet = this.getWalletDirectory[this.connectedWallet];
        const senderPub = currentWallet.commuPub;

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

}
