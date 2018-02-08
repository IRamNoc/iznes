/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
*/

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WalletNodesModel} from './model';
import {SagaHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import {PersistService} from "@setl/core-persist";
/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
// Internal
import {Subscription} from 'rxjs/Subscription';
// Services
import {AdminUsersService} from '@setl/core-req-services/useradmin/useradmin.service';
import {ChainService} from '@setl/core-req-services/chain/service';
import {MultilingualService} from '@setl/multilingual';

/* Actions */

// import {SET_FUND_SHARE_LIST} from '@ofi/ofi-main/ofi-store/ofi-product/fund/fund-list/actions';

@Component({
    selector: 'app-wallet-nodes',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageWalletNodesComponent implements OnInit, OnDestroy {

    // Debug for dev
    isDebug = false;

    // Locale
    language = 'fr';

    // Forms
    multiForm = [];
    walletNodesForm: FormGroup;
    modelForm: any;
    currentTab = null;
    showSameForm = false;

    // index Tabs
    showDashboard = false;

    // Modals
    showConfirmModal = false;
    showWaitingModal = false;
    showTextModal = false;
    modalTitle = '';
    modalText = '';

    // close/delete
    nodeToClose = null;
    nodeToDelete = null;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // Services
    walletNodesList = [];
    chainsListOptions = [];

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['userAdmin', 'walletNode', 'requestedWalletNodeList']) requestedWalletNodesOb;
    @select(['userAdmin', 'walletNode', 'walletNodeList']) walletNodesListOb;
    @select(['chain', 'chainList', 'requested']) requestedChainOb;
    @select(['chain', 'chainList', 'chainList']) chainListOb;

    constructor(private _fb: FormBuilder,
                private ngRedux: NgRedux<any>,
                private _adminUsersService: AdminUsersService,
                private _chainService: ChainService,
                private _changeDetectorRef: ChangeDetectorRef,
                private _alertsService: AlertsService,
                private multilingualService: MultilingualService,
                private _persistService: PersistService) {
        // language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));
        this.subscriptionsArray.push(this.requestedWalletNodesOb.subscribe((requestedWalletNodeList) => this.getWalletNodesRequested(requestedWalletNodeList)));
        this.subscriptionsArray.push(this.walletNodesListOb.subscribe((walletNodesList) => this.getWalletNodesListFromRedux(walletNodesList)));
        this.subscriptionsArray.push(this.requestedChainOb.subscribe((requested) => this.getChainsListRequested(requested)));
        this.subscriptionsArray.push(this.chainListOb.subscribe((chainsList) => this.getChainsListFromRedux(chainsList)));
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    getWalletNodesRequested(requestedWalletNodeList): void {
        if (!requestedWalletNodeList) {
            AdminUsersService.defaultRequestWalletNodeList(this._adminUsersService, this.ngRedux);
        }
    }

    getWalletNodesListFromRedux(walletNodesList) {
        const listImu = fromJS(walletNodesList);

        this.walletNodesList = listImu.reduce((result, item) => {

            result.push({
                walletNodeId: item.get('walletNodeId', 0),
                walletNodeName: item.get('walletNodeName', ''),
                chainId: item.get('chainId', 0),
                chainName: item.get('chainName', ''),
                nodeAddress: item.get('nodeAddress', ''),
                nodePath: item.get('nodePath', ''),
                nodePort: item.get('nodePort', 0),
            });

            return result;
        }, []);

        this.markForCheck();
    }

    getChainsListRequested(requested): void {
        if (!requested) {
            ChainService.defaultRequestChainsList(this._chainService, this.ngRedux);
        }
    }

    getChainsListFromRedux(chainsList) {
        const listImu = fromJS(chainsList);

        this.chainsListOptions = listImu.reduce((result, item) => {

            result.push({
                id: item.get('chainId', 0),
                text: item.get('chainName', ''),
            });

            return result;
        }, []);

        this.markForCheck();
    }

    newForm() {
        this.addForm();
    }

    addForm(isEdit?) {
        this.modelForm = [];
        this.showDashboard = false;
        this.walletNodesForm = null;
        this.walletNodesForm = this._fb.group({
            walletNodeId: [
                '',
            ],
            walletNodeName: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            chainId: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            nodeAddress: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            nodePath: [
                '',
            ],
            nodePort: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        });

        if (!isEdit) {
            // init/reset ModelForm used with ngModel
            this.modelForm = new WalletNodesModel();
            this.modelForm.walletNodeId = 0;
        }

        this.multiForm.push({
            form: isEdit ? this.walletNodesForm : this._persistService.watchForm('manageMember/walletNodes', this.walletNodesForm),
            modelForm: this.modelForm,
        });

        if (!isEdit) {
            this.currentTab = this.multiForm.length - 1;
        }
    }

    editForm(node: any) {
        this.showSameForm = false;
        // check if form already opened (only saved wallet nodes, new form can be opened several times)
        if (this.multiForm.length > 0) {
            const nbForms = this.multiForm.length;
            for (let i = 0; i < nbForms; i++) {
                if (this.multiForm[i].form.value.walletNodeId !== '') {
                    if (this.multiForm[i].form.value.walletNodeId === node.walletNodeId) {
                        this.showDashboard = false;
                        this.currentTab = i;
                        this.showSameForm = true;
                        return;
                    }
                }
            }
        }

        this.addForm(true);
        this.modelForm = new WalletNodesModel();
        for (const result in node) {
            switch (result) {
                case 'walletNodeId':
                    this.modelForm.walletNodeId = node[result];
                    break;
                case 'walletNodeName':
                    this.modelForm.walletNodeName = node[result];
                    break;
                case 'chainId':
                    const chainId = node[result];
                    const getNameFromID = this.chainsListOptions.find(obj => obj.id === chainId);
                    if (getNameFromID && getNameFromID.id) {
                        this.modelForm.chainId = getNameFromID.text;
                    } else {
                        this.showWarning('Something went wrong while trying to retrieve information for the chains.');
                        this.removeForm(this.multiForm.length - 1);
                        return;
                    }
                    break;
                case 'nodeAddress':
                    this.modelForm.nodeAddress = node[result];
                    break;
                case 'nodePath':
                    this.modelForm.nodePath = node[result];
                    break;
                case 'nodePort':
                    this.modelForm.nodePort = node[result];
                    break;
            }
        }
        this.multiForm[this.multiForm.length - 1].modelForm = this.modelForm;
        if (this.currentTab === null) {
            this.currentTab = this.multiForm.length - 1;
        }
    }

    save(formValues, formIndex) {
        if (!!formValues.walletNodeId && formValues.walletNodeId !== '') {
            // UPDATE

            const asyncTaskPipe = this._adminUsersService.updateWalletNode(
                {
                    walletNodeId: formValues.walletNodeId,
                    walletNodeName: formValues.walletNodeName,
                    nodeAddress: formValues.nodeAddress,
                    nodePath: formValues.nodePath,
                    nodePort: formValues.nodePort,
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                    this.showSuccess('Wallet Node has successfully been updated');
                    this.removeForm(this.currentTab);
                },
                (data) => {
                    console.log('Error: ', data);
                    // this.modalTitle = 'Error';
                    // this.modalText = JSON.stringify(data);
                    // this.showTextModal = true;
                    this.showError(JSON.stringify(data));
                    this.markForCheck();
                })
            );
        } else {
            // INSERT

            const asyncTaskPipe = this._adminUsersService.saveWalletNode(
                {
                    walletNodeId: formValues.walletNodeId,
                    walletNodeName: formValues.walletNodeName,
                    chainId: formValues.chainId[0].id,
                    nodeAddress: formValues.nodeAddress,
                    nodePath: formValues.nodePath,
                    nodePort: formValues.nodePort,
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                    this.showSuccess('Wallet Node has successfully been saved');
                    this.removeForm(this.currentTab);
                },
                (data) => {
                    console.log('Error: ', data);
                    // this.modalTitle = 'Error';
                    // this.modalText = JSON.stringify(data);
                    // this.showTextModal = true;
                    this.showError(JSON.stringify(data));
                    this.markForCheck();
                })
            );
        }
    }

    deleteWalletNode(node: any) {
        const asyncTaskPipe = this._adminUsersService.deleteWalletNode(
            {
                walletNodeId: node.walletNodeId
            },
            this.ngRedux);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                this.showSuccess('Your Wallet Node has been deleted successfully!');
            },
            (data) => {
                console.log('error: ', data);
            })
        );
    }

    askToRemoveForm(arrayIndex) {
        this.nodeToClose = arrayIndex;
        this.showConfirmModal = true;
    }

    removeForm(arrayIndex) {
        this.multiForm.splice(arrayIndex, 1);
        this.showDashboard = true;
        this.currentTab = null;
    }

    /* SERVICES */

    getLanguage(requested): void {
        // console.log('Language changed from ' + this.language + ' to ' + requested);
        if (requested) {
            switch (requested) {
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

    // Modals
    confirmModal(response): void {
        this.showConfirmModal = false;
        if (response === 1) {
            if (this.nodeToClose !== null) {
                this.removeForm(this.nodeToClose);
                this.nodeToClose = null;
            }
            if (this.nodeToDelete !== null) {
                this.deleteWalletNode(this.nodeToDelete);
                this.nodeToDelete = null;
            }
        }
    }

    showSuccessResponse() {
        this.showWaitingModal = true;
        this._alertsService.create('waiting', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-warning" width="500px">
                            <h3><i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>&nbsp;Do not close your browser window</h3>
                            <p>We are saving your progress. This may take a few moments.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        `);
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
