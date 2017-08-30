import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {SagaHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {WalletNodeRequestService, WalletnodeTxService} from '@setl/core-req-services';
import {
    getWalletAddressList
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';

@Component({
    selector: 'app-issue-asset',
    templateUrl: './issue-asset.component.html',
    styleUrls: ['./issue-asset.component.css']
})
export class IssueAssetComponent implements OnInit {
    issueAssetForm: FormGroup;
    connectedWalletId: number;
    walletIssuerDetail: {
        walletIssuer: string;
        walletIssuerAddress: string;
    };

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService) {
        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Issuer Asset form
         */
        this.issueAssetForm = new FormGroup({

        });
    }

    ngOnInit() {
    }

    updateState() {
        const newState = this.ngRedux.getState();
    }

    issueAsset() {
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
            {},
            function (data) {

            },
            function (data) {
                console.log('fail', data);
            }
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
