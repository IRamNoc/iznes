import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {
    AbstractControl, // less code
    FormArray,
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import {ConfirmationService, SagaHelper, walletHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import * as _ from 'lodash';

// import {ChainInterface} from './interface';
// import {ChainModel} from './model';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

// Internal
import {Subscription} from 'rxjs/Subscription';
import {Unsubscribe} from 'redux';

// Services
import {WalletnodeTxService, WalletNodeRequestService, MyWalletsService, InitialisationService} from '@setl/core-req-services';
import {MultilingualService} from '@setl/multilingual';

// Store
import {
    getWalletToRelationshipList,
    getWalletDirectoryList,
    getWalletAddressList,
    getConnectedWallet,
    setRequestedWalletAddresses,
    setRequestedWalletInstrument,
} from '@setl/core-store';

@Component({
    selector: 'app-encumber-assets',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EncumberAssetsComponent implements OnInit, OnDestroy {

    language = 'en';

    encumberAssetsForm: FormGroup;
    isEncumberEnd = false;

    assetListOption = [];
    fromAddressListOption = [];
    toAddressListOption = [];

    configFiltersDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    configFiltersTime = {
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    connectedWalletId: number;
    toRelationshipSelectItems = [];

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

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
        private _fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private _walletnodeTxService: WalletnodeTxService,
        private _myWalletService: MyWalletsService,
        private walletNodeRequestService: WalletNodeRequestService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _alertsService: AlertsService,
        // private _chainService: ChainService,
        private multilingualService: MultilingualService,
        private _confirmationService: ConfirmationService,
    ) {
        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((locale) => this.getLanguage(locale)));
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connectedWalletId) => this.connectedWalletId = connectedWalletId));
        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe((requested) => this.requestWalletAddressList(requested)));
        this.subscriptionsArray.push(this.requestedInstrumentState.subscribe((requestedState) => this.requestWalletInstruments(requestedState)));
        this.subscriptionsArray.push(this.instrumentListOb.subscribe((instrumentList) => this.assetListOption = walletHelper.walletInstrumentListToSelectItem(instrumentList)));
        this.subscriptionsArray.push(this.requestedLabelListObs.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.subPortfolioAddressObs.subscribe((addresses) => this.getAddressList(addresses)));
    }

    ngOnInit() {
        this.encumberAssetsForm = this._fb.group({
            asset: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fromAddress: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            toAddress: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            amount: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            reference: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fromDateUTC: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fromTimeUTC: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            includeToDate: [
                false
            ],
            toDateUTC: [
                '',
            ],
            toTimeUTC: [
                '',
            ],
        });

        this.encumberAssetsForm.controls.includeToDate.valueChanges
            .subscribe((value: boolean) => {
                this.toggleToDateRequired(value);
                this.isEncumberEnd = value;
            });
    }

    private toggleToDateRequired(value: boolean): void {
        if(value) {
            this.encumberAssetsForm.controls.toDateUTC.setValidators(Validators.required);
            this.encumberAssetsForm.controls.toTimeUTC.setValidators(Validators.required);
        } else {
            this.encumberAssetsForm.controls.toDateUTC.clearValidators();
            this.encumberAssetsForm.controls.toTimeUTC.clearValidators();
        }

        this.encumberAssetsForm.controls.toDateUTC.updateValueAndValidity();
        this.encumberAssetsForm.controls.toTimeUTC.updateValueAndValidity();
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
            this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(walletToRelationship, walletDirectoryList);
        }

        this.markForCheck();
    }

    getAddressList(addresses: Array<any>) {

        let data = [];

        Object.keys(addresses).map((key) => {
            data.push({
                id: key,
                text: addresses[key].label
            });
        });

        this.fromAddressListOption = data;

        this.markForCheck();
    }

    requestWalletAddressList(requestedState: boolean) {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
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
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this._myWalletService, this.connectedWalletId);
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

    save(formValues) {
        if(!this.encumberAssetsForm.valid) return;

        const StartUTC_Secs = new Date(formValues.fromDateUTC + ' ' + formValues.fromTimeUTC).getTime() / 1000;
        const EndUTC_Secs = (formValues.toDateUTC !== '' && formValues.toTimeUTC !== '') ? new Date(formValues.toDateUTC + ' ' + formValues.toTimeUTC).getTime() / 1000 : 0;

        const asyncTaskPipe = this._walletnodeTxService.encumber(
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
                    [formValues.fromAddress[0].id, StartUTC_Secs, EndUTC_Secs]
                ],
                administrators: [],
                protocol: '',
                metadata: '',
            });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.showSuccess('Encumber has successfully been created');
                this.resetForm();
            },
            (data) => {
                this.showError(data[1].data.status);
            })
        );
    }

    resetForm(): void {
        this.encumberAssetsForm.reset();
    }

    showError(message) {
        /* Show the error. */
        this._alertsService.create('error', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-danger">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    showWarning(message) {
        /* Show the error. */
        this._alertsService.create('warning', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-warning">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    showSuccess(message) {
        /* Show the message. */
        this._alertsService.create('success', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-success">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}
