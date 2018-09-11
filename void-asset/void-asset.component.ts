import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, walletHelper, LogService } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import {
    InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService,
} from '@setl/core-req-services';
import {
    setRequestedWalletAddresses, setRequestedWalletInstrument, getWalletIssuerDetail, ADD_WALLETNODE_TX_STATUS,
} from '@setl/core-store';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AlertsService } from '@setl/jaspero-ng2-alerts';

@Component({
    selector: 'app-void-asset',
    templateUrl: './void-asset.component.html',
    styleUrls: ['./void-asset.component.css'],
})

export class VoidAssetComponent implements OnInit, OnDestroy {
    subscriptionsArray: Subscription[] = [];

    voidAssetForm: FormGroup;
    connectedWalletId: number;
    walletIssuerDetail: {
        walletIssuer: string;
        walletIssuerAddress: string;
    };

    walletInstrumentsSelectItems: any[];
    walletAddressSelectItems: any;
    deleteAsset = false;

    /* List of redux observables. */
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedAddressListLabelOb;
    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    @select(['asset', 'myInstruments', 'instrumentList']) instrumentListOb;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletsService: MyWalletsService,
                private logService: LogService,
                private alertsService: AlertsService) {

        const newState = this.ngRedux.getState();
        this.walletIssuerDetail = getWalletIssuerDetail(newState);

        /* List of observable subscriptions. */
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            this.connectedWalletId = connectedWalletId;
            /* Reset the voidAssetForm. */
            this.setForm();
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
    }

    ngOnInit() {
        this.voidAssetForm.controls.deleteAsset.valueChanges.subscribe((value: boolean) => {
            this.deleteAsset = value;
        });
    }

    /**
     * Sets up the voidAssetForm.
     *
     * @returns void
     */
    setForm() {
        this.voidAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            deleteAsset: new FormControl(''),
        });
    }

    /**
     * Requests wallet address list.
     *
     * @param requestedState
     *
     * @returns void
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

    /**
     * Requests wallet labels.
     *
     * @param requestedState
     *
     * @returns void
     */
    requestWalletLabel(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletsService, this.connectedWalletId);
        }
    }

    /**
     * Requests wallet instruments.
     *
     * @param requestedInstrumentState
     *
     * @returns void
     */
    requestWalletInstruments(requestedInstrumentState) {
        if (!requestedInstrumentState) {
            const walletId = this.connectedWalletId;

            // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
            this.ngRedux.dispatch(setRequestedWalletInstrument());

            InitialisationService.requestWalletInstruments(this.ngRedux, this.walletNodeRequestService, walletId);
        }
    }

    /**
     * Sends voidAsset requests.
     *
     * @returns void
     */
    voidAsset() {
        if (this.voidAssetForm.valid) {
            // Trigger loading alert
            this.alertsService.create('loading');

            const walletId = this.connectedWalletId;
            const address = this.walletIssuerDetail.walletIssuerAddress;
            const fullAssetId = _.get(this.voidAssetForm.value.asset, '[0].id', '');
            const fullAssetIdSplit = walletHelper.splitFullAssetId(fullAssetId);
            const namespace = fullAssetIdSplit.issuer;
            const instrument = fullAssetIdSplit.instrument;
            const metaData = {};

            const requestData = {
                walletId: this.connectedWalletId,
                issuer: namespace,
                instrument,
            };

            const request = this.walletNodeRequestService.requestWalletIssueHolding(requestData);

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [],
                [],
                request,
                {},
                (data) => {
                    const issuanceHolders = data[1].data.holders;

                    if (Object.keys(issuanceHolders).length) {
                        let amount = 0;
                        const paymentlist = [];

                        Object.keys(issuanceHolders).forEach((key) => {
                            if (key !== address) {
                                paymentlist.push([key, String(issuanceHolders[key])]);
                                amount += issuanceHolders[key];
                            }
                        });

                        const voidAssetAsyncTaskPipe = this.walletnodeTxService.voidAsset({
                            walletId,
                            address,
                            namespace,
                            instrument,
                            amount,
                            paymentlist,
                        });

                        this.ngRedux.dispatch(SagaHelper.runAsync(
                            [ADD_WALLETNODE_TX_STATUS],
                            [],
                            voidAssetAsyncTaskPipe,
                            {},
                            (data) => {
                                console.log('void asset success:', data);

                                if (this.deleteAsset) {
                                    setTimeout(
                                        () => {
                                            const deleteAssetAsyncTaskPipe = this.walletnodeTxService.deleteAsset({
                                                walletId,
                                                address,
                                                namespace,
                                                instrument,
                                                metaData,
                                            });

                                            this.ngRedux.dispatch(SagaHelper.runAsync(
                                                [],
                                                [],
                                                deleteAssetAsyncTaskPipe,
                                                {},
                                                (data) => {
                                                    console.log('+++ deleteAsset response: ', data);

                                                    /* Check instruments. */
                                                    // setTimeout(
                                                    //     () => {
                                                    //         const requestData = {
                                                    //             walletId: this.connectedWalletId,
                                                    //         };

                                                    //         const instrumentsRequest = this.walletNodeRequestService.walletIssuerRequest(
                                                    //             requestData);

                                                    //         this.ngRedux.dispatch(SagaHelper.runAsync(
                                                    //             [],
                                                    //             [],
                                                    //             instrumentsRequest,
                                                    //             {},
                                                    //             (data) => {
                                                    //                 console.log('+++ instrumentsRequest data: ', data);
                                                    //             },
                                                    //             (data) => { },
                                                    //         ));

                                                    //         /* Show success modal. */
                                                    //         this.showSuccess(
                                                    //             'Asset issuance has been successfully voided and deleted.');
                                                    //         this.voidAssetForm.reset();
                                                    //     },
                                                    //     5000);

                                                    this.showAlert('success', 'Asset issuance has been successfully voided and deleted.');
                                                    this.voidAssetForm.reset();
                                                },
                                                (data) => {
                                                    console.log('fail', data);
                                                    this.showAlert('error', data[1].data.status);
                                                },
                                            ));
                                        },
                                        10000);
                                } else {
                                    /* Show success modal. */
                                    this.showAlert('success', 'Asset issuance has been successfully voided.');
                                    this.voidAssetForm.reset();
                                }

                            },
                            (data) => {
                                console.log('fail', data);
                                this.showAlert('error', data[1].data.status);
                            },
                        ));
                    } else {
                        this.showAlert('error', 'There are no holders of this asset.');
                    }
                },
                (data) => {
                    this.logService.log('Get issue holders error:', data);
                },
            ));
        }
    }

    showAlert(type, message) {
        const colour = type === 'error' ? 'danger' : type;

        this.alertsService.create(type, `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-${colour}">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
