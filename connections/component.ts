// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import _ from 'lodash';
// Internal
import {
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService,
    WalletnodeTxService
} from '@setl/core-req-services';

import { setRequestedWalletAddresses, setRequestedWalletToRelationship } from '@setl/core-store';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConnectionsService } from '../connections.service';

@Component({
    selector: 'app-my-connections',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent implements OnInit, OnDestroy {
    tabsControl: any = [];
    requestedWalletAddress: boolean;
    connectedWalletId: number;
    walletList = [];
    addressList = [];
    formGroup: FormGroup;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // List of Redux observable.
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedToRelationshipState;
    @select(['wallet', 'walletDirectory', 'walletList']) walletListObs;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListObs;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListObs;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListObs;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletObs;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private _myWalletService: MyWalletsService,
                private _walletnodeTxService: WalletnodeTxService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private changeDetectorRef: ChangeDetectorRef,
                private myWalletsService: MyWalletsService,
                private connectionService: ConnectionsService) {

        this.connectedWalletId = 0;
        this.requestedWalletAddress = false;

        this.subscriptionsArray.push(this.walletListObs.subscribe((wallets) => this.requestWalletList(wallets)));

        this.subscriptionsArray.push(this.connectedWalletObs.subscribe((connected) => this.connectedWalletId = connected));

        this.subscriptionsArray.push(this.requestedAddressListObs.subscribe((requested) => this.requestAddressList(requested)));
        this.subscriptionsArray.push(this.requestedLabelListObs.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.addressListObs.subscribe((addresses) => this.getAddressList(addresses)));

        this.subscriptionsArray.push(this.requestedToRelationshipState.subscribe(
            (requestedState) => this.requestWalletToRelationship(requestedState)
        ));
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

    requestWalletList(wallets) {
        let data = [];

        Object.keys(wallets).map((key) => {
            data.push({
                id: wallets[key].walletID,
                text: wallets[key].walletName
            });
        });

        this.walletList = data;
    }

    requestAddressList(requested) {
        console.log('requested wallet address', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requested && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this.ngRedux, this._walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletToRelationship(requestedInstrumentState) {
        if (!requestedInstrumentState) {
            const walletId = this.connectedWalletId;

            // Set request wallet to-relationship flag to true, to indicate that we have already requested wallet to
            // relationship.
            this.ngRedux.dispatch(setRequestedWalletToRelationship());

            InitialisationService.requestToRelationship(this.ngRedux, this.myWalletsService, walletId);
        }
    }

    requestWalletLabel(requestedState: boolean) {
        console.log('checking requested', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this._myWalletService, this.connectedWalletId);
        }
    }

    getAddressList(addresses) {
        let data = [];

        Object.keys(addresses).map((key) => {
            data.push({
                id: key,
                text: addresses[key].label
            });
        });

        this.addressList = data;
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
            leoId: this.connectedWalletId.toString(),
            senderLeiId: this.formGroup.controls['connection'].value[0].id.toString(),
            address: this.formGroup.controls['sub-portfolio'].value[0].label,
            connectionId: 0,
            status: 1
        };
    }

    handleEdit($e) {

    }

    handleDelete($e) {

    }
}
