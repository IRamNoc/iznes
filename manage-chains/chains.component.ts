/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, SagaHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import * as _ from 'lodash';

import {ChainInterface} from './chains.interface';
import {ChainModel} from './chains.model';
/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
// Internal
import {Subscription} from 'rxjs/Subscription';
// Services
import {ChainService} from "@setl/core-req-services/chain/service";
/*  */
import {PersistService} from "@setl/core-persist";

@Component({
    selector: 'app-manage-chains',
    styleUrls: ['./chains.component.scss'],
    templateUrl: './chains.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ManageChainsComponent implements OnInit, AfterViewInit, OnDestroy {

    language = 'en';

    multiChainForm = [];
    chainForm: FormGroup;
    modelForm: any;
    editForm = false;
    showSearchTab = false;
    showModal = false;
    modalTitle = '';
    modalText = '';

    showConfirmModal = false;
    chainToDelete: any = 0;

    chainsList = [];

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['chain', 'chainList', 'requested']) requestedChainOb;
    @select(['chain', 'chainList', 'chainList']) chainListOb;

    constructor(private _fb: FormBuilder,
                private ngRedux: NgRedux<any>,
                private _changeDetectorRef: ChangeDetectorRef,
                private _alertsService: AlertsService,
                private _chainService: ChainService,
                private _confirmationService: ConfirmationService,
                private _persistService: PersistService) {
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((locale) => this.getLanguage(locale)));
        this.subscriptionsArray.push(this.requestedChainOb.subscribe((requested) => this.getChainsListRequested(requested)));
        this.subscriptionsArray.push(this.chainListOb.subscribe((chainsList) => this.getChainsListFromRedux(chainsList)));
    }

    ngOnInit() {
        this.chainForm = this._fb.group({
            chainId: [
                '',
                Validators.compose([
                    Validators.required,
                    this.isInteger,
                ])
            ],
            chainName: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        });
    }

    ngAfterViewInit() {
        this._persistService.watchForm('manageMember/manageChains', this.chainForm);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    getChainsListRequested(requested): void {
        // console.log('Sicav requested', requested);
        if (!requested) {
            ChainService.defaultRequestChainsList(this._chainService, this.ngRedux);
        }
    }

    getChainsListFromRedux(chainsList) {
        const listImu = fromJS(chainsList);

        this.chainsList = listImu.reduce((result, item) => {

            result.push({
                chainId: item.get('chainId', 0),
                chainName: item.get('chainName', ''),
            });

            return result;
        }, []);

        this.markForCheck();
    }

    isInteger(control: FormControl) {
        const chainid = control.value;
        if (Number.isInteger(chainid)) {
            return null;
        } else {
            return {invalid: true};
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

    editChain(chain: object) {
        this.modelForm = new ChainModel();
        for (const result in chain) {
            switch (result) {
                case 'chainId':
                    this.modelForm.chainId = chain[result];
                    break;
                case 'chainName':
                    this.modelForm.chainName = chain[result];
                    break;
            }
        }
        this.showSearchTab = false;
        this.editForm = true;
    }

    save(formValues: ChainInterface) {
        this.showSearchTab = false; // reset

        if (this.editForm) {
            // update
            const asyncTaskPipe = this._chainService.updateChain(
                {
                    chainId: parseInt(formValues.chainId),
                    chainName: formValues.chainName,
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    ChainService.setRequested(false, this.ngRedux);
                    // console.log('success update chain', data); // success
                    this.showSuccess('Chain has successfully been updated');
                    this.resetForm();
                    this.showSearchTab = true;
                },
                (data) => {
                    console.log('error: ', data);
                })
            );
        } else {
            // insert
            const asyncTaskPipe = this._chainService.saveChain(
                {
                    chainId: parseInt(formValues.chainId),
                    chainName: formValues.chainName,
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    ChainService.setRequested(false, this.ngRedux);
                    this.showSuccess('Chain has successfully been created');
                    this.resetForm();
                    this.showSearchTab = true;
                },
                (data) => {
                    console.log('error: ', data);
                })
            );
        }
    }

    deleteChain(chain: any) {
        // console.log(sicav.sicavID);
        const asyncTaskPipe = this._chainService.deleteChain(
            {
                chainId: chain.chainId
            },
            this.ngRedux);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                ChainService.setRequested(false, this.ngRedux);
                this.showSuccess('Your Chain has been deleted successfully!');
                this.showSearchTab = true;
            },
            (data) => {
                console.log('error: ', data);
            })
        );
    }

    resetForm(): void {
        this.editForm = false;
        this.showSearchTab = false;
        this.modelForm = {};
        this.chainForm.reset();
    }

    confirmModal(response): void {
        this.showConfirmModal = false;
        if (response === 1) {
            this.deleteChain(this.chainToDelete);
        }
    }

    /**
     * Show Error Message
     * ------------------
     * Shows an error popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
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

    /**
     * Show Warning Message
     * ------------------
     * Shows a warning popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
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

    /**
     * Show Success Message
     * ------------------
     * Shows an success popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
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
