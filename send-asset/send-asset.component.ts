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
import { MultilingualService } from '@setl/multilingual';

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
    addressHoldingAmount: number = 0;
    showAddressHolding: boolean = false;
    tourConfig: any = {};

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
                private myWalletService: MyWalletsService,
                public translate: MultilingualService,
    ) {
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
            this.setTourConfig();
            if (!_.isEmpty(holdings) && holdings.hasOwnProperty(this.connectedWalletId) && this.connectedWalletId) {
                for (const holding in holdings[this.connectedWalletId]) {
                    /* Add to instrument list if free holdings is greater than 0 */
                    if (holdings[this.connectedWalletId][holding].free > 0) {
                        positiveHoldings[holding] = holding;
                    }
                    this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(positiveHoldings);
                    this.changeDetectorRef.markForCheck();
                }
                this.addressHoldings = holdings[this.connectedWalletId];
            }
            /* Display alert if there are no instruments in the list */
            if (!this.allInstrumentList.length) {
                this.noInstrumentsAlert = true;
                this.setTourConfig();
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

        this.setTourConfig();
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

                    this.updateAddressHoldings(data);
                },
                (data) => {
                    console.error('fail', data);

                    const message = !_.isEmpty(data[1].data.error)
                        ? `${this.translate.translate('Failed to send asset. Reason:<br>')} ${data[1].data.error}`
                        : this.translate.translate('Failed to send asset.');
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
        const addressPattern = '^[A]{1}[A-Za-z0-9_-]{32}[AQgw]{1}$';

        this.sendAssetForm = new FormGroup(
            {
                asset: new FormControl('', Validators.required),
                assetAddress: new FormControl('', Validators.required),
                recipient: new FormControl('', [Validators.required, Validators.pattern(addressPattern)]),
                amount: new FormControl('', [Validators.required, Validators.pattern('^((?!(0))[0-9]+)$')]),
            },
            [
                this.holdingsValidator,
            ],
        );
    }

    /**
     * Validate address holdings and trigger displaying the holding amount on the view
     *
     * @param {FormGroup} g
     */
    holdingsValidator = ((g: FormGroup) => {
        const asset = _.get(g.get('asset'), 'value[0].id', '');
        const assetAddress = _.get(g.get('assetAddress'), 'value[0].id', '');
        const amount = g.get('amount').value;
        const amountErrors = g.get('amount').errors;
        if (_.isObject(amountErrors)) delete amountErrors.insufficientFunds;

        if (asset && assetAddress) {
            const addressHolding = _.get(this.addressHoldings, `[${asset}].breakdown`, []).find((address) => {
                return address.addr === assetAddress;
            });
            this.addressHoldingAmount = _.get(addressHolding, 'free', 0);

            this.showAddressHolding = true;
            if (amount) {
                this.addressHoldingAmount < amount ?
                    g.get('amount').setErrors(Object.assign({}, amountErrors, { insufficientFunds: true }))
                    : g.get('amount').setErrors(_.isEmpty(amountErrors) ? null : amountErrors);
            }
        } else {
            this.showAddressHolding = false;
        }
        return null;
    });

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
                            <td class="left"><b>${this.translate.translate('Issuer')}:</b></td>
                            <td>${sendAssetResponse.issuerIdentifier}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>${this.translate.translate('Instrument')}:</b></td>
                            <td>${sendAssetResponse.instrument}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>${this.translate.translate('Issuer Address')}:</b></td>
                            <td>${sendAssetResponse.issuerAddress}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>${this.translate.translate('To Address')}:</b></td>
                            <td>${sendAssetResponse.toAddress}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>${this.translate.translate('Amount')}</b></td>
                            <td>${sendAssetResponse.amount}</td>
                        </tr>
                        <tr>
                            <td class="left"><b>${this.translate.translate('Tx hash')}:</b></td>
                            <td>${sendAssetResponse.txHash.substring(0, 10)}...</td>
                        </tr>
                        <tr>
                            <td class="left"><b>${this.translate.translate('Tx hash')}:</b></td>
                            <td>${sendAssetResponse.needNotify}</td>
                        </tr>
                    </tbody>
                </table>
            `);

            this.ngRedux.dispatch(finishSendAssetNotification());
        }
    }

    /**
     * Update addressHoldings object and form validation until block update comes in
     *
     * @param response
     */
    updateAddressHoldings(response) {
        const fromAddress = _.get(response, '[1].data.fromaddr', '');
        const toAddress = _.get(response, '[1].data.toaddr', '');
        const amount = _.get(response, '[1].data.amount', '');
        const asset = `${_.get(response, '[1].data.namespace', '')}|${_.get(response, '[1].data.classid', '')}`;
        const fromHolding = _.get(this.addressHoldings, `[${asset}].breakdown`, []).find((address) => {
            return address.addr === fromAddress;
        });
        const toHolding = _.get(this.addressHoldings, `[${asset}].breakdown`, []).find((address) => {
            return address.addr === toAddress;
        });

        /* Update addressHoldings object */
        if (!_.isEmpty(fromHolding)) fromHolding.free -= amount;
        if (!_.isEmpty(toHolding)) toHolding.free -= toHolding + amount;

        /* Refresh form validation */
        this.sendAssetForm.get('amount').updateValueAndValidity();
    }

    setTourConfig() {
        this.tourConfig = { tourName: 'usertour_sendasset' };
        if (this.noInstrumentsAlert) {
            this.tourConfig.stages = {
                usertour1: {
                    title: 'Send Asset',
                    text: `In this component you can create a request to send an amount of an asset from one address to
                       another. You don't have any assets setup for this wallet currently. Visit the
                       <a href="/#/asset-servicing/register-issuer">'Register Issuer'</a>
                       section to set up one and return later to complete the send asset tour.`,
                },
            };
        } else {
            this.tourConfig = {
                tourName: 'usertour_sendasset',
                stages: {
                    usertour1: {
                        title: 'Send Asset',
                        text: `In this component you can create a request to send an amount of an asset from one address
                        to another. This quick tour will guide you through creating a transaction request.`,
                    },
                    usertour2: {
                        title: 'Select the asset',
                        text: 'Select the asset you wish to send.',
                        highlight: true,
                        mustComplete: () => {
                            return this.sendAssetForm.controls.asset.valid;
                        },
                    },
                    usertour3: {
                        title: 'Select from address',
                        text: `Select the send from address for the transaction. You'll also be able to see how much
                        balance this address holds of this asset. Choose one with a positive balance.`,
                        highlight: true,
                        mustComplete: () => {
                            return this.sendAssetForm.controls.assetAddress.valid;
                        },
                    },
                    usertour4: {
                        title: 'Choose the recipient',
                        text: `Select the recipient address type and then find the recipient address for the
                        transaction. Make sure the recipient address is different to the from address.`,
                        mustComplete: () => {
                            return this.sendAssetForm.controls.recipient.valid;
                        },
                        highlight: true,
                    },
                    usertour5: {
                        title: 'Enter the amount',
                        text: 'Finally enter the amount you wish to send of the selected asset.',
                        highlight: true,
                        mustComplete: () => {
                            return this.sendAssetForm.controls.amount.valid;
                        },
                    },
                    usertour6: {
                        title: 'Send the request',
                        text: `If all of the steps above have been correctly completed and you are happy with the
                        details entered, you can now send your transaction request.`,
                        highlight: true,
                    },
                },
            };
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
