import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SagaHelper, LogService } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { fromJS } from 'immutable';
import { PersistService } from '@setl/core-persist';
import { MultilingualService } from '@setl/multilingual';

// Alerts and confirms
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';

// Internal
import { Subscription } from 'rxjs/Subscription';

// Services
import { AdminUsersService } from '@setl/core-req-services/useradmin/useradmin.service';
import { ChainService } from '@setl/core-req-services/chain/service';

@Component({
    selector: 'app-wallet-nodes',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ManageWalletNodesComponent implements OnInit, OnDestroy {
    tabsControl: {}[];
    // Debug for dev
    isDebug = false;

    // Locale
    language = 'en';

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    // Services
    walletNodesList = [];
    chainsListOptions = [];

    // Rows Per Page datagrid size
    public pageSize: number;

    // Default Node Address and Port
    private defaultNodeAddress = location.protocol !== 'https:' ? null : 'localhost';
    private defaultNodePort = 13535;

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['userAdmin', 'walletNode', 'requestedWalletNodeList']) requestedWalletNodesOb;
    @select(['userAdmin', 'walletNode', 'walletNodeList']) walletNodesListOb;
    @select(['chain', 'chainList', 'requested']) requestedChainOb;
    @select(['chain', 'chainList', 'chainList']) chainListOb;

    constructor(private fb: FormBuilder,
                private ngRedux: NgRedux<any>,
                private adminUsersService: AdminUsersService,
                private chainService: ChainService,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private confirmationService: ConfirmationService,
                private multilingualService: MultilingualService,
                private logService: LogService,
                private persistService: PersistService,
                public translate: MultilingualService,
    ) {

        // Build initial tabs
        this.tabsControl = [
            {
                title: `<i class="fa fa-search"></i> ${this.translate.translate('Search')}`,
                chainId: -1,
                active: true,
            },
            {
                title: `<i class="fa fa-plus"></i> ${this.translate.translate('Add New Wallet Node')}`,
                chainId: -1,
                formControl: this.persistService.watchForm('manageMember/walletNodes', new FormGroup(
                    {
                        walletNodeName: new FormControl('', Validators.required),
                        nodeAddress: new FormControl(this.defaultNodeAddress, Validators.required),
                        nodePath: new FormControl(),
                        nodePort: new FormControl(this.defaultNodePort, Validators.compose(
                            [Validators.required, this.isInteger])),
                        chainId: new FormControl('', Validators.required),
                    },
                )),
                active: false,
            },
        ];

        // Subscribe to language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe(requested => this.getLanguage(requested)));

        // Get Wallet Node and Chain List and save to Redux
        this.subscriptionsArray.push(this.requestedWalletNodesOb.subscribe((requestedWalletNodeList) => {
            this.getWalletNodesRequested(requestedWalletNodeList);
        }));
        this.subscriptionsArray.push(this.walletNodesListOb.subscribe((walletNodesList) => {
            this.getWalletNodesListFromRedux(walletNodesList);
        }));
        this.subscriptionsArray.push(this.requestedChainOb.subscribe(requested =>
            this.getChainsListRequested(requested)));
        this.subscriptionsArray.push(this.chainListOb.subscribe(chainsList => this.getChainsListFromRedux(chainsList)));
    }

    ngOnInit() {
    }

    /** Gets Wallet Nodes Requested
     *
     * @param requestedWalletNodeList - Redux requested flag
     */
    getWalletNodesRequested(requestedWalletNodeList): void {
        if (!requestedWalletNodeList) {
            AdminUsersService.defaultRequestWalletNodeList(this.adminUsersService, this.ngRedux);
        }
    }

    /** Gets Wallet Nodes List From Redux
     *
     * @param walletNodesList
     */
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

        this.changeDetectorRef.markForCheck();
    }

    /** Gets Chain List Requested
     *
     * @param requested - Redux requested flag
     */
    getChainsListRequested(requested): void {
        if (!requested) {
            ChainService.defaultRequestChainsList(this.chainService, this.ngRedux);
        }
    }

    /** Gets Chain List From Redux
     * ---------------------------
     * @param chainsList
     */
    getChainsListFromRedux(chainsList) {
        const listImu = fromJS(chainsList);

        this.chainsListOptions = listImu.reduce(
            (result, item) => {
                result.push({
                    id: item.get('chainId', 0),
                    text: item.get('chainName', ''),
                });
                return result;
            },
            [],
        );

        this.changeDetectorRef.markForCheck();
    }

    /** Handles Port and Address Checks Before Adding or Editing
     * ---------------------------------------------------------
     * Displays an alert if Node Port is not 13535 and if address is not 'localhost' when not on HTTPS
     *
     * @param {number} tabId
     * @param type
     */
    handleChecks(tabId: number, type): void {
        let check = true; // pass check flag
        let message = '';
        const nodePort = this.tabsControl[tabId]['formControl'].value.nodePort;
        const nodeAddress = this.tabsControl[tabId]['formControl'].value.nodeAddress;

        // Check node port is 13535
        if (nodePort !== 13535) {
            check = false; // failed check
            message = `<li class="text-warning">${this.translate.translate('In most cases the Node Port should be set to 13535')}</li>`;
        }

        // If not HTTPS check address is 'localhost'
        if (location.protocol !== 'https:' && nodeAddress !== 'localhost') {
            check = false; // failed check
            message = `<li class="text-warning">${this.translate.translate('As you are on a local server, the Node Address should be set to localhost')}</li>`;
        }

        if (!check) {
            // Trigger warning alert
            this.confirmationService.create(
                `<span>${this.translate.translate('Are you sure?')}</span>`,
                `<strong class="text-warning">${this.translate.translate('Please check the below')}:</strong><ol>${message}</ol>`,
                { confirmText: this.translate.translate('Continue'), declineText: this.translate.translate('Amend') },
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
            // Proceed if passes checks
            if (type === 'add') {
                this.handleAddWalletNodes(tabId);
            } else if (type === 'edit') {
                this.handleEditWalletNodes(tabId);
            }
        }
    }

    /**
     * Handles Adding a Wallet Node
     * -----------------------------
     * @param {number} tabId
     */
    handleAddWalletNodes(tabId: number): void {
        if (this.tabsControl[tabId]['formControl'].valid) {
            // Show loading modal
            this.alertsService.create('loading');

            const walletNodeId = this.tabsControl[tabId]['formControl'].value.walletNodeId;
            const walletNodeName = this.tabsControl[tabId]['formControl'].value.walletNodeName;
            const chainId = this.tabsControl[tabId]['formControl'].value.chainId[0].id;
            const nodeAddress = this.tabsControl[tabId]['formControl'].value.nodeAddress;
            const nodePath = this.tabsControl[tabId]['formControl'].value.nodePath;
            const nodePort = this.tabsControl[tabId]['formControl'].value.nodePort;

            // Create a saga pipe
            const asyncTaskPipe = this.adminUsersService.saveWalletNode(
                {
                    walletNodeId,
                    walletNodeName,
                    chainId,
                    nodeAddress,
                    nodePath,
                    nodePort,
                },
                this.ngRedux,
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                () => {
                    AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                    this.alertsService.generate(
                        'success', 
                        this.translate.translate('Wallet Node has successfully been saved.'),l
                    );
                    this.setTabActive(0);
                },
                (data) => {
                    this.logService.log('Error: ', data);
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Error saving new Wallet Node. Please check that a Wallet Node with this name does not already exist.'),
                    );
                    this.changeDetectorRef.markForCheck();
                },
            ));
        }
    }

    /**
     * Handles Editing a Wallet Node
     * ------------------------------
     * @param {number} tabId
     */
    handleEditWalletNodes(tabId: number): void {
        if (this.tabsControl[tabId]['formControl'].valid) {
            // Show loading modal
            this.alertsService.create('loading');

            const walletNodeId = this.tabsControl[tabId]['formControl'].value.walletNodeId;
            const walletNodeName = this.tabsControl[tabId]['formControl'].value.walletNodeName;
            const nodeAddress = this.tabsControl[tabId]['formControl'].value.nodeAddress;
            const nodePath = this.tabsControl[tabId]['formControl'].value.nodePath;
            const nodePort = this.tabsControl[tabId]['formControl'].value.nodePort;

            // Create a saga pipe
            const asyncTaskPipe = this.adminUsersService.updateWalletNode(
                {
                    walletNodeId,
                    walletNodeName,
                    nodeAddress,
                    nodePath,
                    nodePort,
                },
                this.ngRedux,
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                () => {
                    AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                    this.alertsService.generate(
                        'success',
                        this.translate.translate('Wallet Node has successfully been updated.'),
                    );
                    this.setTabActive(0);
                },
                (data) => {
                    this.logService.log('Error: ', data);
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Failed to update Wallet Node.'),
                    );
                    this.changeDetectorRef.markForCheck();
                },
            ));
        }
    }

    /**
     * Handles Deleting a Wallet Node
     * -------------------------------
     * @param walletNode
     */
    handleDelete(walletNode: any): void {
        /* Ask the user if they're sure... */
        this.confirmationService.create(
            `<span>${this.translate.translate('Deleting a Wallet Node')}</span>`,
            `<span class="text-warning">${this.translate.translate(
                'Are you sure you want to delete @walletNodeName@?',
                { walletNodeName: walletNode.walletNodeName })}</span>`,
        ).subscribe((ans) => {
            /* ...if they are... */
            if (ans.resolved) {
                // Show loading modal
                this.alertsService.create('loading');

                const asyncTaskPipe = this.adminUsersService.deleteWalletNode(
                    {
                        walletNodeId: walletNode.walletNodeId,
                    },
                    this.ngRedux,
                );

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    () => {
                        AdminUsersService.setRequestedWalletNodes(false, this.ngRedux);
                        this.alertsService.generate(
                            'success',
                            this.translate.translate('Wallet Node has been deleted.'),
                        );
                    },
                    (data) => {
                        this.logService.log('error: ', data);
                        this.alertsService.generate(
                            'error',
                            this.translate.translate('Failed to delete Wallet Node.'),
                        );
                    },
                ));
            }
        });
    }

    /**
     * Handles Edit Btn Click
     * -----------------------
     * @param {number} index
     */
    handleEdit(index: number): void {
        /* Check if the tab is already open */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if (this.tabsControl[i]['walletNodeId'] === this.walletNodesList[index].walletNodeId) {
                this.setTabActive(i);
                return;
            }
        }

        /* Push the edit tab into the array */
        const walletNode = this.walletNodesList[index];

        this.tabsControl.push({
            title: `<i class="fa fa-code-fork"></i> ${walletNode.walletNodeName}`,
            walletNodeId: walletNode.walletNodeId,
            formControl: new FormGroup(
                {
                    walletNodeId: new FormControl(walletNode.walletNodeId),
                    walletNodeName: new FormControl(walletNode.walletNodeName, Validators.required),
                    nodeAddress: new FormControl(walletNode.nodeAddress, Validators.required),
                    nodePath: new FormControl(walletNode.nodePath),
                    nodePort: new FormControl(walletNode.nodePort, Validators.compose(
                        [Validators.required, this.isInteger])),
                    chainId: new FormControl(walletNode.chainId, Validators.required),
                },
            ),
            active: false,
        });

        // Activate the new tab
        this.setTabActive(this.tabsControl.length - 1);
    }

    /** Closes a Tab
     * -------------
     * @param {number} index
     */
    closeTab(index: number): void {
        if (!index && index !== 0) {
            return;
        }

        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length),
        ];

        // Reset tabs
        this.setTabActive(0);

        return;
    }

    /** Checks if Integer
     * ------------------
     * @param {FormControl} control
     * @returns {any}
     */
    isInteger(control: FormControl) {
        const nodePort = control.value;
        const portLength = ('' + nodePort).length;
        if (Number.isInteger(nodePort) && portLength <= 11) {
            return null;
        }
        return { invalid: true };
    }

    /** Sets Active Tab
     * ----------------
     * @param {number} index
     */
    setTabActive(index: number): void {
        const tabControlImu = fromJS(this.tabsControl);
        const newTabControlImu = tabControlImu.map((item, thisIndex) => {
            return item.set('active', thisIndex === index);
        });

        this.tabsControl = newTabControlImu.toJS();
    }

    /** Sets Language
     * --------------
     * @param requested
     */
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

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
