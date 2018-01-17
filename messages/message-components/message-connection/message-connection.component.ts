import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {setRequestedWalletAddresses} from '@setl/core-store';
import {InitialisationService, MyWalletsService, WalletNodeRequestService} from '@setl/core-req-services';

import {MessageConnection, MessageConnectionConfig} from './message-connection.model';
import {SetlMessageConnectionService} from './message-connection.service';

/**
 * SETL Message Connection Component
 *
 * Allows for the display and use of actions within mail messages
 *
 * @uses FileViewerComponent to download display the attachment
 */
@Component({
    selector: 'setl-message-connection',
    templateUrl: './message-connection.component.html',
    styleUrls: ['./message-connection.component.css'],
})
export class SetlMessageConnectionComponent implements OnInit, OnDestroy {
    @Input() config: MessageConnectionConfig;
    @Input() isActed: boolean;
    @Input() walletId: number;
    @Input() mailId: number;

    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListObs;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListObs;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListObs;

    isModalDisplayed: boolean;
    currentAction: MessageConnection;
    formGroup: FormGroup;
    addressList: Array<string>;
    subscriptionArray: Array<Subscription> = [];

    constructor(private ngRedux: NgRedux<any>,
                private _myWalletService: MyWalletsService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private service: SetlMessageConnectionService) {
        this.isModalDisplayed = false;
        this.initFormGroup();
    }

    ngOnInit() {
        this.initFormGroup();

        this.subscriptionArray.push(this.requestedLabelListObs.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionArray.push(this.requestedAddressListObs.subscribe((requested) => this.requestAddressList(requested)));
        this.subscriptionArray.push(this.addressListObs.subscribe((addresses) => this.getAddressList(addresses)));
    }

    ngOnDestroy() {
        this.subscriptionArray.forEach((subscription) => subscription.unsubscribe());
    }

    initFormGroup() {
        this.formGroup = new FormGroup({
            'selectedAddress': new FormControl('', [Validators.required])
        });
    }

    requestWalletLabel(requested: any) {
        if (!requested && this.walletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this._myWalletService, this.walletId);
        }
    }

    requestAddressList(requested: boolean) {
        if (!requested && this.walletId !== 0) {
            this.ngRedux.dispatch(setRequestedWalletAddresses());
            InitialisationService.requestWalletAddresses(this.ngRedux, this._walletNodeRequestService, this.walletId);
        }
    }

    getAddressList(addresses: any) {
        let data = [];

        Object.keys(addresses).map((key) => {
            data.push({
                id: key,
                text: addresses[key].label
            });
        });

        this.addressList = data;
    }

    onActionClick(action: MessageConnection): void {
        switch (action.text) {
            case 'Accept':
                this.isModalDisplayed = true;
                this.currentAction = action;
                break;
            case 'Reject':
                this.service.doAction(action, 'The connection has successfully been rejected');
                break;
        }
    }

    handleAcceptButtonClick(isAccepted: boolean) {
        if (isAccepted) {
            this.currentAction.payload.address = this.formGroup.controls['selectedAddress'].value[0].id;
            this.service.doAction(this.currentAction, 'The connection has successfully been accepted');
        }

        this.resetForm();
    }

    resetForm() {
        this.currentAction = null;
        this.isModalDisplayed = false;
        this.formGroup.controls['selectedAddress'].setValue(['']);
        this.formGroup.reset();
    }
}
