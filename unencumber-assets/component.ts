import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { SagaHelper, walletHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Subscription } from 'rxjs/Subscription';
import { Unsubscribe } from 'redux';
import {
    WalletnodeTxService, WalletNodeRequestService, MyWalletsService, InitialisationService,
} from '@setl/core-req-services';

import {
    getWalletToRelationshipList,
    getWalletDirectoryList,
    getWalletAddressList,
    setRequestedWalletAddresses,
    setRequestedWalletInstrument,
} from '@setl/core-store';

@Component({
    selector: 'app-unencumber-assets',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UnencumberAssetsComponent implements OnInit, OnDestroy {
    language = 'en';

    unencumberAssetsForm: FormGroup;
    isUnencumberEnd = false;
    assetListOption = [];
    fromAddressListOption = [];
    toAddressListOption = [];

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

    connectedWalletId: number;
    toRelationshipSelectItems = [];

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListObs;
    @select(['wallet', 'myWalletAddress', 'addressList']) subPortfolioAddressObs;
    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    @select(['asset', 'myInstruments', 'instrumentList']) instrumentListOb;

    // Redux Unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(
        private formBuilder: FormBuilder,
        private ngRedux: NgRedux<any>,
        private walletnodeTxService: WalletnodeTxService,
        private myWalletService: MyWalletsService,
        private walletNodeRequestService: WalletNodeRequestService,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
    ) {
        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((locale) => {
            this.getLanguage(locale);
        }));
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            this.connectedWalletId = connectedWalletId;
        }));
        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe((requested) => {
            this.requestWalletAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedInstrumentState.subscribe((requestedState) => {
            this.requestWalletInstruments(requestedState);
        }));
        this.subscriptionsArray.push(this.instrumentListOb.subscribe((instrumentList) => {
            this.assetListOption = walletHelper.walletInstrumentListToSelectItem(instrumentList);
        }));
        this.subscriptionsArray.push(this.requestedLabelListObs.subscribe((requested) => {
            this.requestWalletLabel(requested)
        }));
        this.subscriptionsArray.push(this.subPortfolioAddressObs.subscribe((addresses) => {
            this.getAddressList(addresses)
        }));
    }

    ngOnInit() {
        this.unencumberAssetsForm = this.formBuilder.group({
            asset: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            fromAddress: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            toAddress: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            amount: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            reference: [
                '',
            ],
        });
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    updateState() {
        const newState = this.ngRedux.getState();

        if (this.fromAddressListOption.length === 0) {
            // Get wallet addresses and update wallet address items list
            const currentWalletAddressList = getWalletAddressList(newState);
            this.fromAddressListOption = walletHelper.walletAddressListToSelectItem(currentWalletAddressList);
        }

        if (this.toRelationshipSelectItems.length === 0) {
            const walletToRelationship = getWalletToRelationshipList(newState);
            const walletDirectoryList = getWalletDirectoryList(newState);
            this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(
                walletToRelationship, walletDirectoryList);
        }

        this.changeDetectorRef.markForCheck();
    }

    getAddressList(addresses: any[]) {
        const data = [];

        Object.keys(addresses).map((key) => {
            data.push({
                id: key,
                text: addresses[key].label,
            });
        });

        this.fromAddressListOption = data;
        this.changeDetectorRef.markForCheck();
    }

    requestWalletAddressList(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(
                this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
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

    requestWalletLabel(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
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

    // To unencumber, encumber must have ended before Date.now()
    save(formValues) {
        if (!this.unencumberAssetsForm.valid) {
            return;
        }
        // Trigger loading alert
        this.alertsService.create('loading');

        const asyncTaskPipe = this.walletnodeTxService.unencumber(
            {
                txtype: 'unenc',
                walletid: this.connectedWalletId,
                reference: formValues.reference,
                address: formValues.fromAddress[0].id, // Beneficiary or Administrator address
                subjectaddress: formValues.toAddress, // Asset Holder/Owner address
                namespace: formValues.asset[0].id.split('|')[0],
                instrument: formValues.asset[0].id.split('|')[1],
                amount: formValues.amount,
                protocol: '',
                metadata: '',
            });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.showAlert('success', 'Asset has successfully been unencumbered');
                this.unencumberAssetsForm.reset();
            },
            (data) => {
                console.error('fail', data);
                const message = !_.isEmpty(data[1].data.error) ? 'Failed to unencumber asset. Reason:<br>'
                    + data[1].data.error : 'Failed to unencumber asset.';
                this.showAlert('error', message);
            }),
        );
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
}
