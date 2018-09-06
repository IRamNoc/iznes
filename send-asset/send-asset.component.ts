import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, walletHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import {
    InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService,
} from '@setl/core-req-services';
import {
    finishSendAssetNotification, getConnectedWallet, getWalletDirectoryList, getWalletToRelationshipList,
    SEND_ASSET_FAIL, SEND_ASSET_SUCCESS, setRequestedWalletAddresses, ADD_WALLETNODE_TX_STATUS,
} from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Unsubscribe } from 'redux';
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
    addressList: any;
    toRelationshipSelectItems: any[];
    noInstrumentsAlert: boolean = false;

    // Asset
    @select(['wallet', 'myWalletHolding', 'holdingByAsset']) holdingByAssetOb;

    // Asset Address
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    // Send Asset
    @select(['asset', 'myInstruments', 'newSendAssetRequest']) newSendAssetRequest;

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletService: MyWalletsService) {

        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /* Subscribe to get the connected Wallet ID and setup/clear form group on change */
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connected) => {
            this.connectedWalletId = connected;
            this.setFormGroup();
        }));

        /* Filter the instrument list to only those the current wallet has positive balance of */
        this.subscriptionsArray.push(this.holdingByAssetOb.subscribe((holdings) => {
            if (!_.isEmpty(holdings) && holdings.hasOwnProperty(this.connectedWalletId) && this.connectedWalletId) {
                const positiveHoldings = {};
                this.allInstrumentList = [];
                this.noInstrumentsAlert = false;
                for (const holding in holdings[this.connectedWalletId]) {
                    /* Add to instrument list if free holdings is greater than 0 */
                    if (holdings[this.connectedWalletId][holding].free > 0) {
                        positiveHoldings[holding] = holding;
                    }
                    this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(positiveHoldings);
                    this.changeDetectorRef.markForCheck();
                }
            }
            /* Display alert if there are no instruments in the list */
            if (!this.allInstrumentList.length) {
                this.noInstrumentsAlert = true;
            }
        }));

        /* Subscribe to get the wallet list and set the select items */
        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => {
            this.addressList = walletHelper.walletAddressListToSelectItem(addressList, 'label');
            this.changeDetectorRef.markForCheck();
        }));

        /* Request address list if flag is not set */
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe((requested) => {
            this.requestAddressList(requested);
            this.changeDetectorRef.markForCheck();
        }));

        /* Request label list if flag is not set */
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe((requested) => {
            this.requestWalletLabel(requested);
        }));

        /* Subscribe to get the response from the Send Asset Request and show a modal */
        this.subscriptionsArray.push(this.newSendAssetRequest.subscribe((newSendAssetRequest) => {
            this.showResponseModal(newSendAssetRequest);
        }));
    }

    ngOnInit() {
    }

    setFormGroup(): void {
        /* Create a formGroup for sendAssetForm. */
        this.sendAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            assetAddress: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', [Validators.required, Validators.pattern('^((?!(0))[0-9]+)$')]),
        });
    }

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
                    const message = !_.isEmpty(data[1].data.error) ? 'Failed to send asset. Reason:<br>'
                        + data[1].data.error : 'Failed to send asset';
                    this.alertsService.create('error', `
                      <table class="table grid">
                          <tbody>
                              <tr>
                                  <td class="text-center text-danger">${message}</td>
                              </tr>
                          </tbody>
                      </table>`);
                },
            ));
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

    updateState(): void {
        const newState = this.ngRedux.getState();

        // Set connected WalletId
        this.connectedWalletId = getConnectedWallet(newState);

        const walletToRelationship = getWalletToRelationshipList(newState);
        const walletDirectoryList = getWalletDirectoryList(newState);

        this.toRelationshipSelectItems =
            walletHelper.walletToRelationshipToSelectItem(walletToRelationship, walletDirectoryList);
    }

    requestAddressList(requested: boolean): void {
        // If the state is false, that means we need to request the list.
        if (!requested && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
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

    convertAddressItemsForDropdown(items: any[]): any[] {
        // Creates an array of data suitable for ng-select
        const dropdownItems = [];

        _.forEach(items, (item) => {
            dropdownItems.push({
                id: item.addr,
                text: (item.label) ? item.label : item.addr,
            });
        });

        return dropdownItems;
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
