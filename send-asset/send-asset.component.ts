import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, walletHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import {
    InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService,
} from '@setl/core-req-services';
import {
    finishSendAssetNotification, SEND_ASSET_FAIL, SEND_ASSET_SUCCESS, setRequestedWalletAddresses,
    ADD_WALLETNODE_TX_STATUS,
} from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-send-asset',
    templateUrl: './send-asset.component.html',
    styleUrls: ['./send-asset.component.css'],
})
export class SendAssetComponent implements OnInit, OnDestroy {
    sendAssetForm: FormGroup;
    subscriptionsArray: Subscription[] = [];
    connectedWalletId: number;
    allInstrumentList: any[];
    noInstrumentsAlert: boolean = false;
    walletAddressSelectItems: any;
    walletDirectoryList = {};
    walletDirectoryListRaw: any[];
    walletRelationships: any[];
    addressHoldings: {} = {};

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletHolding', 'holdingByAsset']) holdingByAssetOb;
    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedAddressListLabelOb;
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryListOb;
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedWalletRelationshipListOb;
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) walletRelationshipListOb;
    @select(['asset', 'myInstruments', 'newSendAssetRequest']) newSendAssetRequest;

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

        /* Filter the instrument list to only those the current wallet has positive balance of */
        this.subscriptionsArray.push(this.holdingByAssetOb.subscribe((holdings) => {
            const positiveHoldings = {};
            this.allInstrumentList = [];
            this.noInstrumentsAlert = false;
            if (!_.isEmpty(holdings) && holdings.hasOwnProperty(this.connectedWalletId) && this.connectedWalletId) {
                for (const holding in holdings[this.connectedWalletId]) {
                    /* Add to instrument list if free holdings is greater than 0 */
                    if (holdings[this.connectedWalletId][holding].free > 0) {
                        positiveHoldings[holding] = holding;
                    }
                    this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(positiveHoldings);
                    this.changeDetectorRef.markForCheck();

                    /* Save holdings by address for validation checks */
                    for (const breakdown in holdings[this.connectedWalletId][holding].breakdown) {
                        const address = holdings[this.connectedWalletId][holding].breakdown[breakdown];
                        if (_.isEmpty(this.addressHoldings[holding])) this.addressHoldings[holding] = {};
                        this.addressHoldings[holding][address.addr] = address.free;
                    }
                }
            }
            console.log('+++ this.addressHoldings', this.addressHoldings);

            /* Display alert if there are no instruments in the list */
            if (!this.allInstrumentList.length) {
                this.noInstrumentsAlert = true;
            }
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
        this.subscriptionsArray.push(this.newSendAssetRequest.subscribe((newSendAssetRequest) => {
            this.showResponseModal(newSendAssetRequest);
        }));
    }

    ngOnInit() {
    }

    /**
     * Sends a sendAsset request.
     *
     * @return {void}
     */
    sendAsset(): void {
        if (this.sendAssetForm.valid) {
            // Trigger loading alert
            this.alertsService.create('loading');

            const walletId = this.connectedWalletId;
            const toAddress = this.sendAssetForm.value.recipient;
            const fullAssetId = _.get(this.sendAssetForm.value.asset, '[0].id', '');
            const fullAssetIdSplit = walletHelper.splitFullAssetId(fullAssetId);
            const fromAddress = _.get(this.sendAssetForm.value.assetAddress, '[0].id', '');
            const namespace = fullAssetIdSplit.issuer;
            const instrument = fullAssetIdSplit.instrument;
            const amount = this.sendAssetForm.value.amount;

            // Create a saga pipe.
            const asyncTaskPipe = this.walletnodeTxService.sendAsset({
                walletId,
                toAddress,
                fromAddress,
                namespace,
                instrument,
                amount,
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SEND_ASSET_SUCCESS, ADD_WALLETNODE_TX_STATUS],
                [SEND_ASSET_FAIL],
                asyncTaskPipe,
                {},
                (data) => {
                    console.log('send asset:', data);
                },
                (data) => {
                    console.error('fail', data);
                    const message = !_.isEmpty(data[1].data.error) ? `Failed to send asset. Reason:<br>
                        ${data[1].data.error}` : 'Failed to send asset.';
                    this.alertsService.generate('error', message);
                },
            ));
        }
    }

    /**
     * Creates a sendAssetForm.
     *
     * @return {void}
     */
    setFormGroup(): void {
        this.sendAssetForm = new FormGroup(
            {
                asset: new FormControl('', Validators.required),
                assetAddress: new FormControl('', Validators.required),
                recipient: new FormControl('', Validators.required),
                amount: new FormControl('', [Validators.required, Validators.pattern('^((?!(0))[0-9]+)$')]),
            },
            [
                (g: FormGroup) => {
                    const asset = g.get('asset').value;
                    const assetAddress = g.get('assetAddress').value;
                    const amount = g.get('amount').value;

                    if (asset && assetAddress && amount) {
                        console.log('+++ this', this);

                        if (this.addressHoldings[asset[0].id].hasOwnProperty(assetAddress[0].id)) {
                            this.addressHoldings[asset[0].id][assetAddress[0].id] < amount ?
                                g.get('amount').setErrors({ insufficientFunds: true }) : g.get('amount').setErrors(null);
                        }
                    }
                    return null;
                },
            ],
        );
    }

    /**
     * Validate Address Holdings
     *
     * @return null
     */
    validateAddressHoldings(g: FormGroup) {
        const asset = g.get('asset').value;
        const assetAddress = g.get('assetAddress').value;
        const amount = g.get('amount').value;

        if (asset && assetAddress && amount) {
            console.log('+++ this', this);

            if (this.addressHoldings[asset[0].id].hasOwnProperty(assetAddress[0].id)) {
                this.addressHoldings[asset[0].id][assetAddress[0].id] < amount ?
                    g.get('amount').setErrors({ insufficientFunds: true }) : g.get('amount').setErrors(null);
            }
        }
        return null;
    }

    /**
     * Requests wallet address list.
     *
     * @param {boolean} requestedState
     */
    requestWalletAddressList(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(
                this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    /**
     * Requests wallet address labels.
     *
     * @param {boolean} requestedState
     */
    requestWalletLabel(requested: boolean): void {
        // If the state is false, that means we need to request the list.
        if (!requested && this.connectedWalletId) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    showResponseModal(sendAssetResponse) {
        if (sendAssetResponse.needNotify) {
            this.alertsService.create('success', `
                <table class="table grid">
                    <tbody>
                        <tr>
                            <td class="left"><b>Issuer:</b></td>
                            <td>${sendAssetResponse.issuerIdentifier}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>Instrument:</b></td>
                            <td>${sendAssetResponse.instrument}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>Issuer Address:</b></td>
                            <td>${sendAssetResponse.issuerAddress}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>To Address:</b></td>
                            <td>${sendAssetResponse.toAddress}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>Amount</b></td>
                            <td>${sendAssetResponse.amount}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>Tx hash:</b></td>
                            <td>${sendAssetResponse.txHash.substring(0, 10)}...</td>
                        </tr>
                        <tr>
                            <td class="left"><b>Tx hash:</b></td>
                            <td>${sendAssetResponse.needNotify}</td>
                        </tr>
                    </tbody>
                </table>
            `);

            this.ngRedux.dispatch(finishSendAssetNotification());
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
