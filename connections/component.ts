// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';
// Internal
import {
    ConnectionService, InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService
} from '@setl/core-req-services';

import {setRequestedConnections, setRequestedWalletAddresses} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {SagaHelper} from '@setl/utils/index';

@Component({
    selector: 'app-my-connections',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;
    tabsControl: any = [];
    requestedWalletAddress: boolean;
    connectedWalletId: number;
    walletList = [];
    addressList = [];
    connectionList = [];
    changedConnectionList = [];
    connectionToDelete: any;
    isModalDisplayed: boolean;
    isCompleteAddressLoaded: boolean;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // List of Redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletObs;
    @select(['wallet', 'walletDirectory', 'walletList']) walletListObs;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListObs;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListObs;
    @select(['wallet', 'myWalletAddress', 'addressList']) subPortfolioAddressObs;
    @select(['wallet', 'myWalletAddress', 'requestedCompleteAddresses']) requestedCompleteAddressesObs;
    @select(['connection', 'myConnection', 'requestedConnections']) requestedConnectionsStateObs;
    @select(['connection', 'myConnection', 'connectionList']) connectionListObs;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private _myWalletService: MyWalletsService,
                private _walletnodeTxService: WalletnodeTxService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private changeDetectorRef: ChangeDetectorRef,
                private myWalletsService: MyWalletsService,
                private connectionService: ConnectionService) {

        this.connectedWalletId = 0;
        this.requestedWalletAddress = false;
        this.isModalDisplayed = false;
        this.isCompleteAddressLoaded = false;

        this.subscriptionsArray.push(this.connectedWalletObs.subscribe((connected) => this.connectedWalletId = connected));
        this.subscriptionsArray.push(this.requestedLabelListObs.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.walletListObs.subscribe((wallets) => this.getWalletList(wallets)));
        this.subscriptionsArray.push(this.subPortfolioAddressObs.subscribe((addresses) => this.getAddressList(addresses)));
        this.subscriptionsArray.push(this.requestedAddressListObs.subscribe((requested) => this.requestAddressList(requested)));
        this.subscriptionsArray.push(this.requestedConnectionsStateObs.subscribe((requested) => this.requestConnectionList(requested)));
        this.subscriptionsArray.push(this.connectionListObs.subscribe((connections) => this.getConnections(connections)));
        this.subscriptionsArray.push(this.requestedCompleteAddressesObs.subscribe((requested) => this.requestCompleteAddresses(requested)));
    }

    ngOnInit() {
        this.tabsControl = [
            {
                title: 'Manage your connections',
                iconClass: 'fa fa-users',
                isActive: true
            },
            {
                title: 'Add a new connection',
                iconClass: 'fa fa-plus',
                isActive: false,
                formControl: this.getNewConnectionForm()
            }
        ];
    }

    ngOnDestroy() {
        this.subscriptionsArray.forEach((subscription) => subscription.unsubscribe());
    }

    requestAddressList(requested: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requested && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this.ngRedux, this._walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState: boolean) {
        console.log('checking requested', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this._myWalletService, this.connectedWalletId);
        }
    }

    requestCompleteAddresses(requested: boolean) {
        if (requested) {
            this.isCompleteAddressLoaded = requested;
            this.updateConnections();
            this.changeDetectorRef.markForCheck();
        }
    }

    requestConnectionList(requestedState: boolean) {
        if (!requestedState && this.connectedWalletId !== 0) {
            this.ngRedux.dispatch(setRequestedConnections());

            ConnectionService.defaultRequestConnectionsList(this.connectionService, this.ngRedux, this.connectedWalletId.toString());
        }
    }

    getWalletList(wallets: Array<any>) {
        let data = [];

        Object.keys(wallets).map((key) => {
            data.push({
                id: wallets[key].walletID,
                text: wallets[key].walletName
            });
        });

        this.walletList = data;
    }

    getAddressList(addresses: Array<any>) {
        let data = [];

        Object.keys(addresses).map((key) => {
            data.push({
                id: key,
                text: addresses[key].label
            });
        });

        this.addressList = data;
        this.changeDetectorRef.markForCheck();
    }

    getConnections(connections: any) {
        const hasChanged = (this.connectionList !== connections && this.isCompleteAddressLoaded);
        this.connectionList = connections;

        if (hasChanged) {
            this.updateConnections();
        }

        this.changeDetectorRef.markForCheck();
    }

    updateConnections() {
        const connections = this.connectionList;
        let data = [];

        connections.map((connection) => {
            const connectionName = this.walletList.filter((wallet) => wallet.id === connection.leiSender)[0].text;
            const subPortfolioName = this.addressList.filter((address) => address.id === connection.keyDetail)[0].text;

            data.push({
                id: connection.connectionId,
                connection: connectionName,
                subPortfolio: subPortfolioName,
                leiSender: connection.leiSender
            });
        });

        this.changedConnectionList = data;
        this.changeDetectorRef.markForCheck();
    }

    getNewConnectionForm() {
        this.formGroup = new FormGroup({
            'connection': new FormControl('', [Validators.required]),
            'sub-portfolio': new FormControl('', [Validators.required])
        });

        return this.formGroup;
    }

    handleCreate() {
        const data = {
            leiId: this.connectedWalletId.toString(),
            senderLeiId: this.formGroup.controls['connection'].value[0].id.toString(),
            address: this.formGroup.controls['sub-portfolio'].value[0].id,
            connectionId: 0,
            status: 1
        };

        const asyncTaskPipe = this.connectionService.createConnection(data);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                ConnectionService.setRequested(false, this.ngRedux);
                this.resetForm();
                this.showSuccessResponse('The connection has successfully been created');
            },
            () => {
                this.resetForm();
                this.showErrorMessage('This connection has already been created');
            })
        );

        this.changeDetectorRef.markForCheck();
    }

    handleEdit() {
        console.log('edit connection');
    }

    handleDelete(connection: any) {
        const data = {
            leiId: this.connectedWalletId,
            senderLei: connection.leiSender
        };

        const asyncTaskPipe = this.connectionService.deleteConnection(data);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                ConnectionService.setRequested(false, this.ngRedux);
                this.showSuccessResponse('The connection has successfully been deleted');
            },
            (error) => {
                console.log('error: ', error);
            })
        );

        this.changeDetectorRef.markForCheck();
    }

    confirmationModal(isOk): void {
        this.isModalDisplayed = false;

        if (isOk) {
            this.handleDelete(this.connectionToDelete);
        }
    }

    resetForm(): void {
        // this.editForm = false;
        // this.modelForm = {};
        this.formGroup.controls['connection'].setValue(['']);
        this.formGroup.controls['sub-portfolio'].setValue(['']);
        this.formGroup.reset();
    }

    showErrorMessage(message) {
        this.alertsService.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    showSuccessResponse(message) {
        this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }
}
