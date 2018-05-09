import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SagaHelper, walletHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {
    InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService
} from '@setl/core-req-services';
import {
    setRequestedWalletAddresses, setRequestedWalletInstrument, getWalletIssuerDetail
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Unsubscribe} from 'redux';
import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {PersistService} from '@setl/core-persist';

@Component({
    selector: 'app-void-asset',
    templateUrl: './void-asset.component.html',
    styleUrls: ['./void-asset.component.css']
})

export class VoidAssetComponent implements OnInit, OnDestroy {
    // Observable subscription array.
    subscriptionsArray: Array<Subscription> = [];

    voidAssetForm: FormGroup;
    connectedWalletId: number;
    walletIssuerDetail: {
        walletIssuer: string;
        walletIssuerAddress: string;
    };

    walletInstrumentsSelectItems: Array<any>;
    walletAddressSelectItems: any;

    // List of redux observable
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedAddressListLabelOb;
    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    @select(['asset', 'myInstruments', 'instrumentList']) instrumentListOb;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletsService: MyWalletsService,
                private _persistService: PersistService) {

        const newState = this.ngRedux.getState();
        this.walletIssuerDetail = getWalletIssuerDetail(newState);

        /**
         * Void Asset form
         */
        const formGroup = new FormGroup({
            asset: new FormControl('', Validators.required),
            fromAddress: new FormControl('', Validators.required),
            toAddress: new FormControl(this.walletIssuerDetail.walletIssuer, Validators.required),
            amount: new FormControl('', Validators.required),
        });

        this.voidAssetForm = this._persistService.watchForm('assetServicing/VoidAsset', formGroup);

        // List of observable subscriptions.
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connectedWalletId) => this.connectedWalletId = connectedWalletId));
        this.subscriptionsArray.push(this.requestedAddressListLabelOb.subscribe((requested) => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe((requested) => this.requestWalletAddressList(requested)));
        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => {
            this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(addressList, 'label');
            this.changeDetectorRef.markForCheck();
        }));
        this.subscriptionsArray.push(this.requestedInstrumentState.subscribe((requestedState) => {
            this.requestWalletInstruments(requestedState);
        }));
        this.subscriptionsArray.push(this.instrumentListOb.subscribe((instrumentList) => {
            this.walletInstrumentsSelectItems = walletHelper.walletInstrumentListToSelectItem(instrumentList);
            this.changeDetectorRef.markForCheck();
        }));
    }

    ngOnInit() {
    }

    /**
     *  Request wallet address list.
     *
     * @param requestedState
     */
    requestWalletAddressList(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletsService, this.connectedWalletId);
        }
    }

    requestWalletInstruments(requestedInstrumentState) {
        if (!requestedInstrumentState) {
            const walletId = this.connectedWalletId;

            // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
            this.ngRedux.dispatch(setRequestedWalletInstrument());

            InitialisationService.requestWalletInstruments(this.ngRedux, this.walletNodeRequestService, walletId);
        }
    }

    voidAsset() {
        if (this.voidAssetForm.valid) {
            const walletId = this.connectedWalletId;
            const fullAssetId = _.get(this.voidAssetForm.value.asset, '[0].id', '');
            const fullAssetIdSplit = walletHelper.splitFullAssetId(fullAssetId);
            const namespace = fullAssetIdSplit.issuer;
            const instrument = fullAssetIdSplit.instrument;
            const fromAddress = this.voidAssetForm.value.fromAddress;
            const toAddress =  this.walletIssuerDetail.walletIssuerAddress;
            const amount = this.voidAssetForm.value.amount;

            // Create a saga pipe.
            const asyncTaskPipe = this.walletnodeTxService.voidAsset({
                walletId,
                namespace,
                instrument,
                fromAddress,
                toAddress,
                amount
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [],
                [],
                asyncTaskPipe,
                {},
                function (data) {
                    console.log('void asset:', data);
                },
                function (data) {
                    console.log('fail', data);
                }
            ));
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
