// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';
// Internal
import {
    ConnectionService,
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService,
    WalletnodeTxService
} from '@setl/core-req-services';

import {setRequestedFromConnections, setRequestedToConnections, setRequestedWalletAddresses} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {SagaHelper} from '@setl/utils/index';
import {MessageConnectionConfig, MessagesService} from '@setl/core-messages';

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
    completeWalletList = [];
    walletList = [];
    addressList = [];
    fromConnectionList = [];
    toConnectionList = [];
    acceptedConnectionList = [];
    pendingConnectionList = [];
    connectionToDelete: any;
    isAcceptedConnectionDisplayed: boolean;
    isDeleteModalDisplayed: boolean;
    isCompleteAddressLoaded: boolean;
    isEditTabDisplayed: boolean;
    isAcceptModalDisplayed: boolean;
    connectionToBind: any;
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
                private cd: ChangeDetectorRef,
                private myWalletsService: MyWalletsService,
                private connectionService: ConnectionService,
                private messagesService: MessagesService) {

        this.connectedWalletId = 0;
        this.requestedWalletAddress = false;
        this.isDeleteModalDisplayed = false;
        this.isCompleteAddressLoaded = false;
        this.isEditTabDisplayed = false;
        this.isAcceptedConnectionDisplayed = false;
        this.isAcceptModalDisplayed = false;

        this.initFormGroup();
    }

    ngOnInit() {
        // Observables
        this.subscriptionsArray.push(this.connectedWalletObs.subscribe((connected) => this.getConnectedWallet(connected)));
        this.subscriptionsArray.push(this.requestedLabelListObs.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.walletListObs.subscribe((wallets) => this.getWalletList(wallets)));
        this.subscriptionsArray.push(this.subPortfolioAddressObs.subscribe((addresses) => this.getAddressList(addresses)));
        this.subscriptionsArray.push(this.requestedAddressListObs.subscribe((requested) => this.requestAddressList(requested)));
        this.subscriptionsArray.push(
            this.requestedFromConnectionStateObs.subscribe((requested) => this.requestFromConnectionList(requested))
        );
        this.subscriptionsArray.push(this.requestedToConnectionStateObs.subscribe((requested) => this.requestToConnectionList(requested)));
        this.subscriptionsArray.push(this.fromConnectionListObs.subscribe((connections) => this.getFromConnectionList(connections)));
        this.subscriptionsArray.push(this.toConnectionListObs.subscribe((connections) => this.getToConnectionList(connections)));
        this.subscriptionsArray.push(this.requestedCompleteAddressesObs.subscribe((requested) => this.requestCompleteAddresses(requested)));

        this.initFormGroup();
    }

    ngOnDestroy() {
        this.subscriptionsArray.forEach((subscription) => subscription.unsubscribe());
    }

    initFormGroup() {
        this.formGroup = new FormGroup({
            'connection': new FormControl('', [Validators.required]),
            'sub-portfolio': new FormControl('', [Validators.required])
        });
    }

    getConnectedWallet(walletId: number) {
        this.connectedWalletId = walletId;
        ConnectionService.setRequestedFromConnections(false, this.ngRedux);
        ConnectionService.setRequestedToConnections(false, this.ngRedux);
        this.getWalletList(this.completeWalletList);

        this.resetForm();
        this.isCompleteAddressLoaded = false;
        this.isAcceptedConnectionDisplayed = true;

        this.cd.markForCheck();
    }

    requestAddressList(requested: boolean) {
        if (!requested && this.connectedWalletId !== 0) {
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(this.ngRedux, this._walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState: boolean) {
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
            this.acceptedConnectionList = this.formatFromConnections(this.fromConnectionList);
            this.pendingConnectionList = this.formatToConnections(this.toConnectionList);
            this.cd.markForCheck();
        }
    }

    getWalletList(wallets: Array<any>) {
        let walletList = [];

        this.completeWalletList = wallets;

        Object.keys(wallets).map((key) => {
            if (wallets[key].walletId !== this.connectedWalletId) {
                walletList.push({
                    id: wallets[key].walletId,
                    text: wallets[key].walletName,
                });
            }
        });

        this.walletList = [...walletList];
        this.cd.markForCheck();
    }

    getAddressList(addresses: Array<any>) {
        let addressList = [];

        Object.keys(addresses).map((key) => {
            addressList.push({
                id: key,
                text: addresses[key].label
            });
        });

        this.addressList = [...addressList];
        this.cd.markForCheck();
    }

    getFromConnectionList(connections: any) {
        const hasChanged = (this.fromConnectionList !== connections && this.isCompleteAddressLoaded);
        this.fromConnectionList = connections.filter((connection) => connection.status === '-1');

        if (hasChanged) {
            this.acceptedConnectionList = this.formatFromConnections(this.fromConnectionList);
        }

        this.cd.markForCheck();
    }

    getToConnectionList(connections: any) {
        const hasChanged = (this.toConnectionList !== connections && this.isCompleteAddressLoaded);
        this.toConnectionList = connections.filter((connection) => connection.status === '1');

        if (hasChanged) {
            this.pendingConnectionList = this.formatToConnections(this.toConnectionList);
        }

        this.cd.markForCheck();
    }

    formatFromConnections(connections: Array<any>) {
        const data = [];

        if (connections && connections.length > 0) {
            connections.map((connection) => {
                const connectionName = this.walletList.filter((wallet) => wallet.id === connection.leiSender)[0].text;
                const subPortfolioName = this.addressList.filter((address) => address.id === connection.keyDetail)[0].text;

                data.push({
                    id: connection.connectionId,
                    connection: connectionName,
                    subPortfolio: subPortfolioName,
                    leiSender: connection.leiSender,
                });
            });

        }

        return data;
    }

    formatToConnections(connections: Array<any>) {
        const data = [];

        if (connections && connections.length > 0) {
            connections.map((connection) => {
                const connectionName = this.walletList.filter((wallet) => wallet.id === connection.leiId)[0].text;

                data.push({
                    id: connection.connectionId,
                    connection: connectionName,
                    leiId: connection.leiId,
                    leiSender: connection.leiSender
                });
            });

        }

        return data;
    }

    handleSubmitButtonClick() {
        let data = null;

        if (!this.isEditTabDisplayed) {
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
                (response) => {
                    ConnectionService.setRequestedFromConnections(false, this.ngRedux);
                    ConnectionService.setRequestedToConnections(false, this.ngRedux);
                    this.isAcceptedConnectionDisplayed = true;

                    this.onSendConnectionMessage(response[1].Data[0]);
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
                    this.showSuccessResponse('The connection has successfully been updated');
                    ConnectionService.setRequestedFromConnections(false, this.ngRedux);
                    ConnectionService.setRequestedToConnections(false, this.ngRedux);
                    this.isAcceptedConnectionDisplayed = true;
                },
                () => {
                    this.showErrorMessage('This connection already exists');
                })
            );
        }

        this.resetForm();
        this.isAcceptedConnectionDisplayed = true;
    }

    handleEditButtonClick(connection) {
        const selectedSubPortfolio = connection.subPortfolio;
        const selectedConnection = this.walletList.filter((wallet) => wallet.text === connection.connection)[0];

        this.formGroup.controls['connection'].patchValue([selectedConnection]);
        this.formGroup.controls['sub-portfolio'].patchValue([selectedSubPortfolio]);

        this.isAcceptedConnectionDisplayed = false;
        this.isEditTabDisplayed = true;
    }

    handleDeleteButtonClick(connection) {
        this.connectionToDelete = connection;
        this.isDeleteModalDisplayed = true;
    }

    handleAcceptButtonClick(connection) {
        this.connectionToBind = connection;
        this.isAcceptModalDisplayed = true;
    }

    handleRejectButtonClick(connection: any) {
        const data = {
            leiId: connection.leiId,
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
    }

    onAcceptConnection(isOk: boolean) {
        if (isOk) {
            const selectedAddress = this.formGroup.controls['sub-portfolio'].value[0].id;

            const myConnection = this.toConnectionList.filter((connection) => {
                return (connection.connectionId === this.connectionToBind.id) ? connection : null;
            })[0];

            const data = {
                leiId: this.connectedWalletId.toString(),
                senderLeiId: myConnection.leiId,
                address: selectedAddress,
                connectionId: myConnection.connectionId,
                status: '-1'
            };

            const asyncTaskPipe = this.connectionService.createConnection(data);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                () => {
                    this.showSuccessResponse('The connection has successfully been accepted');
                    ConnectionService.setRequestedFromConnections(false, this.ngRedux);
                    ConnectionService.setRequestedToConnections(false, this.ngRedux);
                    this.connectionToBind = null;
                    this.isAcceptModalDisplayed = false;
                },
                (error) => {
                    console.error('error on accept connection: ', error);
                })
            );
        } else {
            this.connectionToBind = null;
            this.isAcceptModalDisplayed = false;
        }

        this.resetForm();
    }

    onSendConnectionMessage(response: any) {
        const acceptPayload = {
            topic: 'newconnection',
            leiId: response.LeiSender,
            senderLeiId: response.LeiID,
            address: response.keyDetail,
            connectionId: response.connectionID,
            status: '-1'
        };

        const rejectPayload = {
            topic: 'deleteconnection',
            leiId: response.LeiID,
            senderLei: response.LeiSender
        };

        const actionConfig = new MessageConnectionConfig();
        actionConfig.completeText = 'Connection accepted';

        actionConfig.actions.push({
            text: 'Accept',
            text_mltag: 'txt_accept',
            styleClasses: 'btn-success',
            payload: acceptPayload,
        });

        actionConfig.actions.push({
            text: 'Reject',
            text_mltag: 'txt_reject',
            styleClasses: 'btn-danger',
            payload: rejectPayload,
        });

        this.messagesService.sendMessage(
            [response.LeiSender],
            'Connection request',
            '',
            actionConfig
        ).then(() => {
            this.showSuccessResponse('The connection has successfully been created and an e-mail has been sent to the recipient');
        }).catch((e) => {
            console.log('connection request email fail: ', e);
        });
    }

    onDeleteConnection(isOk): void {
        if (isOk) {
            const data = {
                leiId: this.connectedWalletId,
                senderLei: this.connectionToDelete.leiSender
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
        } else {
            this.connectionToDelete = null;
            this.isDeleteModalDisplayed = false;
        }

        this.resetForm();
    }

    resetForm(): void {
        this.isAcceptedConnectionDisplayed = false;
        this.isEditTabDisplayed = false;
        this.isAcceptModalDisplayed = false;

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
