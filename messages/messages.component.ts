import { combineLatest as observableCombineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { APP_CONFIG, AppConfig, immutableHelper, LogService } from '@setl/utils';
import { setRequestedMailList } from '@setl/core-store';
import { MyMessagesService } from '@setl/core-req-services';
import { MessagesService } from '../messages.service';
import { MailHelper } from './mailHelper';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { FileDownloader } from '@setl/utils';
import { setConnectedWallet } from '@setl/core-store/index';
import { SagaHelper } from '@setl/utils/index';
import { MyWalletsService } from '@setl/core-req-services/index';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'setl-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
})

export class SetlMessagesComponent implements OnDestroy, OnInit {
    public messageComposeForm: FormGroup;
    public editor;
    private appConfig: AppConfig;

    @select(['message', 'myMessages', 'messageList']) getMessageList;
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['wallet', 'myWallets', 'walletList']) getMyWalletList;
    @select(['message', 'myMessages', 'requestMailList']) requestMailList;
    @select(['wallet', 'walletDirectory', 'walletList']) getWalletDirectoryList;
    @select(['message', 'myMessages', 'counts']) getMailCounts;
    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail', 'userId']) userIdOb;
    @select(['user', 'myDetail', 'defaultWalletID']) getDefaultWalletId;

    public messages = [];
    public categories;
    public currentMessage;
    public currentCategory;
    public composeSelected;
    public messageView;
    public walletId;
    public walletDirectoryList;
    public walletWithCommuPub;

    public myWalletList;
    public mailCounts;
    public currentBoxCount;
    public currentPage;
    public currentBox;
    public search: string = '';
    public showDeleteModal: boolean = false;

    public unreadMessages;
    public selectAll: boolean = false;
    private checkedMessages: any[] = [];

    public items: string[] = [];

    private value: any = ['Athens'];
    private _disabledV = '0';
    private disabled = false;
    private messageService: MessagesService;
    public mailHelper: MailHelper;

    socketToken: string;
    userId: string;

    subscriptionsArray: Subscription[] = [];

    public toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],

        [{ list: 'ordered' }, { list: 'bullet' }],
        // [{ direction: 'rtl' }], // text direction
        //
        // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        // [{ header: [1, 2, 3, 4, 5, 6, false] }],
        //
        // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        // [{ font: [] }],
        // [{ align: [] }],

        ['clean'], // remove formatting button
    ];

    public editorOptions = {
        modules: {
            toolbar: this.toolbarOptions, // Snow includes toolbar by default
        },
        placeholder: '',
        bold: false,
    };

    public showCross = false;

    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService,
                private changeDetectorRef: ChangeDetectorRef,
                private route: ActivatedRoute,
                private router: Router,
                private toaster: ToasterService,
                private logService: LogService,
                private fileDownloader: FileDownloader,
                private myWalletsService: MyWalletsService,
                public translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.mailHelper = new MailHelper(ngRedux, myMessageService);
        this.messageService = new MessagesService(this.ngRedux, this.myMessageService);

        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.messageView = false;
        this.currentCategory = 0;
        this.unreadMessages = 0;

        // these are the categories that appear along the left hand side as buttons
        this.categories = this.appConfig.messagesMenu;

        this.currentBox = this.categories[0];

        this.subscriptionsArray.push(
            observableCombineLatest(
                this.getConnectedWallet.pipe(distinctUntilChanged(), filter(walletId => walletId > 0)),
                this.getWalletDirectoryList,
            )
            .subscribe((subs) => {
                const walletId = subs[0];
                const walletDirectoryList = subs[1];

                this.walletId = walletId;
                this.mailHelper.retrieveMessages(walletId, this.currentBox.type || 'inbox', 0, 15, this.search);

                this.walletDirectoryList = walletDirectoryList;
                this.walletWithCommuPub = this.walletListToSelectItem(walletDirectoryList);
                this.items = this.walletWithCommuPub.filter(wallet => wallet.id.walletId !== this.walletId);

                /* Close message when the wallet is switched. */
                if (this.messageView) this.closeMessage();
            }),
        );

        this.subscriptionsArray.push(
            this.getDefaultWalletId.subscribe((data) => {
                if (data != null) {
                    this.walletId = data;
                    this.setWallet(this.walletId);
                }
            }),
        );

        this.subscriptionsArray.push(
            this.getMyWalletList.subscribe(data => this.myWalletList = data),
        );

        this.subscriptionsArray.push(
            this.requestMailList.subscribe(requestedState => this.reRequestMailList(requestedState)),
        );

        this.subscriptionsArray.push(this.tokenOb.subscribe((token) => {
            this.socketToken = token;
        }));

        this.subscriptionsArray.push(this.userIdOb.subscribe((userId) => {
            this.userId = userId;
        }));

        observableCombineLatest([
            this.getMailCounts,
            this.getMessageList,
        ]).subscribe((subs) => {
            this.mailCounts = subs[0];
            this.messagesList(subs[1]);
        });

        this.messageComposeForm = new FormGroup({
            subject: new FormControl('', Validators.required),
            recipients: new FormControl('', Validators.required),
            body: new FormControl('', Validators.required),
        });

        this.route.params.subscribe((params) => {
            this.uncheckAll();
            if (params.category) {
                if (params.category === 'view') {
                    return;
                }
                if (params.category === 'compose') {
                    this.messageService.loadReply().then((reply: any) => {
                        if (reply) {
                            this.messageService.clearReply();

                            this.messageComposeForm.setValue({
                                subject: `${this.translate.translate('Re')}: ${reply.subject}`,
                                recipients: [{ id: { walletId: reply.senderId }, text: reply.senderWalletName }],
                                body: '<br><p>&nbsp;&nbsp;&nbsp;<s>' +
                                '&nbsp;'.repeat(200) + '</s></p><p>&nbsp;&nbsp;&nbsp;<b>' +
                                reply.senderWalletName + '</b> ' + reply.date + ':</p>' +
                                reply.body.replace(/<p>/g, '<p>&nbsp;&nbsp;&nbsp;'),
                            });
                        }
                    });

                    return this.showCategory(999, true);
                }
                const idx = this.categories.findIndex(cat => cat.type === params.category);
                if (idx >= 0) {
                    this.showCategory(idx);
                }
            }
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    /**
     * Set Wallet method
     *
     * @param walletId
     */
    public setWallet(walletId) {
        this.ngRedux.dispatch(setConnectedWallet(walletId));
        const asyncTaskPipe = this.myWalletsService.setActiveWallet(walletId);
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe));
    }

    handleSearch(value) {
        this.search = value;
        this.mailHelper.retrieveMessages(this.walletId, this.currentBox.type, 0, 15, value);
    }

    clearSearch(event?: any) {
        if (event) {
            event.preventDefault();
        }
        this.handleSearch('');
    }

    /**
     * Message List
     *
     * @param messages
     */
    messagesList(messages) {
        this.selectAll = false;

        if (messages.length) {
            this.messages = messages.map((message) => {
                if (message.senderId) {
                    if (typeof this.walletDirectoryList[message.senderId] !== 'undefined') {
                        message.senderWalletName = this.walletDirectoryList[message.senderId].walletName;
                    } else {
                        if (message.senderId === -1) {
                            message.senderWalletName = this.appConfig.internalMessageSender ||
                                this.translate.translate('System message');
                        } else {
                            message.senderWalletName = this.translate.translate('Deleted wallet');
                        }
                    }
                    if (message.recipientId) {
                        if (typeof this.walletDirectoryList[message.recipientId] !== 'undefined') {
                            message.recipientWalletName = this.walletDirectoryList[message.recipientId].walletName;
                        }
                    }
                    message.isChecked = this.checkedMessages.includes(message.mailId);
                    return message;
                }
            });
        } else {
            this.messages = [];
        }

        if (this.mailCounts && this.currentCategory !== 999) {
            this.currentBox = this.categories[this.currentCategory];

            this.currentBoxCount = this.mailCounts[this.currentBox.type];
            if (this.currentBox.type === 'inbox') {
                // this.currentBoxCount = this.mailCounts['inboxUnread'];
                this.unreadMessages = this.mailCounts['inboxUnread'];
            }
        }

        this.changeDetectorRef.markForCheck();
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
        this.storeCheckedMessages();
        const categoryType = this.categories[this.currentCategory].type;
        this.requestMailboxByCategory(categoryType, page);
    }

    get checked(): any[] {
        return this.messages.filter(message => message.isChecked);
    }

    uncheckAll() {
        this.messages = this.messages.map((message) => {
            return { ...message, isChecked: false };
        });
    }

    /**
     * Delete Single Messaged - Called from Single Message View
     */
    deleteMessage() {
        this.closeMessage();
        this.mailHelper.deleteMessage(this.walletId, this.currentMessage, 1);
        this.refreshMailbox(this.currentPage);
    }

    /**
     * Checked Mark as Read - Multiselect
     */
    checkedMarkAsRead() {
        this.checked.forEach(message => this.mailHelper.markMessageAsRead(message.recipientId, message.mailId));
        this.refreshMailbox();
    }

    /**
     * Checked Deleted - Multiselect
     */
    checkedDeleted() {
        this.checked.forEach(message => this.mailHelper.deleteMessage(this.walletId, message, 1));
        this.refreshMailbox();
    }

    checkedPutBack() {
        this.checked.forEach(message => this.mailHelper.deleteMessage(this.walletId, message, 0));
        this.refreshMailbox();
    }

    getPadding(category) {
        let ret = [];
        if (category.level > 1) {
            ret = Array(category.level - 1).fill('-');
        }
        return ret;
    }

    /**
     * Checks Single Message
     *
     * @param index
     */
    messageChecked(index, event) {
        event.stopPropagation();
        if (this.messages[index].isChecked === true) {
            this.messages[index].isChecked = false;
            return;
        }
        this.messages[index].isChecked = true;
        this.storeCheckedMessages();
    }

    /**
     * Checks All Messages
     *
     * @param index
     */
    messageAllChecked(index, event) {
        this.selectAll = !this.selectAll;

        this.messages = this.messages.map((message) => {
            return { ...message, isChecked: this.selectAll };
        });
        this.storeCheckedMessages();
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
                            },
                        );
                        return;
                    },
                    () => {
                    },
                );
                return;
            }

            // Mark message as read (if necessary)
            // comment out the senderId and connectedWalletId checkout to avoid could not able to mark
            // message send from himself to read. But commented out might cause marking outgoing email to read,
            // however, after a bit testing, it seem work ok.
            // if (!messages[index].isRead && messages[index].senderId != this.walletId) {
            if (!messages[index].isRead) {
                this.mailHelper.markMessageAsRead(messages[index].recipientId, messages[index].mailId);
                messages[index].isRead = true;
            }

            // Set isActed if message has expired
            const currentTime = Math.floor(Date.now() / 1000);
            const expiry = (currentMessage.action || {}).expiry || 0;
            if (!currentMessage.isActed && expiry && expiry < currentTime) {
                this.messageService.markMessageAsActed(this.walletId, currentMessage.mailId, null);
                this.messages[index].isActed = true;
            }

            // set message to active to apply message-active css class
            messages[index].active = true;

            this.messages = messages;
            currentMessage.isRead = true;
            // if ((currentMessage.action) &&
            //     typeof currentMessage.action === 'string' &&
            //     currentMessage.action.length > 0
            // ) {

            if ((currentMessage.action) &&
                typeof currentMessage.action === 'string' &&
                currentMessage.action.length > 0
            ) {
                currentMessage.action = JSON.parse(currentMessage.action);
            }

            this.messageView = true;
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
    showCategory(index, composeSelected = false, page = 0, reset = true) {
        if (reset) {
            this.messageView = false;
        }

        this.storeCheckedMessages();
        this.resetMessages(reset);
        this.uncheckAll();
        this.clearSearch();
        this.composeSelected = composeSelected;

        const categories = [...this.categories];
        categories.map((cat, idx) => cat.active = idx === index);
        this.currentCategory = index;
        if (!this.composeSelected) {
            // set message to active to apply active css class

            if (index === 999) {
                return;
            }

            const type = categories[index].type;

            this.requestMailboxByCategory(type, page);

            if (reset) {
                this.currentMessage = {
                    id: 0,
                    mailid: 0,
                };
            }
        }
        this.categories = categories;
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Save any checked messages so we can restore them once new data comes in
     */
    storeCheckedMessages() {
        this.checkedMessages = [];
        this.messages.forEach((message) => {
            if (message.isChecked) {
                this.checkedMessages.push(message.mailId);
            }
        });
    }

    /**
     * Closes Single Message from View
     */
    closeMessage() {
        this.messageView = false;
    }

    requestMailboxByCategory(type, page) {
        this.mailHelper.retrieveMessages(this.walletId, type, page, 15, this.search);
    }

    closeAndResetComposed() {
        this.showCategory(0, false);
        this.router.navigate(['messages/inbox']);
        this.messageComposeForm.reset();
    }

    walletListToSelectItem(walletsList: any[]): any[] {
        return Object.keys(walletsList).map((walletId) => {
            return {
                id: {
                    commPub: walletsList[walletId].commPub,
                    walletId: walletsList[walletId].walletID,
                },
                text: walletsList[walletId].walletName,
            };
        });
    }

    resetMessages(reset) {
        this.messages = [];
        // Default current category
        this.currentCategory = 0;
        this.currentPage = 0;
        // Default current message
        if (reset) {
            this.currentMessage = {
                id: 0,
            };
        }
    }

    public sendMessage() {
        const formData = this.messageComposeForm.value;

        const generalBody = formData.body;
        const subject = formData.subject;
        const recipients = {};

        for (const i in formData.recipients) {
            const obj = formData.recipients[i]['id'];
            recipients[i] = obj.walletId;
        }

        if (!formData.subject || !generalBody || !formData.recipients) {
            this.toaster.pop('error', this.translate.translate('Please fill out all fields'));
        } else {
            this.messageService.sendMessage(recipients, subject, generalBody, null).then(
                () => {
                    this.toaster.pop('success', this.translate.translate('Your message has been sent!'));
                    this.closeAndResetComposed();
                },
                (err) => {
                    this.toaster.pop('error', this.translate.translate('Message sending failed'));
                    console.error('Message sending failed', err);
                },
            );
        }

    }

    reRequestMailList(requestedState: boolean): void {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            this.ngRedux.dispatch(setRequestedMailList());
            // Set the state flag to true. so we do not request it again.
            if (!this.composeSelected) {
                this.showCategory(this.currentCategory, false, 0, false);
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

    public onContentChanged({ quill, html, text }) {
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

    public itemsToString(value: any[] = []): string {
        return value
        .map((item: any) => {
            return item.text;
        }).join(',');
    }

    replyMessage() {
        this.messageService.saveReply(this.currentMessage);
        this.router.navigateByUrl('/messages/compose');
    }

    downloadTxtFile(data) {
        let body = {
            method: 'getIznMTFile',
            mtType: data.mtType,
            token: this.socketToken,
            orderId: data.orderID,
            userId: this.userId,
        };

        if (data.mtType == 'MT101') body['messageType'] = data.messageType;
        if (data.mtType == 'MT502') {
            body['MT502ID'] = data.MT502ID;
            body['type'] = data.orderType;
        }

        this.fileDownloader.downLoaderFile(body);
    }

    handleDownloadBookEntryCertification(assetManagementCompanyId, settlementDate) {
        this.fileDownloader.downLoaderFile({
            method: 'exportAssetManagementBookEntryCertification',
            token: this.socketToken,
            userId: this.userId,
            assetManagementCompanyId,
            settlementDate
        });
    }
}
