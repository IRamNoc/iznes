import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
    InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService
} from '@setl/core-req-services';
import {SagaHelper, walletHelper} from '@setl/utils';
import {
    finishRegisterIssuerNotification, getConnectedWallet, getNewIssuerRequest, getWalletAddressList,
    REGISTER_ISSUER_FAIL, REGISTER_ISSUER_SUCCESS, setRequestedWalletAddresses
} from '@setl/core-store';

import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Unsubscribe} from 'redux';
import {Subscription} from 'rxjs/Subscription';
import {PersistService} from "@setl/core-persist";

@Component({
    selector: 'app-register-issuer',
    templateUrl: './register-issuer.component.html',
    styleUrls: ['./register-issuer.component.css']
})
export class RegisterIssuerComponent implements OnInit, OnDestroy {
    // Observable subscription array.
    subscriptionsArray: Array<Subscription> = [];

    walletAddressSelectItems: any;

    registerIssuerForm: FormGroup;
    issuerIdentifier: AbstractControl;
    issuerAddress: AbstractControl;
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
                private _changeDetectorRef: ChangeDetectorRef,
                private fb: FormBuilder,
                private myWalletService: MyWalletsService,
                private _persistService: PersistService) {

        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Form control setup
         */
        const formGroup = fb.group({
            'issueIdentifier': ['', Validators.required],
            'issuerAddress': ['', Validators.required]
        });

        this.registerIssuerForm = this._persistService.watchForm('assetServicing/registerIssuer', formGroup);

        this.issuerIdentifier = this.registerIssuerForm.controls['issueIdentifier'];
        this.issuerAddress = this.registerIssuerForm.controls['issuerAddress'];

        // List of observable subscriptions.
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe((requested) => this.requestWalletAddressList(requested)));
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

        this._changeDetectorRef.markForCheck();
    }

    requestWalletAddressList(requestedState: boolean) {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requested: boolean): void {
        // If the state is false, that means we need to request the list.
        if (!requested && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    registerIssuer(formValue) {
        if (this.registerIssuerForm.valid) {
            const issuerIdentifier = formValue.issueIdentifier;
            const issuerAddressSelectedArr = formValue.issuerAddress;
            const issuerAddress = issuerAddressSelectedArr[0].id;
            const walletId = this.connectedWalletId;

            // Send register issuer request.

            // Create a saga pipe.
            const asyncTaskPipe = this.walletnodeTxService.registerIssuer({
                walletId,
                issuerIdentifier,
                issuerAddress,
                metaData: {}
            });

            // Send a saga action.
            // Actions to dispatch, when request success:  LOGIN_SUCCESS.
            // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
            // saga pipe function descriptor.
            // Saga pipe function arguments.
            this.ngRedux.dispatch(SagaHelper.runAsync(
                [REGISTER_ISSUER_SUCCESS],
                [REGISTER_ISSUER_FAIL],
                asyncTaskPipe, {}));

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
                        <td class="left"><b>Issuer:</b></td>
                        <td>${currentRegisterIssuerRequest.issuerIdentifier}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Address:</b></td>
                        <td>${currentRegisterIssuerRequest.issuerAddress}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Tx hash:</b></td>
                        <td>${currentRegisterIssuerRequest.txHash.substring(0, 10)}...</td>
                    </tr>

                </tbody>
            </table>
        `);

    }

}
