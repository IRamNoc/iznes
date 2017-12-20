import { ChangeDetectorRef, Component, OnDestroy, OnInit, Pipe } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { SagaHelper, Common } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { immutableHelper } from '@setl/utils';
import {
    SET_MESSAGE_LIST,
    getMyMessagesList,
    getConnectedWallet,
    getWalletDirectoryList,
    setRequestedMailList
} from '@setl/core-store';
import { MyMessagesService } from '@setl/core-req-services';
import { MessagesService } from "../messages.service";
import { MailHelper } from './mailHelper';
import { fromJS } from 'immutable';

@Component({
    selector: 'setl-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class SetlMessagesComponent implements OnDestroy, OnInit {
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
    private _disabledV = '0';
    private disabled = false;
    private mailHelper: MailHelper;
    private messageService: MessagesService;

    subscriptionsArray: Array<Subscription> = [];

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

    constructor(
        private ngRedux: NgRedux<any>,
        private myMessageService: MyMessagesService,
        private changeDetectorRef: ChangeDetectorRef,
        private _alertsService: AlertsService
    ) {
        this.mailHelper = new MailHelper(this.ngRedux, this.myMessageService);
        this.messageService = new MessagesService(this.ngRedux, this.myMessageService);
    }

    ngOnInit() {
        this.currentCategory = 0;

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
                (function (newWalletId) {
                    if (newWalletId !== this.currentWalletId) {
                        this.resetMessages();
                        this.currentWalletId = newWalletId;
                        this.mailHelper.retrieveMessages(newWalletId);
                    }
                    this.connectedWallet = newWalletId;
                }).bind(this)
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
                    console.log('get Message List');
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
     * Message List
     *
     * @param messages
     */
    messagesList(messages) {
        this.messages = messages;
        this.messages = messages.map((message) => {
            if (message.senderId) {
                if (typeof this.walletDirectoryList[message.senderId] !== 'undefined') {
                    message.senderWalletName = this.walletDirectoryList[message.senderId].walletName;
                }
            }
            if (message.recipientId) {
                if (typeof this.walletDirectoryList[message.recipientId] !== 'undefined') {
                    message.recipientWalletName = this.walletDirectoryList[message.recipientId].walletName;
                }
            }
            return message;
        });

        if (this.messages.length > 0) {
            this.showMessage(this.currentMessage.id);
        }

        if (this.mailCounts) {
            const categoryType = this.categories[this.currentCategory].type;
            this.currentBoxName = this.categories[this.currentCategory].name;
            this.currentBoxCount = this.mailCounts[categoryType];
        }
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
        this.mailHelper.deleteMessage(this.connectedWallet, this.currentMessage);
        this.refreshMailbox(this.currentPage);
    }

    /**
     * Show message when clicked
     *
     * @param index
     *
     * @return {Promise}
     */
    showMessage(index) {
        return new Promise((resolve) => {
            const messages = immutableHelper.copy(this.messages);
            if (typeof messages[index] === 'undefined') {
                index = 0;
            }
            // set the current message that appears on the right hand side
            const currentMessage = this.messages[index];
            // set the id so that message-active an be compared to index and set
            currentMessage.id = index;
            const categoryType = this.categories[this.currentCategory].type;

            // Decrypt message (if necessary)
            if (!currentMessage.isDecrypted) {
                this.mailHelper.decryptMessage(currentMessage, categoryType).then(
                    (message) => {
                        messages[index] = message;
                        this.showMessage(index).then(
                            () => {
                                resolve();
                            }
                        );
                        return;
                    },
                    () => {
                    }
                );
                return;
            }
            // Mark message as read (if necessary)
            if (!messages[index].isRead) {
                this.mailHelper.markMessageAsRead(messages[index].recipientId, messages[index].mailId);
            }
            // set message to active to apply message-active css class
            messages[index].active = true;
            messages[index].isRead = true;
            this.messages = messages;
            currentMessage.isRead = true;
            if ((currentMessage.action) &&
                typeof currentMessage.action === 'string' &&
                currentMessage.action.length > 0
            ) {
                currentMessage.action = JSON.parse(currentMessage.action);
            } else {
                currentMessage.action = {
                    type: null
                };
            }
            this.currentMessage = currentMessage;
            this.changeDetectorRef.detectChanges();
            resolve();
        });
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

            this.requestMailboxByCategory(type, page);

            this.currentMessage = {
                id: 0,
                mailid: 0
            };
        }
    }

    requestMailboxByCategory(type, page) {
        console.log('Requesting MailBox By Category:', type, page);
        this.mailHelper.retrieveMessages(this.currentWalletId, type, page);
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
        const formData = this.messageComposeForm.value;
        const bodyObj = {
            general: btoa(formData.body),
            action: ''
        };

        const body = JSON.stringify(bodyObj);
        const subject = btoa(formData.subject);
        const recipients = {};

        for (const i in formData.recipients) {
            const obj = formData.recipients[i]['id'];
            recipients[i] = obj.walletId;
        }

        if (subject === '' || bodyObj.general === '' || formData.recipients === '') {
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
            this.messageService.sendMessage(recipients, subject, body, null).then(
                () => {
                    this._alertsService.create('success', `
                        <table class="table grid">
                            <tbody>
                                <tr class="fadeIn">
                                    <td class="text-center" width="500px">
                                        <i class="fa fa-envelope-o text-primary" aria-hidden="true"></i>
                                        &nbsp;Your message has been sent!
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    `);
                    this.closeAndResetComposed();
                },
                (err) => {
                    console.log('error: ', err);
                }
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


    public onEditorBlurred(quill) {
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
}
