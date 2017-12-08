// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import _ from 'lodash';
// Internal
import {
    ConnectionService,
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService,
    WalletnodeTxService
} from '@setl/core-req-services';

import { setRequestedConnections, setRequestedWalletAddresses } from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper } from '@setl/utils/index';
import { CREATE_CONNECTION } from '@setl/core-store/connection/my-connections';

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

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    @select(['user', 'connected', 'connectedWallet']) connectedWalletObs;
    // List of Redux observable.
    @select(['wallet', 'walletDirectory', 'walletList']) walletListObs;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListObs;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListObs;
    @select(['wallet', 'myWalletAddress', 'addressList']) subPortfolioAddressObs;
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

        this.subscriptionsArray.push(this.connectedWalletObs.subscribe((connected) => this.connectedWalletId = connected));
        this.subscriptionsArray.push(this.walletListObs.subscribe((wallets) => this.requestWalletList(wallets)));
        this.subscriptionsArray.push(this.requestedLabelListObs.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.requestedAddressListObs.subscribe((requested) => this.requestAddressList(requested)));
        this.subscriptionsArray.push(this.subPortfolioAddressObs.subscribe((addresses) => this.getAddressList(addresses)));
        this.subscriptionsArray.push(this.requestedConnectionsStateObs.subscribe((requested) => this.requestConnectionList(requested)));
        this.subscriptionsArray.push(this.connectionListObs.subscribe((connections) => this.getConnections(connections)));
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

    requestWalletList(wallets: Array<any>) {
        let data = [];

        Object.keys(wallets).map((key) => {
            data.push({
                id: wallets[key].walletID,
                text: wallets[key].walletName
            });
        });

        this.walletList = data;
    }

    requestAddressList(requested: boolean) {
        console.log('requested wallet address', this.requestedWalletAddress);

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

    requestConnectionList(requestedState: boolean) {
        if (!requestedState && this.connectedWalletId !== 0) {
            this.ngRedux.dispatch(setRequestedConnections());

            InitialisationService.requestConnectionList(this.ngRedux, this.connectionService, this.connectedWalletId);
        }
    }

    getAddressList(addresses: Array<any>) {
        let data = [];

        Object.keys(addresses).map((key) => {
            data.push({
                id: addresses[key].addr,
                text: addresses[key].label
            });
        });

        this.addressList = data;
    }

    getConnections(connections: any) {
        let data = [];

        console.log(this.walletList, this.addressList);

        if (this.walletList && this.addressList) {
            connections.map((connection) => {
                const connectionName = this.walletList.filter((wallet) => wallet.id === connection.leiSender)[0].text;
                const subPortfolioName = this.addressList.filter((address) => address.id === connection.keyDetail)[0];

                data.push({
                    connection: connectionName,
                    subPortfolio: subPortfolioName
                });
            });

            console.log('========= DATA =========');
            console.log(data);
            console.log('========================');

            this.connectionList = data;
        }
    }

    showErrorResponse(response) {
        const message = _.get(response, '[1].Data[0].Message', '');

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

    showWarningResponse(message) {
        this.alertsService.create('warning', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-warning">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
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
            connetionId: 0,
            status: 1
        };

        const asyncTaskPipe = this.connectionService.createConnection(data);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [CREATE_CONNECTION],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    handleEdit() {
        console.log('edit connection');
    }

    handleDelete() {
        console.log('delete connection');
    }
}
