import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, walletHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Subscription } from 'rxjs/Subscription';
import {
    WalletnodeTxService, WalletNodeRequestService, MyWalletsService, InitialisationService,
} from '@setl/core-req-services';

import {
    setRequestedWalletAddresses,
    setRequestedWalletInstrument,
    ADD_WALLETNODE_TX_STATUS,
} from '@setl/core-store';

@Component({
    selector: 'app-unencumber-assets',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UnencumberAssetsComponent implements OnInit, OnDestroy {
    language = 'en';
    connectedWalletId: number;
    unencumberAssetsForm: FormGroup;
    isUnencumberEnd = false;
    assetListOption = [];
    walletAddressSelectItems: any;
    walletDirectoryList = {};
    walletDirectoryListRaw: any[];
    walletRelationships: any[];

    configFiltersDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
    };

    configFiltersTime = {
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
    };

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    @select(['asset', 'myInstruments', 'instrumentList']) instrumentListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListObs;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryListOb;
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedWalletRelationshipListOb;
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) walletRelationshipListOb;

    constructor(
        private ngRedux: NgRedux<any>,
        private walletnodeTxService: WalletnodeTxService,
        private myWalletService: MyWalletsService,
        private walletNodeRequestService: WalletNodeRequestService,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
    ) {
        /* Subscribe to the connectedWalletId and setup (or clear) the form group on wallet change */
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            this.connectedWalletId = connectedWalletId;
            this.setFormGroup();
        }));
        this.subscriptionsArray.push(this.requestedInstrumentState.subscribe((requestedState) => {
            this.requestWalletInstruments(requestedState);
        }));
        this.subscriptionsArray.push(this.instrumentListOb.subscribe((instrumentList) => {
            this.assetListOption = walletHelper.walletInstrumentListToSelectItem(instrumentList);
        }));
        this.subscriptionsArray.push(this.requestedLabelListObs.subscribe((requested) => {
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
                this.changeDetectorRef.markForCheck();
            }),
        );
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((locale) => {
            this.getLanguage(locale);
        }));
    }

    ngOnInit() {
    }

    /**
     * Sends an unencumberAsset request. (To unencumber, the encumber must have ended before Date.now())
     *
     * @return {void}
     */
    unencumberAsset(formValues) {
        if (this.unencumberAssetsForm.valid) {
            // Trigger loading alert
            this.alertsService.create('loading');

            const asyncTaskPipe = this.walletnodeTxService.unencumber(
                {
                    txtype: 'unenc',
                    walletid: this.connectedWalletId,
                    reference: formValues.reference,
                    address: formValues.fromAddress[0].id, // Beneficiary or Administrator address
                    subjectaddress: formValues.recipient, // Asset Holder/Owner address
                    namespace: formValues.asset[0].id.split('|')[0],
                    instrument: formValues.asset[0].id.split('|')[1],
                    amount: formValues.amount,
                    protocol: '',
                    metadata: '',
                });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [ADD_WALLETNODE_TX_STATUS],
                [],
                asyncTaskPipe,
                {},
                () => {
                    this.alertsService.generate('success', 'The asset has been unencumbered.');
                    this.unencumberAssetsForm.reset();
                },
                (data) => {
                    console.error('fail', data);
                    const message = !_.isEmpty(data[1].data.error) ? `Failed to unencumber asset. Reason:<br>
                        ${data[1].data.error}` : 'Failed to unencumber asset.';
                    this.alertsService.generate('error', message);
                }),
            );
        }
    }

    /**
     * Creates an unencumberAssetsForm.
     *
     * @return {void}
     */
    setFormGroup(): void {
        this.unencumberAssetsForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            fromAddress: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', [Validators.required, Validators.pattern('^((?!(0))[0-9]+)$')]),
            reference: new FormControl(''),
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
     * @param {boolean} requestedState
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
     * Requests wallet address labels.
     *
     * @param {boolean} requestedState
     */
    requestWalletLabel(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    getLanguage(locale): void {
        if (locale) {
            switch (locale) {
            case 'fra':
                this.language = 'fr';
                break;
            case 'eng':
                this.language = 'en';
                break;
            default:
                this.language = 'en';
                break;
            }
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
