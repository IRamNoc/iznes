import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, walletHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import {
    InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService,
} from '@setl/core-req-services';
import {
    finishIssueAssetNotification, ISSUE_ASSET_FAIL, ISSUE_ASSET_SUCCESS, setRequestedWalletAddresses,
    setRequestedWalletInstrument, setRequestedWalletToRelationship, ADD_WALLETNODE_TX_STATUS,
} from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-issue-asset',
    templateUrl: './issue-asset.component.html',
    styleUrls: ['./issue-asset.component.css'],
})
export class IssueAssetComponent implements OnInit, OnDestroy {
    // Observable subscription array.
    subscriptionsArray: Subscription[] = [];

    issueAssetForm: FormGroup;
    connectedWalletId: number;
    walletIssuerDetail: {
        walletIssuer: string;
        walletIssuerAddress: string;
    };

    walletInstrumentsSelectItems: any[];
    walletAddressSelectItems: any;
    toRelationshipSelectItems: any[] = [];
    toRelationshipList = {};
    walletDirectoryList = {};

    // List of redux observable
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedAddressListLabelOb;
    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    @select(['asset', 'myInstruments', 'instrumentList']) instrumentListOb;
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedToRelationshipState;
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) toRelationshipListOb;
    @select(['wallet', 'walletDirectory', 'walletList']) directoryListOb;
    @select(['asset', 'myInstruments', 'newIssueAssetRequest']) newIssuerAssetRequest;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletsService: MyWalletsService) {

        /**
         * Issuer Asset form
         */

        this.issueAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
        });

        // List of observable subscriptions.
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            this.connectedWalletId = connectedWalletId;
        }));
        this.subscriptionsArray.push(this.requestedAddressListLabelOb.subscribe((requested) => {
            this.requestWalletLabel(requested);
        }));
        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe((requested) => {
            this.requestWalletAddressList(requested);
        }));
        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => {
            this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(addressList, 'label');
            this.changeDetectorRef.markForCheck();
        }));
        this.subscriptionsArray.push(this.requestedInstrumentState.subscribe((requestedState) => {
            this.requestWalletInstruments(requestedState);
        }));
        this.subscriptionsArray.push(this.instrumentListOb.subscribe((instrumentList) => {
            this.walletInstrumentsSelectItems = walletHelper.walletInstrumentListToSelectItem(instrumentList);
            this.changeDetectorRef.markForCheck();
        }));
        this.subscriptionsArray.push(this.requestedToRelationshipState.subscribe((requestedState) => {
            this.requestWalletToRelationship(requestedState);
        }));
        this.subscriptionsArray.push(this.toRelationshipListOb.subscribe((toRelationshipList) => {
            this.toRelationshipList = toRelationshipList;
            this.changeDetectorRef.markForCheck();
            // this.updateToRelationship();
        }));
        this.subscriptionsArray.push(this.directoryListOb.subscribe((directoryList) => {
            this.walletDirectoryList = directoryList;
            this.changeDetectorRef.markForCheck();
            // this.updateToRelationship();
        }));

        this.subscriptionsArray.push(this.newIssuerAssetRequest.subscribe((newIssueAssetRequest) => {
            this.showResponseModal(newIssueAssetRequest);
        }));
    }

    ngOnInit() {
    }

    updateToRelationship() {
        this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(
            this.toRelationshipList, this.walletDirectoryList);
    }

    /**
     * Request wallet address list.
     *
     * @param requestedState
     */
    requestWalletAddressList(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(
                this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletsService, this.connectedWalletId);
        }
    }

    requestWalletInstruments(requestedInstrumentState) {
        if (!requestedInstrumentState) {
            const walletId = this.connectedWalletId;

            // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
            this.ngRedux.dispatch(setRequestedWalletInstrument());

            InitialisationService.requestWalletInstruments(this.ngRedux, this.walletNodeRequestService, walletId);
        }
    }

    requestWalletToRelationship(requestedInstrumentState) {
        if (!requestedInstrumentState) {
            const walletId = this.connectedWalletId;

            // Set requestedWalletToRelationship to true, to indicate we've already requested wallet to relationship.
            this.ngRedux.dispatch(setRequestedWalletToRelationship());

            InitialisationService.requestToRelationship(this.ngRedux, this.myWalletsService, walletId);
        }
    }

    issueAsset() {
        if (this.issueAssetForm.valid) {
            // Trigger loading alert
            this.alertsService.create('loading');

            const walletId = this.connectedWalletId;
            const address = this.issueAssetForm.value.recipient;
            const fullAssetId = _.get(this.issueAssetForm.value.asset, '[0].id', '');
            const fullAssetIdSplit = walletHelper.splitFullAssetId(fullAssetId);
            const namespace = fullAssetIdSplit.issuer;
            const instrument = fullAssetIdSplit.instrument;
            const amount = this.issueAssetForm.value.amount;

            // Create a saga pipe.
            const asyncTaskPipe = this.walletnodeTxService.issueAsset({
                walletId,
                address,
                namespace,
                instrument,
                amount,
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [ISSUE_ASSET_SUCCESS, ADD_WALLETNODE_TX_STATUS],
                [ISSUE_ASSET_FAIL],
                asyncTaskPipe,
                {},
                (data) => {
                    console.log('issue asset:', data);
                },
                (data) => {
                    console.error('fail', data);
                    this.alertsService.create('error', `
                      <table class="table grid">
                          <tbody>
                              <tr>
                                  <td class="text-center text-danger">Failed to issue asset</td>
                              </tr>
                          </tbody>
                      </table>`);
                },
            ));
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    showResponseModal(issuerAssetResponse) {
        if (issuerAssetResponse.needNotify) {
            this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>Issuer:</b></td>
                        <td>${issuerAssetResponse.issuerIdentifier}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Instrument:</b></td>
                        <td>${issuerAssetResponse.instrument}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Issuer Address:</b></td>
                        <td>${issuerAssetResponse.issuerAddress}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>To Address:</b></td>
                        <td>${issuerAssetResponse.toAddress}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Amount</b></td>
                        <td>${issuerAssetResponse.amount}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Tx hash:</b></td>
                        <td>${issuerAssetResponse.txHash.substring(0, 10)}...</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Tx hash:</b></td>
                        <td>${issuerAssetResponse.needNotify}</td>
                    </tr>
                </tbody>
            </table>
        `);

            this.ngRedux.dispatch(finishIssueAssetNotification());
        }
    }
}
