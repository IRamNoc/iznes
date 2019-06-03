import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, walletHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Subscription } from 'rxjs/Subscription';
import { MultilingualService } from '@setl/multilingual';
import {
    WalletnodeTxService, WalletNodeRequestService, MyWalletsService, InitialisationService,
} from '@setl/core-req-services';
import { setRequestedWalletAddresses, ADD_WALLETNODE_TX_STATUS } from '@setl/core-store';

@Component({
    selector: 'app-encumber-assets',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EncumberAssetsComponent implements OnInit, OnDestroy {
    language = 'en';
    connectedWalletId: number = 0;
    encumberAssetsForm: FormGroup;
    isEncumberEnd = false;
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
                this.encumberAssetsForm.reset();
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
        this.subscriptionsArray.push(this.encumberAssetsForm.controls.includeToDate.valueChanges.subscribe((value) => {
            this.toggleEndDate(value);
        }));
    }

    ngOnInit() {
    }

    /**
     * Sends an encumberAsset request.
     *
     * @return {void}
     */
    encumberAsset(formValues) {
        if (this.encumberAssetsForm.valid) {
            // Trigger loading alert
            this.alertsService.create('loading');

            const startUTCSecs = new Date(`${formValues.fromDateUTC} ${formValues.fromTimeUTC}`).getTime() / 1000;
            const endUTCSecs =
                (formValues.toDateUTC !== '' && formValues.toTimeUTC !== '') ?
                    new Date(`${formValues.toDateUTC} ${formValues.toTimeUTC}`).getTime() / 1000 : 0;

            const asyncTaskPipe = this.walletnodeTxService.encumber(
                {
                    txtype: 'encum',
                    walletid: this.connectedWalletId,
                    reference: formValues.reference,
                    address: formValues.fromAddress[0].id,
                    subjectaddress: formValues.fromAddress[0].id,
                    namespace: formValues.asset[0].id.split('|')[0],
                    instrument: formValues.asset[0].id.split('|')[1],
                    amount: formValues.amount,
                    beneficiaries: [
                        [formValues.recipient, startUTCSecs, endUTCSecs],
                    ],
                    administrators: [
                        [formValues.recipient, startUTCSecs, endUTCSecs],
                    ],
                    protocol: '',
                    metadata: '',
                    iscumulative: false,
                });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [ADD_WALLETNODE_TX_STATUS],
                [],
                asyncTaskPipe,
                {},
                () => {
                    this.alertsService.generate(
                        'success',
                        this.translate.translate('The asset has been encumbered.'),
                    );
                    this.encumberAssetsForm.reset();
                },
                (data) => {
                    console.error('fail', data);
                    const message = !_.isEmpty(data[1].data.error)
                        ? `${this.translate.translate('Failed to encumber asset. Reason:')}<br>${data[1].data.error}`
                        : this.translate.translate('Failed to encumber asset.');
                    this.alertsService.generate('error', message);
                }),
            );
        }
    }

    /**
     * Creates an encumberAssetsForm.
     *
     * @return {void}
     */
    setFormGroup(): void {
        this.encumberAssetsForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            fromAddress: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', [Validators.required, Validators.pattern('^((?!(0))[0-9]+)$')]),
            reference: new FormControl(''),
            fromDateUTC: new FormControl('', [Validators.required,
                Validators.pattern('^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$')]),
            fromTimeUTC: new FormControl('', Validators.required),
            includeToDate: new FormControl(false),
            toDateUTC: new FormControl(''),
            toTimeUTC: new FormControl(''),
        });
    }

    /**
     * Toggles the visibility of the encumber end date form controls.
     *
     * @param {boolean} value
     */
    toggleEndDate(value: boolean): void {
        this.isEncumberEnd = value;
        if (value) {
            this.encumberAssetsForm.controls.toDateUTC.setValidators([
                Validators.required,
                Validators.pattern('^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'),
            ]);
            this.encumberAssetsForm.controls.toTimeUTC.setValidators([Validators.required]);
        } else {
            this.encumberAssetsForm.controls.toDateUTC.clearValidators();
            this.encumberAssetsForm.controls.toTimeUTC.clearValidators();
        }

        this.encumberAssetsForm.controls.toDateUTC.updateValueAndValidity();
        this.encumberAssetsForm.controls.toTimeUTC.updateValueAndValidity();

        console.log('+++ FORM GROUP', this.encumberAssetsForm);
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
        if (!requestedState && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
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
