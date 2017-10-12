import {ChangeDetectorRef, Component, OnInit, Pipe} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {Subscription} from 'rxjs/Subscription';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';

import {
    SET_MESSAGE_LIST,
    getMyMessagesList,
    DONE_RUN_DECRYPT,
    getNeedRunDecryptState,
    setDecryptedContent,
    getConnectedWallet,
    getWalletDirectoryList,
    setRequestedMailList
} from '@setl/core-store';


import {MyMessagesService} from '@setl/core-req-services';
import {fromJS} from "immutable";

@Component({
    selector: 'setl-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class SetlMessagesComponent {

    public messageComposeForm: FormGroup;
    public editor;

    @select(['message', 'myMessages', 'messageList']) getMessageList;
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['wallet', 'myWallets', 'walletList']) getMyWalletList;
    @select(['message', 'myMessages', 'requestMailList']) requestMailList;
    @select(['wallet', 'walletDirectory', 'walletList']) getWalletDirectoryList;

    public messages = [];
    public categories;
    public currentMessage;
    public currentCategory;
    public composeSelected;
    public currentWalletId;
    public walletDirectoryList;
    public walletWithCommuPub;

    public connectedWallet;

    public myWalletList;

    public items: Array<string> = [];

    private value: any = ['Athens'];
    private _disabledV: string = '0';
    private disabled: boolean = false;

    subscriptionsArray: Array<Subscription> = [];

    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService,
                private changeDetectorRef: ChangeDetectorRef) {

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

        this.getWalletDirectoryList.subscribe(
            (requestedState) => {
                this.walletDirectoryList = requestedState;
                this.walletWithCommuPub = this.walletListToSelectItem(this.walletDirectoryList);
                this.items = this.walletWithCommuPub;
            }
        );

        this.getConnectedWallet.subscribe(
            (newWalletId) => {
                if (newWalletId !== this.currentWalletId) {
                    this.resetMessages();
                    this.currentWalletId = newWalletId;
                    this.requestMessages();
                }
                this.connectedWallet = newWalletId;
            }
        );

        this.getMyWalletList.subscribe(
            (data) => {
                this.myWalletList = data;
            }
        );

        this.requestMailList.subscribe(
            (requestedState) => {
                this.reRequestMailList(requestedState);
            }
        );

        this.getMessageList.subscribe(
            (data) => {
                this.messagesList(data);
            }
        );

        // ngRedux.subscribe(() => this.updateState());
        // this.updateState();

        this.messageComposeForm = new FormGroup({
            subject: new FormControl('', Validators.required),
            recipients: new FormControl('', Validators.required),
            body: new FormControl('', Validators.required)
        });
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
     * Message List
     *
     * @param messages
     */
    messagesList(messages) {
        this.messages = messages;
        this.messages = messages.map((message) => {
            const senderId = message.senderId;
            const senderWallet = this.walletDirectoryList[senderId].walletName;
            message.senderWalletName = senderWallet;

            const recipientId = message.recipientId;
            const recipientWallet = this.walletDirectoryList[recipientId].walletName;
            message.recipientWalletName = recipientWallet;
            return message;
        });

        if (this.messages.length > 0) {
            this.showMessage(this.currentMessage.id);
        }
    }

    refreshMailbox() {
        console.log('refresh current mailbox');
    }

    deleteMessage() {
        console.log('delete message');
    }

    /**
     * Show message when clicked
     *
     * @param index
     */
    showMessage(index) {

        // set message to active to apply message-active css class
        this.messages[index].active = true;
        this.messages[index].isRead = true;

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

        this.currentMessage.isRead = true;
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

            this.currentMessage = {
                id: 0,
                mailid: 0,
            };
        }
    }

    closeAndResetComposed() {

        this.showCategory(this.currentCategory, false);
        this.messageComposeForm.reset();
    }


    walletListToSelectItem(walletsList: Array<any>): Array<any> {
        const walletListImu = fromJS(walletsList);
        const walletsSelectItem = walletListImu.map(
            (thisWallet) => {
                return {
                    id: {
                        'commPub': thisWallet.get('commuPub'),
                        'walletId': thisWallet.get('walletID')
                    },
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
        let formData = this.messageComposeForm.value;

        let bodyObj = {
            general: btoa(formData.body),
            action: ''
        };

        const body = JSON.stringify(bodyObj);

        let subject = btoa(formData.subject);

        let recipients = {};

        let currentWallet = this.myWalletList[this.connectedWallet];

        let senderId = this.connectedWallet;
        let senderPub = currentWallet.commuPub;

        for (const i in formData.recipients) {
            let obj = formData.recipients[i]['id'];
            let recipentPub = obj.commPub;
            let receipetId = obj.walletId;

            recipients[receipetId] = recipentPub;
        }

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
                console.log('success: ');

                this.closeAndResetComposed();
            },
            (data) => {
                console.log('error: ');
            })
        );

    }

    reRequestMailList(requestedState: boolean): void {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            this.ngRedux.dispatch(setRequestedMailList());
            // Set the state flag to true. so we do not request it again.
            if (!this.composeSelected) {
                this.showCategory(this.currentCategory, false);
            }
        }
    }


    public onEditorBlured(quill) {
    }

    public onEditorFocused(quill) {
    }

    public onEditorCreated(quill) {
        this.editor = quill;
    }

    public onContentChanged({quill, html, text}) {
    }

    private get disabledV(): string {
        return this._disabledV;
    }

    private set disabledV(value: string) {
        this._disabledV = value;
        this.disabled = this._disabledV === '1';
    }

    public selected(value: any): void {
    }

    public removed(value: any): void {
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

    public toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote'],

        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],

        ['clean']                                         // remove formatting button
    ];


    public editorOptions = {
        modules: {
            toolbar: this.toolbarOptions    // Snow includes toolbar by default
        },
        placeholder: '',
        bold: false,
    };
}
