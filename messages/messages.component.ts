import {ChangeDetectorRef, Component, OnInit, Pipe} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

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

    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService,
                private changeDetectorRef: ChangeDetectorRef) {

        this.getMessageList.subscribe(
            (data) => {
                this.messages = data;
            }
        );

        this.getConnectedWallet.subscribe(
            (data) => {
                this.connectedWallet = data;
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

        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        this.resetMessages();

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
            if (this.currentMessage[Object.keys(this.currentMessage)[0]] === 0) {
                this.currentMessage = this.messages[0];
                this.showMessage(0);
                return;
            }

            const id = this.currentMessage.id;
            this.currentMessage = this.messages[id];
            this.currentMessage.id = id;

            this.changeDetectorRef.markForCheck();
        }


        console.log('currentMessage');
        console.log(this.currentMessage);
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
        console.log(this.messageComposeForm);
        console.log(this.messageComposeForm);

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
                console.log(data); // success

                this.closeAndResetComposed();
            },
            (data) => {
                console.log('error: ');
                console.log(data); // error
            })
        );

    }

    reRequestMailList(requestedState: boolean): void {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            if (!this.composeSelected) {
                this.showCategory(this.currentCategory, false);
            }
        }
    }


    public onEditorBlured(quill) {
        console.log('editor blur!', quill);
    }

    public onEditorFocused(quill) {
        console.log('editor focus!', quill);
    }

    public onEditorCreated(quill) {
        this.editor = quill;
        console.log('quill is ready! this is current quill instance object', quill);
    }

    public onContentChanged({quill, html, text}) {
        console.log('quill content is changed!', quill, html, text);
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
