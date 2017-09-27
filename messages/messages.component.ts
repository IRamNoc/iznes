import {Component, OnInit, Pipe} from '@angular/core';

import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';

import {
    SET_MESSAGE_LIST,
    getMyMessagesList,
    DONE_RUN_DECRYPT,
    getNeedRunDecryptState,
    setDecryptedContent,
    getConnectedWallet,
    getWalletDirectoryList
} from '@setl/core-store';


import {MyMessagesService} from '@setl/core-req-services';
import {fromJS} from "immutable";

@Component({
    selector: 'setl-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class SetlMessagesComponent {

    @select(['message', 'myMessages', 'messageList']) getMessageList;

    public messages = [];
    public categories;
    public currentMessage;
    public currentCategory;
    public composeSelected;
    public currentWalletId;
    public walletDirectoryList;
    public walletWithCommuPub;
    public currentMessageIndex;

    public items: Array<string> = [];

    private value: any = ['Athens'];
    private _disabledV: string = '0';
    private disabled: boolean = false;

    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService) {

        this.getMessageList.subscribe(
            (messageListData) => {
                this.messages = messageListData;
                console.log(this.messages);
            }
        );

        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        //this.items = ['test', 'test2', 'test3'];

        // these are the categories that appear along the left hand side as buttons
        this.categories = [
            {
                name: 'All Messages',
                desc: 'View your global inbox',
                icon: 'inbox',
                type: 'inbox',
                active: true
            },
            {
                name: 'Action Messages',
                desc: 'Messages that require actions',
                icon: 'balance',
                type: 'action',
                active: false
            },
            {
                name: 'Workflow Messages',
                desc: 'Messages with multiple actions',
                icon: 'organization',
                type: 'workflow',
                active: false
            },
            {
                name: 'Sent Messages',
                desc: 'Messages sent by your account',
                icon: 'pop-out',
                type: 'sent',
                active: false
            },
            {
                name: 'Deleted Messages',
                desc: 'View messages that you deleted',
                icon: 'trash',
                type: 'deleted',
                active: false
            },
        ];

        this.resetMessages();
    }


    /**
     * Requests Messages
     *
     * @param {boolean} isAction
     * @param {boolean} isDeleted
     * @param {boolean} isSent
     * @returns {boolean}
     */
    requestMessages(isAction = false, isDeleted = false, isSent = false) {

        console.log('------ current wallet id');
        console.log(this.currentWalletId);

        const requestIsAction = isAction === true ? 1 : 0;
        const requestIsDeleted = isDeleted === true ? 1 : 0;

        const fromWallet = isSent === true ? this.currentWalletId : 0;
        const toWallet = isSent === true ? 0 : this.currentWalletId;

        // Create a saga pipe.
        const asyncTaskPipe = this.myMessageService.requestOwnMessages(
            0,
            fromWallet,
            toWallet,
            0,
            5,
            0,
            0,
            requestIsDeleted,
            requestIsAction,
            ''
        );

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_MESSAGE_LIST],
            [],
            asyncTaskPipe, {}));

        return false;
    }

    /**
     * Decrypts a message
     *
     * @param mailId
     * @param walletId
     * @param bobPub
     * @param encryptedMessage
     */
    decrypt(mailId, walletId, bobPub, encryptedMessage) {
        const asyncTaskPipe = this.myMessageService.decryptMessage(
            walletId, bobPub, encryptedMessage
        );

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe, {}, (response) => {
                this.ngRedux.dispatch(setDecryptedContent(mailId, response));
                return true;
            })
        );
    }

    /**
     * Handles incoming Redux state when Updated
     */
    updateState() {
        const newState = this.ngRedux.getState();
        const newMessages = getMyMessagesList(newState);

        const newWalletId = getConnectedWallet(newState);

        console.log(newWalletId);
        console.log(this.currentWalletId);

        if (newWalletId !== this.currentWalletId) {
            console.log('i shouldnt hit here');
            this.resetMessages();
            this.currentWalletId = newWalletId;
            this.requestMessages();
        }

        this.walletDirectoryList = getWalletDirectoryList(newState);
        this.walletWithCommuPub = this.walletListToSelectItem(this.walletDirectoryList);

        this.items = this.walletWithCommuPub;

        console.log('messages ------');
        console.log(this.messages);

        // if (getNeedRunDecryptState(newState) && newMessages !== this.messages) {
        //     // this.decrypt(this.messages[0].recipientId, this.messages[0].senderPub, this.messages[0].content);
        //     this.ngRedux.dispatch({type: DONE_RUN_DECRYPT});
        //     for (const i in this.messages) {
        //         const message = this.messages[i];
        //
        //         this.decrypt(message.mailId, message.recipientId, message.senderPub, message.content);
        //
        //         // sent box
        //         // this.decrypt(message.mailId, message.senderId, message.recipientPub, message.content);
        //     }
        // }

        if (this.messages.length > 0) {
            if (this.currentMessage[Object.keys(this.currentMessage)[0]] == 0) {
                this.currentMessage = this.messages[0];
                this.showMessage(0);
                return;
            }

            const id = this.currentMessage.id;
            this.currentMessage = this.messages[id];
            this.currentMessage.id = id;
        }
    }

    /**
     * Show message when clicked
     *
     * @param index
     */
    showMessage(index) {

        // set message to active to apply message-active css class
        this.messages[index].active = true;

        // set the current message that appears on the right hand side
        this.currentMessage = this.messages[index];

        // set the id so that message-active an be compared to index and set
        this.currentMessage.id = index;

        const message = this.currentMessage;

        const categoryIndex = this.currentCategory;
        const categoryType = this.categories[categoryIndex].type;

        if (!message.isDecrypted) {

            if (categoryType == "sent") {
                this.decrypt(message.mailId, message.senderId, message.recipientPub, message.content);
            } else {
                this.decrypt(message.mailId, message.recipientId, message.senderPub, message.content);
            }
        }
    }

    /**
     * Switch Between Mail Box Option (Category)
     *
     * @param index
     * @param {boolean} composeSelected
     */
    showCategory(index, composeSelected = false) {

        this.resetMessages();

        if (composeSelected) {
            this.composeSelected = true;
        } else {
            // set message to active to apply active css class
            this.categories[index].active = true;
            this.composeSelected = false;

            const type = this.categories[index].type;

            // set the current message that appears on the right hand side
            this.currentCategory = index;
            this.currentMessage = {
                id: 0,
                mailid: 0,
            };

            if (type === 'inbox') {
                this.requestMessages();
            } else if (type === 'action') {
                this.requestMessages(
                    true
                );
            } else if (type === 'sent') {
                this.requestMessages(
                    false,
                    false,
                    true
                );
            } else if (type === 'deleted') {
                this.requestMessages(
                    false,
                    true
                );
            }
        }
    }

    walletListToSelectItem(walletsList: Array<any>): Array<any> {
        const walletListImu = fromJS(walletsList);
        const walletsSelectItem = walletListImu.map(
            (thisWallet) => {
                return {
                    id: thisWallet.get('commuPub'),
                    text: thisWallet.get('walletName')
                };
            }
        );

        return walletsSelectItem.toArray();
    }

    resetMessages() {
        // Default current category
        this.currentCategory = 0;

        // Default current message
        this.currentMessage = {
            id: 0
        };
    }


    public sendMessage() {

    }


    private get disabledV(): string {
        return this._disabledV;
    }

    private set disabledV(value: string) {
        this._disabledV = value;
        this.disabled = this._disabledV === '1';
    }

    public selected(value: any): void {
        console.log('Selected value is: ', value);
    }

    public removed(value: any): void {
        console.log('Removed value is: ', value);
    }

    public refreshValue(value: any): void {
        this.value = value;
    }

    public itemsToString(value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.text;
            }).join(',');
    }
}
