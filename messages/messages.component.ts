import {Component, OnInit, Pipe} from '@angular/core';

import {SagaHelper, Common} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';

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

    public messages;
    public categories;
    public currentMessage;
    public currentCategory;
    public composeSelected;
    public currentWalletId;
    public walletDirectoryList;
    public walletWithCommuPub;

    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService) {

        ngRedux.subscribe(() => this.updateState());
        this.updateState();
        this.requestMessages();

        // these are the categories that appear along the left hand side as buttons
        this.categories = [
            {
                name: 'All Messages',
                desc: 'View your global inbox',
                icon: 'inbox',
                active: true
            },
            {
                name: 'Action Messages',
                desc: 'Messages that require actions',
                icon: 'balance',
                active: false
            },
            {
                name: 'Workflow Messages',
                desc: 'Messages with multiple actions',
                icon: 'organization',
                active: false
            },
            {
                name: 'Sent Messages',
                desc: 'Messages sent by your account',
                icon: 'pop-out',
                active: false
            },
            {
                name: 'Deleted Messages',
                desc: 'View messages that you deleted',
                icon: 'trash',
                active: false
            },
        ];
    }


    public items: Array<string> = [];

    private value: any = ['Athens'];
    private _disabledV: string = '0';
    private disabled: boolean = false;

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

    requestMessages() {
        // Create a saga pipe.
        const asyncTaskPipe = this.myMessageService.requestOwnMessages(
            0,
            0,
            this.currentWalletId,
            0,
            8,
            0,
            0,
            0,
            0,
            ''
        );

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_MESSAGE_LIST],
            [],
            asyncTaskPipe, {}));

        return false;
    }


    decrypt(mailId, walletId, bobPub, encryptedMessage) {
        const asyncTaskPipe = this.myMessageService.decryptMessage(
            walletId, bobPub, encryptedMessage
        );

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe, {}, (response) => {
                this.ngRedux.dispatch(setDecryptedContent(mailId, response));
            }, (response) => {

            })
        );
    }

    updateState() {
        const newState = this.ngRedux.getState();
        this.messages = getMyMessagesList(newState);
        this.currentMessage = this.messages[0];
        this.currentCategory = 0;

        this.currentWalletId = getConnectedWallet(newState);
        this.walletDirectoryList = getWalletDirectoryList(newState);
        this.walletWithCommuPub = this.walletListToSelectItem(this.walletDirectoryList);

        this.items = [this.walletWithCommuPub];

        console.log(this.currentWalletId);
        console.log(this.walletDirectoryList);
        console.log(this.walletWithCommuPub);

        if (getNeedRunDecryptState(newState)) {
            // this.decrypt(this.messages[0].recipientId, this.messages[0].senderPub, this.messages[0].content);
            this.ngRedux.dispatch({type: DONE_RUN_DECRYPT});

            for (const i in this.messages) {
                const message = this.messages[i];

                this.decrypt(message.mailId, message.recipientId, message.senderPub, message.content);

            }

        }

    }

    showMessage(index) {

        // set message to active to apply message-active css class
        this.messages[index].active = true;

        // set the current message that appears on the right hand side
        this.currentMessage = this.messages[index];

        // set the id so that message-active an be compared to index and set
        this.currentMessage.id = index;
    }

    showCategory(index, composeSelected) {

        console.log(index);

        if (composeSelected) {
            this.composeSelected = true;
        } else {
            // set message to active to apply active css class
            this.categories[index].active = true;

            this.composeSelected = false;
        }


        // set the current message that appears on the right hand side
        this.currentCategory = index;


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

        return walletsSelectItem.toJS();
    }

}
