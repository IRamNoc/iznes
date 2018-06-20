import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, LogService } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { fromJS } from 'immutable';
import { PersistService } from '@setl/core-persist';

// Alerts and confirms
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';

// Internal
import { Subscription } from 'rxjs/Subscription';
// Services
import { AdminUsersService } from '@setl/core-req-services/useradmin/useradmin.service';
import { ChainService } from '@setl/core-req-services/chain/service';
import { MultilingualService } from '@setl/multilingual';

// Set default Node Address and Port
let defaultNodeAddress = null;
if (location.protocol !== 'https:') {
    defaultNodeAddress = 'localhost';
}
const defaultNodePort = 13535;

@Component({
    selector: 'app-wallet-nodes',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ManageWalletNodesComponent implements OnInit, OnDestroy {
    tabsControl: Array<object>;
    // Debug for dev
    isDebug = false;

    // Locale
    language = 'en';

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
                private _confirmationService: ConfirmationService,
                private multilingualService: MultilingualService,
                private logService: LogService,
                private _persistService: PersistService) {

        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                chainId: -1,
                active: true,
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Wallet Node',
                chainId: -1,
                formControl: this._persistService.watchForm('manageMember/walletNodes', new FormGroup(
                    {
                        walletNodeName: new FormControl('', Validators.required),
                        nodeAddress: new FormControl(defaultNodeAddress, Validators.required),
                        nodePath: new FormControl(),
                        nodePort: new FormControl(defaultNodePort, Validators.compose([Validators.required, this.isInteger])),
                        chainId: new FormControl('', Validators.required)
                    },
                )),
                active: false,
            },
        ];

        // language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));
        this.subscriptionsArray.push(this.requestedWalletNodesOb.subscribe((requestedWalletNodeList) => {
            this.getWalletNodesRequested(requestedWalletNodeList);
        }));
        this.subscriptionsArray.push(this.walletNodesListOb.subscribe((walletNodesList) => {
            this.getWalletNodesListFromRedux(walletNodesList);
        }));
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

        this.walletNodesList = listImu.reduce(
            (result, item) => {

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
            },
            []);

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


    /*CHECK PORT AND HTTPS*/
    handleChecks(tabId: number, type): void {
        let check = 1; // pass check flag
        let message = '';
        const nodePort = this.tabsControl[tabId]['formControl'].value.nodePort;
        const nodeAddress = this.tabsControl[tabId]['formControl'].value.nodeAddress;

        // CHECK NODE PORT IS 13535
        if (nodePort !== 13535) {
            check = 0; // failed check
            message = message + '<li>In most cases Node Port should be set to 13535</li>';
        }

        // IF NOT HTTPS CHECK ADDRESS IS LOCALHOST
        if (location.protocol !== 'https:') {
            if (nodeAddress !== 'localhost') {
                check = 0; // failed check
                message = message + '<li>As you are on a local server, Node Address should be set to localhost</li>';
            }
        }

        if (!check) {
            // TRIGGER WARNING
            this._confirmationService.create(
                '<span>Are you sure?</span>',
                `<strong>Please check the below:</strong><ol>${message}</ol>`,
                {confirmText: 'Continue', declineText: 'Amend'}
            ).subscribe((ans) => {
                if (ans.resolved) {
                    if (type === 'add') {
                        this.handleAddWalletNodes(tabId);
                    } else if (type === 'edit') {
                        this.handleEditWalletNodes(tabId);
                    }
                }
            });
        } else {
            // PROCEED IF PASSES CHECKS
            if (type === 'add') {
                this.handleAddWalletNodes(tabId);
            } else if (type === 'edit') {
                this.handleEditWalletNodes(tabId);
            }
        }
    }

    /*HANDLE ADD WALLET NODE*/
    handleAddWalletNodes(tabId: number): void {
        if (this.tabsControl[tabId]['formControl'].valid) {
            const walletNodeId = this.tabsControl[tabId]['formControl'].value.walletNodeId;
            const walletNodeName = this.tabsControl[tabId]['formControl'].value.walletNodeName;
            const chainId = this.tabsControl[tabId]['formControl'].value.chainId[0].id;
            const nodeAddress = this.tabsControl[tabId]['formControl'].value.nodeAddress;
            const nodePath = this.tabsControl[tabId]['formControl'].value.nodePath;
            const nodePort = this.tabsControl[tabId]['formControl'].value.nodePort;

            // Create a saga pipe
            const asyncTaskPipe = this._adminUsersService.saveWalletNode(
                {
                    walletNodeId,
                    walletNodeName,
                    chainId,
                    nodeAddress,
                    nodePath,
                    nodePort,
                },
                this.ngRedux
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                    this.showSuccess('Wallet Node has successfully been saved');
                    this.setTabActive(0);
                },
                (data) => {
                    this.logService.log('Error: ', data);
                    // this.showError(JSON.stringify(data));
                    this.showError('Error saving new Wallet Node. Please check that a Wallet Node with this name does not already exist.');
                    this.markForCheck();
                }
            ));
        }
    }

    /*HANDLE EDIT WALLET NODE*/
    handleEditWalletNodes(tabId: number): void {
        if (this.tabsControl[tabId]['formControl'].valid) {
            const walletNodeId = this.tabsControl[tabId]['formControl'].value.walletNodeId;
            const walletNodeName = this.tabsControl[tabId]['formControl'].value.walletNodeName;
            const nodeAddress = this.tabsControl[tabId]['formControl'].value.nodeAddress;
            const nodePath = this.tabsControl[tabId]['formControl'].value.nodePath;
            const nodePort = this.tabsControl[tabId]['formControl'].value.nodePort;

            // Create a saga pipe
            const asyncTaskPipe = this._adminUsersService.updateWalletNode(
                {
                    walletNodeId,
                    walletNodeName,
                    nodeAddress,
                    nodePath,
                    nodePort,
                },
                this.ngRedux
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                    this.showSuccess('Wallet Node has successfully been updated');
                    this.setTabActive(0);
                },
                (data) => {
                    this.logService.log('Error: ', data);
                    this.showError(JSON.stringify(data));
                    this.markForCheck();
                }
            ));
        }
    }

    /*HANDLE DELETE*/
    handleDelete(walletNode: any): void {
        const asyncTaskPipe = this._adminUsersService.deleteWalletNode(
            {
                walletNodeId: walletNode.walletNodeId
            },
            this.ngRedux
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                this.showSuccess('Wallet Node has been deleted');
            },
            (data) => {
                this.logService.log('error: ', data);
                this.showError(JSON.stringify(data));
            }
        ));
    }

    /*HANDLE EDIT CLICK*/
    handleEdit(index: number): void {
        /* Check if the tab is already open */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i]['walletNodeId'] === this.walletNodesList[index].walletNodeId) {
                this.setTabActive(i);
                return;
            }
        }

        /* Push the edit tab into the array */
        const walletNode = this.walletNodesList[index];

        this.tabsControl.push({
            title: '<i class="fa fa-code-fork"></i> ' + walletNode.walletNodeName,
            walletNodeId: walletNode.walletNodeId,
            formControl: new FormGroup(
                {
                    walletNodeId: new FormControl(walletNode.walletNodeId),
                    walletNodeName: new FormControl(walletNode.walletNodeName, Validators.required),
                    nodeAddress: new FormControl(walletNode.nodeAddress, Validators.required),
                    nodePath: new FormControl(walletNode.nodePath),
                    nodePort: new FormControl(walletNode.nodePort, Validators.compose([Validators.required, this.isInteger])),
                    chainId: new FormControl(walletNode.chainId, Validators.required),
                }
            ),
            active: false
        });

        // Activate the new tab
        this.setTabActive(this.tabsControl.length - 1);
    }

    /*CLOSE TAB*/
    closeTab(index: number): void {
        if (!index && index !== 0) {
            return;
        }

        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        // Reset tabs
        this.setTabActive(0);

        return;
    }

    /*CHECK IF INTEGER*/
    isInteger(control: FormControl) {
        const nodePort = control.value;
        const portLength = ('' + nodePort).length;
        if (Number.isInteger(nodePort) && portLength <= 11) {
            return null;
        } else {
            return {invalid: true};
        }
    }

    /*SET ACTIVE TAB*/
    setTabActive(index: number): void {
        const tabControlImu = fromJS(this.tabsControl);
        const newTabControlImu = tabControlImu.map((item, thisIndex) => {
            return item.set('active', thisIndex === index);
        });

        this.tabsControl = newTabControlImu.toJS();
    }

    /* SERVICES */
    getLanguage(requested): void {
        // this.logService.log('Language changed from ' + this.language + ' to ' + requested);
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

    showCheckAlert(message) {
        this._confirmationService.create(
            '<span>Are you sure?</span>',
            `<span>${message}</span>`,
            {confirmText: 'Confirm', declineText: 'Cancel'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.logService.log('button confirmation has been pressed (check alert)');
            }
        });
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
