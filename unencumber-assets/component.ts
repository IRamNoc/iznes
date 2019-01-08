import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, walletHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Subscription } from 'rxjs/Subscription';
import {
    WalletnodeTxService, WalletNodeRequestService, MyWalletsService, InitialisationService,
} from '@setl/core-req-services';
import { setRequestedWalletAddresses, ADD_WALLETNODE_TX_STATUS } from '@setl/core-store';

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
    noInstrumentsAlert: boolean = false;
    disableAssetSelect: boolean = true; // disable asset select until populated

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
    @select(['wallet', 'myWalletHolding', 'holdingByAsset']) holdingByAssetOb;
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
        public translate: MultilingualService,
    ) {
        /* Subscribe to the connectedWalletId and setup (or clear) the form group on wallet change */
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            if (this.connectedWalletId) {
                this.unencumberAssetsForm.reset();
                this.disableAssetSelect = true;
            } else {
                this.setFormGroup();
            }
            this.connectedWalletId = connectedWalletId;
        }));
        this.subscriptionsArray.push(this.holdingByAssetOb.subscribe(holdings => this.setAssetList(holdings)));
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
                    this.alertsService.generate(
                        'success',
                        this.translate.translate('The asset has been unencumbered.'),
                    );
                    this.unencumberAssetsForm.reset();
                },
                (data) => {
                    console.error('fail', data);

                    const message = !_.isEmpty(data[1].data.error)
                        ? `${this.translate.translate('Failed to unencumber asset. Reason:')}<br>${data[1].data.error}`
                    : this.translate.translate('Failed to unencumber asset.');
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
     * Sets the items for the Asset Select.
     *
     * @param {object} holdings
     */
    setAssetList(holdings) {
        const positiveHoldings = {};
        this.assetListOption = [];
        this.noInstrumentsAlert = false;
        if (_.get(holdings, this.connectedWalletId, false)) {
            for (const holding in holdings[this.connectedWalletId]) {
                if (holdings[this.connectedWalletId][holding].free > 0) positiveHoldings[holding] = holding;
            }
            this.assetListOption = walletHelper.walletInstrumentListToSelectItem(positiveHoldings);
        }
        this.assetListOption.length ? this.disableAssetSelect = false : this.noInstrumentsAlert = true;
        this.changeDetectorRef.markForCheck();
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
