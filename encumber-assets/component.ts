/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
import _ from 'lodash';

// import {ChainInterface} from './interface';
// import {ChainModel} from './model';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

// Internal
import {Subscription} from 'rxjs/Subscription';
import {Unsubscribe} from 'redux';

// Services
import {WalletnodeTxService, WalletNodeRequestService, InitialisationService} from '@setl/core-req-services';
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
    toRelationshipSelectItems: Array<any>;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) addressListRequestedStateOb;
    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    @select(['asset', 'myInstruments', 'instrumentList']) instrumentListOb;

    // Redux Unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(
        private _fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private walletnodeTxService: WalletnodeTxService,
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
            toDateUTC: [
                '',
            ],
            toTimeUTC: [
                '',
            ],
        });

        // this.subscriptionsArray.push(this.encumberAssetsForm.valueChanges.subscribe((form) => this.processFormChanges(form)));
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    updateState() {
        const newState = this.ngRedux.getState();

        // Get wallet addresses and update wallet address items list
        const currentWalletAddressList = getWalletAddressList(newState);
        this.fromAddressListOption = walletHelper.walletAddressListToSelectItem(currentWalletAddressList);

        const walletToRelationship = getWalletToRelationshipList(newState);
        const walletDirectoryList = getWalletDirectoryList(newState);

        this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(walletToRelationship, walletDirectoryList);

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

    processFormChanges(isChecked) {
        if (isChecked) {
            this.encumberAssetsForm.get('toDateUTC').setValidators(Validators.required);
            this.encumberAssetsForm.get('toTimeUTC').setValidators(Validators.required);
            this.isEncumberEnd = true;
        } else if (!isChecked) {
            // console.log('not checked');
            this.encumberAssetsForm.get('toDateUTC').patchValue(null, {emitEvent: false});
            this.encumberAssetsForm.get('toDateUTC').setValidators(null);
            this.encumberAssetsForm.get('toTimeUTC').patchValue(null, {emitEvent: false});
            this.encumberAssetsForm.get('toTimeUTC').setValidators(null);
            this.isEncumberEnd = false;
        }
        this.encumberAssetsForm.get('toDateUTC').updateValueAndValidity();
        this.encumberAssetsForm.get('toTimeUTC').updateValueAndValidity();
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
        console.log(formValues);
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
