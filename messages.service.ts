/* Angular/vendor imports. */
import {Injectable} from '@angular/core';

/* Package Imports. */
import {Observable} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import _ from 'lodash';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from "@setl/utils/index";
import {MyMessagesService} from '@setl/core-req-services';

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
                (newWalletId) => {
                    this.connectedWallet = newWalletId;
                }
            )
        );

        this.subscriptionsArray.push(
            this.getWalletDirectory.subscribe(
                (data) => {
                    this.walletDirectory = data;
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
        let senderPub;

        // get pub key for recipients
        for (const i in recipientsArr) {
            const walletId = recipientsArr[i];

            const wallet = _.find(this.walletDirectory, (obj) => {
                return obj.walletID === parseInt(walletId);
            });

            recipients[walletId] = wallet.commuPub;
        }

        // get current wallet
        const currentWallet = _.find(this.walletDirectory, (obj) => {
            return obj.walletID === parseInt(this.connectedWallet);
        });
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

}
