import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SagaHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import {PersistService} from '@setl/core-persist';

// Alerts and confirms
import {AlertsService} from '@setl/jaspero-ng2-alerts';
// Internal
import {Subscription} from 'rxjs/Subscription';
// Services
import {AdminUsersService} from '@setl/core-req-services/useradmin/useradmin.service';
import {ChainService} from '@setl/core-req-services/chain/service';
import {MultilingualService} from '@setl/multilingual';

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
                private multilingualService: MultilingualService,
                private _persistService: PersistService) {

        this.tabsControl = [
            {
                title: '<i class="fa fa-th-list"></i> List',
                chainId: -1,
                active: true
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Wallet Node',
                chainId: -1,
                formControl: this._persistService.watchForm('manageMember/walletNodes', new FormGroup(
                    {
                        walletNodeName: new FormControl('', Validators.required),
                        nodeAddress: new FormControl('', Validators.required),
                        nodePath: new FormControl(),
                        nodePort: new FormControl('', Validators.required),
                        chainId: new FormControl('', Validators.required)
                    }
                )),
                active: false
            }
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

        this.walletNodesList = listImu.reduce((result, item) => {

            result.push({
                walletNodeId: item.get('walletNodeId', 0),
                walletNodeName: item.get('walletNodeName', ''),
                chainId: item.get('chainId', 0),
                chainName: item.get('chainName', ''),
                nodeAddress: item.get('nodeAddress', ''),
                nodePath: '',
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
                },
                (data) => {
                    console.log('Error: ', data);
                    this.showError(JSON.stringify(data));
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
                },
                (data) => {
                    console.log('Error: ', data);
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
                console.log('error: ', data);
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
                    walletNodeName: new FormControl(walletNode.walletNodeName),
                    nodeAddress: new FormControl(walletNode.nodeAddress),
                    nodePath: new FormControl(walletNode.nodePath),
                    nodePort: new FormControl(walletNode.nodePort),
                    chainId: new FormControl(walletNode.chainId),
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
