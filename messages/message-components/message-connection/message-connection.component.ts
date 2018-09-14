import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { setRequestedWalletAddresses } from '@setl/core-store';
import { InitialisationService, MyWalletsService, WalletNodeRequestService } from '@setl/core-req-services';
import { MessageConnection, MessageConnectionConfig } from './message-connection.model';
import { SetlMessageConnectionService } from './message-connection.service';

@Component({
    selector: 'setl-message-connection',
    templateUrl: './message-connection.component.html',
    styleUrls: ['./message-connection.component.css'],
})
export class SetlMessageConnectionComponent implements OnInit, OnDestroy {
    @Input() config: MessageConnectionConfig = null;
    @Input() isActed: boolean = false;
    @Input() walletId: number = null;
    @Input() mailId: number = null;

    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListObs;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListObs;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListObs;

    isModalDisplayed: boolean;
    currentAction: MessageConnection;
    formGroup: FormGroup;
    addressList: string[];
    subscriptionArray: Subscription[] = [];

    constructor(private ngRedux: NgRedux<any>,
                private myWalletService: MyWalletsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private service: SetlMessageConnectionService,
                private changeDetectorRef: ChangeDetectorRef) {
        this.isModalDisplayed = false;
        this.initFormGroup();
    }

    ngOnInit() {
        this.initFormGroup();

        this.subscriptionArray.push(this.requestedLabelListObs.subscribe((requested) => {
            this.requestWalletLabel(requested);
        }));
        this.subscriptionArray.push(this.requestedAddressListObs.subscribe((requested) => {
            this.requestAddressList(requested);
        }));
        this.subscriptionArray.push(this.addressListObs.subscribe((addresses) => {
            this.getAddressList(addresses);
        }));
    }

    ngOnDestroy() {
        this.subscriptionArray.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    initFormGroup() {
        this.formGroup = new FormGroup({
            selectedAddress: new FormControl('', [Validators.required]),
        });
    }

    requestWalletLabel(requested: any) {
        if (!requested && this.walletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.walletId);
        }
    }

    requestAddressList(requested: boolean) {
        if (!requested && this.walletId !== 0) {
            this.ngRedux.dispatch(setRequestedWalletAddresses());
            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.walletId);
        }
    }

    getAddressList(addresses: any) {
        const data = [];

        Object.keys(addresses).map((key) => {
            data.push({
                id: key,
                text: addresses[key].label,
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
            this.service.doAction(action, this.walletId, this.mailId);
            this.showConnectionRequestActioned();
            break;
        }
    }

    handleAcceptButtonClick(isAccepted: boolean) {
        if (isAccepted) {
            this.currentAction.payload.address = this.formGroup.controls['selectedAddress'].value[0].id;
            this.service.doAction(this.currentAction, this.walletId, this.mailId);
            this.showConnectionRequestActioned();
        }

        this.resetForm();
    }

    resetForm() {
        this.currentAction = null;
        this.isModalDisplayed = false;
        this.formGroup.controls['selectedAddress'].setValue(['']);
        this.formGroup.reset();
    }

    showConnectionRequestActioned() {
        this.isActed = true;
        this.changeDetectorRef.detectChanges();
    }
}
