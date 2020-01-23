import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService,
} from '@setl/core-req-services';
import { SagaHelper, walletHelper } from '@setl/utils';
import {
    finishRegisterIssuerNotification, getConnectedWallet, getNewIssuerRequest, getWalletAddressList,
    REGISTER_ISSUER_FAIL, REGISTER_ISSUER_SUCCESS, setRequestedWalletAddresses, ADD_WALLETNODE_TX_STATUS,
} from '@setl/core-store';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Unsubscribe } from 'redux';
import { Subscription } from 'rxjs/Subscription';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-register-issuer',
    templateUrl: './register-issuer.component.html',
    styleUrls: ['./register-issuer.component.css'],
})
export class RegisterIssuerComponent implements OnInit, OnDestroy {
    // Observable subscription array.
    subscriptionsArray: Subscription[] = [];

    registerIssuerForm: FormGroup;
    walletAddressSelectItems: any;
    private connectedWalletId: number;

    // List of redux observable
    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;

    // Redux Unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private walletnodeTxService: WalletnodeTxService,
                private walletNodeRequestService: WalletNodeRequestService,
                private alertsService: AlertsService,
                private changeDetectorRef: ChangeDetectorRef,
                private myWalletService: MyWalletsService,
                public translate: MultilingualService,
    ) {

        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Register Issuer form
         */
        this.registerIssuerForm = new FormGroup({
            issueIdentifier: new FormControl('', Validators.required),
            issuerAddress: new FormControl('', Validators.required),
        });

        // List of observable subscriptions.
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested =>
            this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe(requested =>
            this.requestWalletAddressList(requested)));
    }

    ngOnInit() {
    }

    updateState() {
        const newState = this.ngRedux.getState();

        // Get wallet addresses and update wallet address items list
        const currentWalletAddressList = getWalletAddressList(newState);
        this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(currentWalletAddressList, 'label');

        // Set connected walletId
        this.connectedWalletId = getConnectedWallet(newState);

        // Get register Issuer response
        const currentRegisterIssuerRequest = getNewIssuerRequest(newState);
        if (currentRegisterIssuerRequest.needNotify) {
            this.showResponseModal(currentRegisterIssuerRequest);

            // Set need notify to false;

            this.ngRedux.dispatch(finishRegisterIssuerNotification());
        }

        this.changeDetectorRef.markForCheck();
    }

    requestWalletAddressList(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(
                this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requested: boolean): void {
        // If the state is false, that means we need to request the list.
        if (!requested && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    registerIssuer() {
        if (this.registerIssuerForm.valid) {
            // Trigger loading alert
            this.alertsService.create('loading');

            const issuerIdentifier = this.registerIssuerForm.value.issueIdentifier;
            const issuerAddressSelectedArr = this.registerIssuerForm.value.issuerAddress;
            const issuerAddress = issuerAddressSelectedArr[0].id;
            const walletId = this.connectedWalletId;

            // Create a saga pipe.
            const asyncTaskPipe = this.walletnodeTxService.registerIssuer({
                walletId,
                issuerIdentifier,
                issuerAddress,
                metaData: {},
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [REGISTER_ISSUER_SUCCESS, ADD_WALLETNODE_TX_STATUS],
                [REGISTER_ISSUER_FAIL],
                asyncTaskPipe, {},
                () => {
                },
                (data) => {
                    console.error('fail', data);
                    this.alertsService.generate('error', this.translate.translate('Failed to register issuer.'));
                },
            ));
        }

        return false;
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    showResponseModal(currentRegisterIssuerRequest) {
        this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Issuer')}:</b></td>
                        <td>${currentRegisterIssuerRequest.issuerIdentifier}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Address')}:</b></td>
                        <td>${currentRegisterIssuerRequest.issuerAddress}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Tx hash')}:</b></td>
                        <td>${currentRegisterIssuerRequest.txHash.substring(0, 10)}...</td>
                    </tr>
                </tbody>
            </table>
        `);
    }
}
