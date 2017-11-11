import {ChangeDetectorRef, Component, OnDestroy, OnInit, Pipe} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {Subscription} from 'rxjs/Subscription';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {immutableHelper} from '@setl/utils';

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
export class SetlMessagesComponent implements OnDestroy {

    public messageComposeForm: FormGroup;
    public editor;

    @select(['message', 'myMessages', 'messageList']) getMessageList;
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['wallet', 'myWallets', 'walletList']) getMyWalletList;
    @select(['message', 'myMessages', 'requestMailList']) requestMailList;
    @select(['wallet', 'walletDirectory', 'walletList']) getWalletDirectoryList;
    @select(['message', 'myMessages', 'counts']) getMailCounts;

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
    public mailCounts;
    public currentBoxCount;
    public currentPage;
    public currentBoxName;

    public items: Array<string> = [];

    private value: any = ['Athens'];
    private _disabledV: string = '0';
    private disabled: boolean = false;

    subscriptionsArray: Array<Subscription> = [];

    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService,
                private changeDetectorRef: ChangeDetectorRef,
                private _alertsService: AlertsService) {

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

        this.subscriptionsArray.push(
            this.getWalletDirectoryList.subscribe(
                (requestedState) => {
                    this.walletDirectoryList = requestedState;
                    this.walletWithCommuPub = this.walletListToSelectItem(this.walletDirectoryList);
                    this.items = this.walletWithCommuPub;
                }
            )
        );

        this.subscriptionsArray.push(
            this.getConnectedWallet.subscribe(
                (newWalletId) => {
                    if (newWalletId !== this.currentWalletId) {
                        this.resetMessages();
                        this.currentWalletId = newWalletId;
                        this.requestMessages();
                    }
                    this.connectedWallet = newWalletId;
                }
            )
        );

        this.subscriptionsArray.push(
            this.getMyWalletList.subscribe(
                (data) => {
                    this.myWalletList = data;
                }
            )
        );

        this.subscriptionsArray.push(
            this.requestMailList.subscribe(
                (requestedState) => {
                    this.reRequestMailList(requestedState);
                }
            )
        );

        this.subscriptionsArray.push(
            this.getMessageList.subscribe(
                (data) => {
                    this.messagesList(data);
                }
            )
        );

        this.subscriptionsArray.push(
            this.getMessageList.subscribe(
                (data) => {
                    this.messagesList(data);
                }
            )
        );

        this.subscriptionsArray.push(
            this.getMailCounts.subscribe(
                (data) => {
                    console.log('mail counts', data);
                    this.mailCounts = data;
                }
            )
        );

        // ngRedux.subscribe(() => this.updateState());
        // this.updateState();

        this.messageComposeForm = new FormGroup({
            subject: new FormControl('', Validators.required),
            recipients: new FormControl('', Validators.required),
            body: new FormControl('', Validators.required)
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    /**
     * Requests Messages
     *
     * @param {boolean} isAction
     * @param {boolean} isDeleted
     * @param {boolean} isSent
     * @returns {boolean}
     */
    requestMessages(page = 0, isAction = false, isDeleted = false, isSent = false) {

        const requestIsAction = isAction === true ? 1 : 0;
        const requestIsDeleted = isDeleted === true ? 1 : 0;

        const fromWallet = isSent === true ? this.currentWalletId : 0;
        const toWallet = isSent === true ? 0 : this.currentWalletId;

        // Create a saga pipe.
        const asyncTaskPipe = this.myMessageService.requestOwnMessages(
            0,
            fromWallet,
            toWallet,
            page,
            8,
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
            if (senderId) {
                if (typeof this.walletDirectoryList[senderId] != "undefined") {
                    const senderWallet = this.walletDirectoryList[senderId].walletName;
                    message.senderWalletName = senderWallet;
                }
            }
            const recipientId = message.recipientId;
            if (recipientId) {
                if (typeof this.walletDirectoryList[recipientId] != "undefined") {
                    const recipientWallet = this.walletDirectoryList[recipientId].walletName;
                    message.recipientWalletName = recipientWallet;
                }
            }
            return message;
        });

        if (this.messages.length > 0) {
            this.showMessage(this.currentMessage.id);
        }

        if (this.mailCounts) {

            // currentCategory

            const categoryType = this.categories[this.currentCategory].type;

            this.currentBoxName = this.categories[this.currentCategory].name;
            this.currentBoxCount = this.mailCounts[categoryType]; // currentCategory

            // using 8 per page
            // get total pages
        }

        // sort page counts
        console.log(this.mailCounts);
    }

    /**
     * On Page Change Request Next Page
     *
     * @param {number} number
     */
    onPageChange(number: number) {
        const page = number - 1;
        const categoryType = this.categories[this.currentCategory].type;
        this.requestMailboxByCategory(categoryType, page);
    }

    /**
     * Refresh Mailbox
     */
    refreshMailbox(page = 0) {
        this.currentPage = page;
        const categoryType = this.categories[this.currentCategory].type;
        this.requestMailboxByCategory(categoryType, page);
    }

    /**
     * Delete Message
     */
    deleteMessage() {

        // Create a saga pipe.
        const asyncTaskPipe = this.myMessageService.deleteMessage(
            this.connectedWallet,
            [this.currentMessage.mailId],
            1
        );

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                console.log('success: ');
                console.log(data);
            },
            (data) => {
                console.log('error: ');
            })
        );

        this.refreshMailbox(this.currentPage);

    }

    /**
     * Show message when clicked
     *
     * @param index
     */
    showMessage(index) {
        let messages = immutableHelper.copy(this.messages);

        if (typeof messages[index] === 'undefined') index = 0;
        if (!messages[index].isRead) this.markAsRead(messages[index]);

        // set message to active to apply message-active css class
        messages[index].active = true;
        messages[index].isRead = true;

        this.messages = messages;

        // set the current message that appears on the right hand side
        let currentMessage = this.messages[index];

        // set the id so that message-active an be compared to index and set
        currentMessage.id = index;

        const message = currentMessage;

        const categoryIndex = this.currentCategory;
        const categoryType = this.categories[categoryIndex].type;

        if (!message.isDecrypted) {

            if (categoryType == "sent") {
                this.decrypt(message.mailId, message.senderId, message.recipientPub, message.content);
            } else {
                this.decrypt(message.mailId, message.recipientId, message.senderPub, message.content);
            }
            return;
        }

        console.log('Current Message: ', this.currentMessage);

        currentMessage.isRead = true;

        this.currentMessage = currentMessage;
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Mark message as read.
     */
    markAsRead(message) {

        // Create a saga pipe.
        const asyncTaskPipe = this.myMessageService.markRead(
            this.connectedWallet,
            [message.mailId],
        );

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                console.log('success: ');
                console.log(data);

            },
            (data) => {
                console.log('error: ');
            })
        );

    }

    /**
     * Switch Between Mail Box Option (Category)
     *
     * @param index
     * @param {boolean} composeSelected
     */
    showCategory(index, composeSelected = false, page = 0) {

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

            this.requestMailboxByCategory(type, 0);

            this.currentMessage = {
                id: 0,
                mailid: 0,
            };
        }
    }

    requestMailboxByCategory(type, page) {
        if (type === 'inbox') {
            this.requestMessages(
                page
            );
        } else if (type === 'action') {
            this.requestMessages(
                page,
                true
            );
        } else if (type === 'sent') {
            this.requestMessages(
                page,
                false,
                false,
                true
            );
        } else if (type === 'deleted') {
            this.requestMessages(
                page,
                false,
                true
            );
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
        this.messages = [];

        // Default current category
        this.currentCategory = 0;

        this.currentPage = 0;

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

        if (subject == '' || bodyObj.general == '' || formData.recipients == '') {
            console.log('error: incomplete fields');

            this._alertsService.create('error', `<table class="table grid">
                    <tbody>
                        <tr class="fadeIn">
                            <td class="text-center" width="500px">
                            <i class="fa fa-exclamation-circle text-danger" aria-hidden="true"></i>
                            &nbsp;Incomplete messages cannot be sent.</td>
                        </tr>
                    </tbody>
                </table>
            `);

        } else {
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

                    this._alertsService.create('success', `<table class="table grid">
                            <tbody>
                                <tr class="fadeIn">
                                    <td class="text-center" width="500px">
                                    <i class="fa fa-envelope-o text-primary" aria-hidden="true"></i>
                                    &nbsp;Your message has been sent!</td>
                                </tr>
                            </tbody>
                        </table>
                    `);

                    this.closeAndResetComposed();
                },
                (data) => {
                    console.log('error: ');
                })
            );
        }

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
