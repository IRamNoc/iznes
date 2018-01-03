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

import {setRequestedFromConnections, setRequestedToConnections, setRequestedWalletAddresses} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {SagaHelper} from '@setl/utils/index';

@Component({
    selector: 'app-my-connections',
    templateUrl: './component.html',
    styles: [`
        .mandatory-field {
            color: #d9534f;
            font-weight: bold;
            font-size: x-large;
            padding: 10px 5px;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;
    requestedWalletAddress: boolean;
    connectedWalletId: number;
    walletList = [];
    addressList = [];
    fromConnectionList = [];
    toConnectionList = [];
    acceptedConnectionList = [];
    pendingConnectionList = [];
    // changedConnectionList = [];
    connectionToDelete: any;
    isModalDisplayed: boolean;
    isCompleteAddressLoaded: boolean;
    isEditFormDisplayed: boolean;
    isAcceptedConnectionListDisplayed: boolean;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // List of Redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletObs;
    @select(['wallet', 'managedWallets', 'walletList']) walletListObs;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListObs;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListObs;
    @select(['wallet', 'myWalletAddress', 'addressList']) subPortfolioAddressObs;
    @select(['wallet', 'myWalletAddress', 'requestedCompleteAddresses']) requestedCompleteAddressesObs;
    @select(['connection', 'myConnection', 'requestedFromConnectionList']) requestedFromConnectionStateObs;
    @select(['connection', 'myConnection', 'requestedToConnectionList']) requestedToConnectionStateObs;
    @select(['connection', 'myConnection', 'fromConnectionList']) fromConnectionListObs;
    @select(['connection', 'myConnection', 'toConnectionList']) toConnectionListObs;

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
        this.isEditFormDisplayed = false;
        this.isAcceptedConnectionListDisplayed = false;

        this.subscriptionsArray.push(this.connectedWalletObs.subscribe((connected) => this.getConnectedWallet(connected)));
        this.subscriptionsArray.push(this.requestedLabelListObs.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.walletListObs.subscribe((wallets) => this.getWalletList(wallets)));
        this.subscriptionsArray.push(this.subPortfolioAddressObs.subscribe((addresses) => this.getAddressList(addresses)));
        this.subscriptionsArray.push(this.requestedAddressListObs.subscribe((requested) => this.requestAddressList(requested)));
        this.subscriptionsArray.push(this.requestedFromConnectionStateObs.subscribe((requested) => this.requestFromConnectionList(requested)));
        this.subscriptionsArray.push(this.requestedToConnectionStateObs.subscribe((requested) => this.requestToConnectionList(requested)));
        this.subscriptionsArray.push(this.fromConnectionListObs.subscribe((connections) => this.getFromConnectionList(connections)));
        this.subscriptionsArray.push(this.toConnectionListObs.subscribe((connections) => this.getToConnectionList(connections)));
        this.subscriptionsArray.push(this.requestedCompleteAddressesObs.subscribe((requested) => this.requestCompleteAddresses(requested)));
    }

    ngOnInit() {
        this.formGroup = new FormGroup({
            'connection': new FormControl('', [Validators.required]),
            'sub-portfolio': new FormControl('', [Validators.required])
        });
    }

    ngOnDestroy() {
        this.subscriptionsArray.forEach((subscription) => subscription.unsubscribe());
    }

    getConnectedWallet(walletId: number) {
        this.connectedWalletId = walletId;
        ConnectionService.setRequestedFromConnections(false, this.ngRedux);
        ConnectionService.setRequestedToConnections(false, this.ngRedux);

        this.isCompleteAddressLoaded = false;
        this.isEditFormDisplayed = false;
        this.isAcceptedConnectionListDisplayed = true;

        if (this.formGroup) {
            this.resetForm();
        }

        this.changeDetectorRef.markForCheck();
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

    requestFromConnectionList(requestedState: boolean) {
        if (!requestedState && this.connectedWalletId !== 0) {
            this.ngRedux.dispatch(setRequestedFromConnections());

            ConnectionService.requestFromConnectionList(this.connectionService, this.ngRedux, this.connectedWalletId.toString());
        }
    }

    requestToConnectionList(requestedState: boolean) {
        if (!requestedState && this.connectedWalletId !== 0) {
            this.ngRedux.dispatch(setRequestedToConnections());

            ConnectionService.requestToConnectionList(this.connectionService, this.ngRedux, this.connectedWalletId.toString());
        }
    }

    requestCompleteAddresses(requested: boolean) {
        if (requested) {
            this.isCompleteAddressLoaded = requested;
            this.acceptedConnectionList = this.updateFromConnections(this.fromConnectionList);
            this.pendingConnectionList = this.updateToConnections(this.toConnectionList);
            this.changeDetectorRef.markForCheck();
        }
    }

    getWalletList(wallets: Array<any>) {
        let data = [];

        Object.keys(wallets).map((key) => {
            if (wallets[key].walletID !== this.connectedWalletId) {
                data.push({
                    id: wallets[key].walletId,
                    text: wallets[key].walletName,
                });
            }
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

    getFromConnectionList(connections: any) {
        const hasChanged = (this.fromConnectionList !== connections && this.isCompleteAddressLoaded);
        this.fromConnectionList = connections.filter((connection) => connection.status === '-1');

        if (hasChanged) {
            this.acceptedConnectionList = this.updateFromConnections(this.fromConnectionList);
            this.changeDetectorRef.markForCheck();
        }

        this.changeDetectorRef.markForCheck();
    }

    getToConnectionList(connections: any) {
        const hasChanged = (this.toConnectionList !== connections && this.isCompleteAddressLoaded);
        this.toConnectionList = connections.filter((connection) => connection.status === '1');

        if (hasChanged) {
            this.pendingConnectionList = this.updateToConnections(this.toConnectionList);
            this.changeDetectorRef.markForCheck();
        }

        this.changeDetectorRef.markForCheck();
    }

    updateFromConnections(connections: Array<any>) {
        const data = [];

        if (connections && connections.length > 0) {
            connections.map((connection) => {
                const connectionName = this.walletList.filter((wallet) => wallet.id === connection.leiSender)[0].text;
                // const subPortfolioName = this.addressList.filter((address) => address.id === connection.keyDetail)[0].text;
                const subPortfolioName = connection.keyDetail;

                data.push({
                    id: connection.connectionId,
                    connection: connectionName,
                    subPortfolio: subPortfolioName,
                    leiSender: connection.leiSender
                });
            });

        }

        return data;
    }

    updateToConnections(connections: Array<any>) {
        const data = [];

        if (connections && connections.length > 0) {
            connections.map((connection) => {
                const connectionName = this.walletList.filter((wallet) => wallet.id === connection.leiId)[0].text;
                const subPortfolioName = connection.keyDetail;
                // const subPortfolioName = this.addressList.filter((address) => address.id === connection.keyDetail)[0].text;

                data.push({
                    id: connection.connectionId,
                    connection: connectionName,
                    subPortfolio: subPortfolioName,
                    leiSender: connection.leiSender
                });
            });

        }

        return data;
    }

    handleSubmit() {
        let data = null;

        if (!this.isEditFormDisplayed) {
            data = {
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
                    ConnectionService.setRequestedFromConnections(false, this.ngRedux);
                    ConnectionService.setRequestedToConnections(false, this.ngRedux);
                    this.showSuccessResponse('The connection has successfully been created');
                    this.isAcceptedConnectionListDisplayed = true;
                },
                () => {
                    this.showErrorMessage('This connection already exists');
                })
            );
        } else {
            data = {
                leiId: this.connectedWalletId,
                senderLei: this.formGroup.controls['connection'].value[0].id,
                keyDetail: this.formGroup.controls['sub-portfolio'].value[0].id
            };

            const asyncTaskPipe = this.connectionService.updateConnection(data);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                () => {
                    ConnectionService.setRequestedFromConnections(false, this.ngRedux);
                    ConnectionService.setRequestedToConnections(false, this.ngRedux);
                    this.showSuccessResponse('The connection has successfully been updated');
                    this.isAcceptedConnectionListDisplayed = true;
                },
                () => {
                    this.showErrorMessage('This connection already exists');
                })
            );
        }

        this.resetForm();
        this.changeDetectorRef.markForCheck();
    }

    handleEdit(connection) {
        let selectedSubPortfolio = connection.subPortfolio;

        // this.addressList.forEach((address) => {
        //     if (address.text === connection.subPortfolio) {
        //         selectedSubPortfolio = address;
        //     }
        // });

        const selectedConnection = this.walletList.filter((wallet) => wallet.text === connection.connection)[0];

        this.formGroup.controls['connection'].patchValue([selectedConnection]);
        this.formGroup.controls['sub-portfolio'].patchValue([selectedSubPortfolio]);

        this.isAcceptedConnectionListDisplayed = false;
        this.isEditFormDisplayed = true;
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
                ConnectionService.setRequestedFromConnections(false, this.ngRedux);
                ConnectionService.setRequestedToConnections(false, this.ngRedux);
                this.showSuccessResponse('The connection has successfully been deleted');
            },
            (error) => {
                console.error('error: ', error);
            })
        );

        this.changeDetectorRef.markForCheck();
    }

    handleAcceptConnection(connectionId: number) {
        const myConnection = this.toConnectionList.filter((connection) => {
            return (connection.connectionId === connectionId) ? connection : null;
        })[0];

        const data = {
            leiId: this.connectedWalletId.toString(),
            senderLeiId: myConnection.leiId,
            address: myConnection.keyDetail,
            connectionId: myConnection.connectionId,
            status: '-1'
        };

        const asyncTaskPipe = this.connectionService.createConnection(data);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                ConnectionService.setRequestedFromConnections(false, this.ngRedux);
                ConnectionService.setRequestedToConnections(false, this.ngRedux);
                this.showSuccessResponse('The connection has successfully been accepted');
                this.isAcceptedConnectionListDisplayed = true;
            },
            (error) => {
                console.error('error on accept connection: ', error);
            })
        );

        this.resetForm();
        this.changeDetectorRef.markForCheck();
    }

    handleRejectConnection(connection: any) {
        const data = {
            leiId: this.connectedWalletId,
            senderLei: connection.leiSender
        };

        const asyncTaskPipe = this.connectionService.deleteConnection(data);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                ConnectionService.setRequestedFromConnections(false, this.ngRedux);
                ConnectionService.setRequestedToConnections(false, this.ngRedux);
                this.showSuccessResponse('The connection has successfully been rejected');
            },
            (error) => {
                console.error('error on reject connection: ', error);
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
        this.isAcceptedConnectionListDisplayed = false;
        this.isEditFormDisplayed = false;
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
