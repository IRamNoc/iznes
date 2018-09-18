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
    setRequestedWalletInstrument, ADD_WALLETNODE_TX_STATUS,
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
    subscriptionsArray: Subscription[] = [];
    issueAssetForm: FormGroup;
    connectedWalletId: number;
    walletIssuerDetail: {
        walletIssuer: string;
        walletIssuerAddress: string;
    };
    walletInstrumentsSelectItems: any[];
    walletAddressSelectItems: any;
    walletDirectoryList = {};
    walletDirectoryListRaw: any[];
    walletRelationships: any[];

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    @select(['asset', 'myInstruments', 'instrumentList']) instrumentListOb;
    @select(['asset', 'myInstruments', 'newIssueAssetRequest']) newIssuerAssetRequest;
    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedAddressListLabelOb;
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryListOb;
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedWalletRelationshipListOb;
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) walletRelationshipListOb;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletService: MyWalletsService) {

        /* Subscribe to the connectedWalletId and setup (or clear) the form group on wallet change */
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            this.connectedWalletId = connectedWalletId;
            this.setFormGroup();
        }));
        this.subscriptionsArray.push(this.requestedInstrumentState.subscribe((requestedState) => {
            this.requestWalletInstruments(requestedState);
        }));
        this.subscriptionsArray.push(this.instrumentListOb.subscribe((instrumentList) => {
            this.walletInstrumentsSelectItems = walletHelper.walletInstrumentListToSelectItem(instrumentList);
            this.changeDetectorRef.markForCheck();
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
        this.subscriptionsArray.push(
            this.walletDirectoryListOb.subscribe((walletList) => {
                this.walletDirectoryListRaw = walletList;
                this.walletDirectoryList = walletHelper.walletAddressListToSelectItem(walletList, 'walletName');
            }),
        );
        this.subscriptionsArray.push(
            this.requestedWalletRelationshipListOb.subscribe((requested) => {
                if (!requested) {
                    InitialisationService.requestToRelationship(
                        this.ngRedux, this.myWalletService, this.connectedWalletId);
                }
            }),
            this.walletRelationshipListOb.subscribe((walletList) => {
                if (Object.keys(walletList).length) {
                    this.walletRelationships = walletHelper.walletToRelationshipToSelectItem(
                        walletList, this.walletDirectoryList);
                }
            }),
        );
        this.subscriptionsArray.push(this.newIssuerAssetRequest.subscribe((newIssueAssetRequest) => {
            this.showResponseModal(newIssueAssetRequest);
        }));
    }

    ngOnInit() {
    }

    /**
     * Sends an issueAsset request.
     *
     * @return {void}
     */
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

    /**
     * Creates an issueAssetForm.
     *
     * @return {void}
     */
    setFormGroup(): void {
        this.issueAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
        });
    }

    /**
     * Requests wallet instruments.
     *
     * @param {boolean} requestedInstrumentState
     */
    requestWalletInstruments(requestedInstrumentState: boolean) {
        if (!requestedInstrumentState) {
            const walletId = this.connectedWalletId;

            // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
            this.ngRedux.dispatch(setRequestedWalletInstrument());

            InitialisationService.requestWalletInstruments(this.ngRedux, this.walletNodeRequestService, walletId);
        }
    }

    /**
     * Requests wallet address list.
     *
     * @param {boolean} requestedAddressListState
     */
    requestWalletAddressList(requestedAddressListState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedAddressListState && this.connectedWalletId) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(
                this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    /**
     * Requests wallet address labels.
     *
     * @param {boolean} requestedAddressLabelsState
     */
    requestWalletLabel(requestedAddressLabelsState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedAddressLabelsState && this.connectedWalletId) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
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

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
