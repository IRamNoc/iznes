import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {FormBuilder, FormGroup, AbstractControl, Validators} from '@angular/forms';
import {List, Map, fromJS} from 'immutable';
import {
    WalletnodeTxService,
    WalletNodeRequestService,
    InitialisationService
} from '@setl/core-req-services';
import {SagaHelper, walletHelper} from '@setl/utils';
import {
    getWalletAddressList,
    REGISTER_ISSUER_SUCCESS,
    REGISTER_ISSUER_FAIL,
    getNewIssuerRequest,
    finishRegisterIssuerNotification,
    getConnectedWallet,
    setRequestedWalletAddresses
} from '@setl/core-store';

import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Unsubscribe} from 'redux';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-register-issuer',
    templateUrl: './register-issuer.component.html',
    styleUrls: ['./register-issuer.component.css']
})
export class RegisterIssuerComponent implements OnInit, OnDestroy {
    // Observable subscription array.
    subscriptionsArry: Array<Subscription> = [];

    walletAddressSelectItems: Array<any>;

    registerIssuerForm: FormGroup;
    issuerIdentifier: AbstractControl;
    issuerAddress: AbstractControl;
    private connectedWalleId: number;

    // List of redux observable
    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;

    // Redux Unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private walletnodeTxService: WalletnodeTxService,
                private walletNodeRequestService: WalletNodeRequestService,
                private alertsService: AlertsService,
                private fb: FormBuilder) {

        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Form control setup
         */
        this.registerIssuerForm = fb.group({
            'issueIdentifier': ['', Validators.required],
            'issuerAddress': ['', Validators.required]
        });

        this.issuerIdentifier = this.registerIssuerForm.controls['issueIdentifier'];
        this.issuerAddress = this.registerIssuerForm.controls['issuerAddress'];

        // List of observable subscriptions.
        this.subscriptionsArry.push(this.addressListRequestedStateOb.subscribe((requested) => this.requestWalletAddressList(requested)));
    }


    ngOnInit() {

    }

    updateState() {
        const newState = this.ngRedux.getState();

        // Get wallet addresses and update wallet address items list
        const currentWalletAddressList = getWalletAddressList(newState);
        this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(currentWalletAddressList);

        // Set connected walletId
        this.connectedWalleId = getConnectedWallet(newState);

        // Get register Issuer response
        const currentRegisterIssuerRequest = getNewIssuerRequest(newState);
        if (currentRegisterIssuerRequest.needNotify) {
            this.showResponseModal(currentRegisterIssuerRequest);

            // Set need notify to false;

            this.ngRedux.dispatch(finishRegisterIssuerNotification());
        }
    }

    requestWalletAddressList(requestedState: boolean) {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalleId);
        }
    }

    registerIssuer(formValue) {
        if (this.registerIssuerForm.valid) {
            const issuerIdentifier = formValue.issueIdentifier;
            const issuerAddressSelectedArr = formValue.issuerAddress;
            const issuerAddress = issuerAddressSelectedArr[0].id;
            const walletId = this.connectedWalleId;

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

        for (const subscription of this.subscriptionsArry) {
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

/**
 * Convert wallet Address to an array the select2 can use to render a list a wallet address.
 * @param walletAddressList
 * @return {any}
 */
function walletAddressListToSelectItem(walletAddressList: Array<any>): Array<any> {
    const walletAddressListImu = fromJS(walletAddressList);
    const walletAddressSelectItem = walletAddressListImu.map(
        (thisWalletAddress) => {
            return {
                id: thisWalletAddress.get('addr'),
                text: thisWalletAddress.get('addr')
            };
        }
    );

    return walletAddressSelectItem.toJS();
}
