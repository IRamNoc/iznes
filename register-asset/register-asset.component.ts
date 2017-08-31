import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux} from '@angular-redux/store';
import {WalletNodeRequestService, WalletnodeTxService} from '@setl/core-req-services';
import {SagaHelper} from '@setl/utils';
import {
    getConnectedWallet,
    getRequestedIssuerState,
    setRequestedWalletIssuer,
    SET_WALLET_ISSUER_LIST,
    getWalletIssuerDetail,
    REGISTER_ASSET_SUCCESS,
    REGISTER_ASSET_FAIL,
    getNewInstrumentRequest,
    finishRegisterInstrumentNotification
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';

@Component({
    selector: 'app-register-asset',
    templateUrl: './register-asset.component.html',
    styleUrls: ['./register-asset.component.css']
})
export class RegisterAssetComponent implements OnInit {
    registerAssetForm: FormGroup;
    connectedWalletId: number;
    walletIssuerDetail: {
        walletIssuer: string;
        walletIssuerAddress: string;
    };

    constructor(private alertsService: AlertsService,
                private ngRedux: NgRedux<any>,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService) {
        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Register Asset form
         */
        this.registerAssetForm = new FormGroup({
            issuerIdentifier: new FormControl(this.walletIssuerDetail.walletIssuer, Validators.required),
            instrumentIdentifier: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
    }

    updateState() {
        const newState = this.ngRedux.getState();

        // Set connected WalletId
        this.connectedWalletId = getConnectedWallet(newState);

        // If my issuer list is not yet requested,
        // Request wallet issuers
        const RequestedIssuerState = getRequestedIssuerState(newState);
        if (!RequestedIssuerState) {
            this.requestWalletIssuer();
        }

        // Set wallet Issuer detail
        const walletIssuerDetail = getWalletIssuerDetail(newState);
        this.walletIssuerDetail = walletIssuerDetail;
        if (this.registerAssetForm) {
            const walletIssuer = this.walletIssuerDetail.walletIssuer;
            this.registerAssetForm.controls['issuerIdentifier'].patchValue(walletIssuer, {onlySelf: true});
        }

        // Get register Asset response
        const currentRegisterAssetRequest = getNewInstrumentRequest(newState);
        if (currentRegisterAssetRequest.needNotify) {
            this.showResponseModal(currentRegisterAssetRequest);

            // Set need notify to false;

            this.ngRedux.dispatch(finishRegisterInstrumentNotification());
        }
    }

    requestWalletIssuer() {
        if (this.registerAssetForm.valid) {

            const walletId = this.connectedWalletId;

            // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
            this.ngRedux.dispatch(setRequestedWalletIssuer());

            // Create a saga pipe.
            const asyncTaskPipe = this.walletNodeRequestService.walletIssuerRequest({
                walletId
            });

            // Send a saga action.
            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_WALLET_ISSUER_LIST],
                [],
                asyncTaskPipe,
                {}
            ));
        }
    }

    registerAsset() {
        const walletId = this.connectedWalletId;
        const metaData = {};
        const address = this.walletIssuerDetail.walletIssuerAddress;
        const namespace = this.registerAssetForm.value.issuerIdentifier;
        const instrument = this.registerAssetForm.value.instrumentIdentifier;

        // Create a saga pipe.
        const asyncTaskPipe = this.walletnodeTxService.registerAsset({
            walletId,
            address,
            namespace,
            instrument,
            metaData
        });

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [REGISTER_ASSET_SUCCESS],
            [REGISTER_ASSET_FAIL],
            asyncTaskPipe,
            {}
        ));

    }

    showResponseModal(currentRegisterInstrumentRequest) {

        this.alertsService.create('success', `
            <table class="table grid">

                <tbody>
                    <tr>
                        <td class="left"><b>Issuer:</b></td>
                        <td>${currentRegisterInstrumentRequest.issuerIdentifier}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Instrument:</b></td>
                        <td>${currentRegisterInstrumentRequest.instrument}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Address:</b></td>
                        <td>${currentRegisterInstrumentRequest.issuerAddress}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Tx hash:</b></td>
                        <td>${currentRegisterInstrumentRequest.txHash.substring(0, 10)}...</td>
                    </tr>
                </tbody>
            </table>
        `);

    }

}
