import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {SagaHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {WalletNodeRequestService, WalletnodeTxService} from '@setl/core-req-services';
import {
    getConnectedWallet,
    getRequestedInstrumentState,
    setRequestedWalletInstrument,
    SET_MY_INSTRUMENTS_LIST,
    getMyInstrumentsList
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {fromJS} from 'immutable';

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

    walletInstrumentsSelectItems: Array<any>;

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
            asset: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required)
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
        const RequestedIssuerState = getRequestedInstrumentState(newState);
        if (!RequestedIssuerState) {
            this.requestWalletInstruments();
        }

        const walletInstruments = getMyInstrumentsList(newState);

        this.walletInstrumentsSelectItems = walletInstrumentListToSelectItem(walletInstruments);
        console.log('items', this.walletInstrumentsSelectItems);
    }

    requestWalletInstruments() {

        const walletId = this.connectedWalletId;

        // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
        this.ngRedux.dispatch(setRequestedWalletInstrument());

        // Create a saga pipe.
        const asyncTaskPipe = this.walletNodeRequestService.walletInstrumentRequest({
            walletId
        });

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_MY_INSTRUMENTS_LIST],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    issueAsset() {
        if (this.issueAssetForm.valid) {
            console.log(this.issueAssetForm.value);
        }
        // const walletId = this.connectedWalletId;
        // const metaData = {};
        // const address = this.walletIssuerDetail.walletIssuerAddress;
        // const namespace = this.registerAssetForm.value.issuerIdentifier;
        // const instrument = this.registerAssetForm.value.instrumentIdentifier;
        //
        // // Create a saga pipe.
        // const asyncTaskPipe = this.walletnodeTxService.registerAsset({
        //     walletId,
        //     address,
        //     namespace,
        //     instrument,
        //     metaData
        // });
        //
        // // Send a saga action.
        // // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // // saga pipe function descriptor.
        // // Saga pipe function arguments.
        // this.ngRedux.dispatch(SagaHelper.runAsync(
        //     [REGISTER_ASSET_SUCCESS],
        //     [REGISTER_ASSET_FAIL],
        //     asyncTaskPipe,
        //     {},
        //     function (data) {
        //
        //     },
        //     function (data) {
        //         console.log('fail', data);
        //     }
        // ));

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

/**
 * Convert wallet instruments to an array the select2 can use to render a list a wallet instrument.
 * @param walletInstrumetnList
 * @return {any}
 */
function walletInstrumentListToSelectItem(walletInstrumentList: object): Array<any> {
    const walletInstrumentListImu = fromJS(walletInstrumentList);
    const walletInstrumentSelectItem = walletInstrumentListImu.reduce(
        (result, thisWalletInstrument, key) => {
            result.push({
                id: key,
                text: key
            });

            return result;
        }, []
    );

    return walletInstrumentSelectItem;
}
