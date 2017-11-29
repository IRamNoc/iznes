import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {SagaHelper, walletHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {
    WalletNodeRequestService,
    WalletnodeTxService,
    InitialisationService,
    MyWalletsService
} from '@setl/core-req-services';
import {
    getConnectedWallet,
    getMyInstrumentsList,
    getWalletToRelationshipList,
    getWalletDirectoryList,
    getWalletAddressList,
    setRequestedWalletAddresses,
    setRequestedWalletInstrument,
    setRequestedWalletToRelationship
} from '@setl/core-store';
import {Unsubscribe} from 'redux';
import _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-send-asset',
    templateUrl: './send-asset.component.html',
    styleUrls: ['./send-asset.component.css']
})
export class SendAssetComponent implements OnInit, OnDestroy {
    // Observable subscription array.
    subscriptionsArray: Array<Subscription> = [];

    sendAssetForm: FormGroup;
    connectedWalletId: number;

    walletInstrumentsSelectItems: Array<any>;
    walletAddressSelectItems: any;
    toRelationshipSelectItems: Array<any>;

    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedToRelationshipState;
    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletService: MyWalletsService) {
        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Send Asset form
         */
        this.sendAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            sendFrom: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
        });

        // List of observable subscriptions
        this.requestedInstrumentState.subscribe((requestedState) => this.requestWalletInstruments(requestedState));
        this.requestedToRelationshipState.subscribe((requestedState) => this.requestWalletToRelationship(requestedState));
        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe((requested) => this.requestWalletAddressList(requested)));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));
    }

    ngOnInit() {
        //
    }

    updateState() {
        const newState = this.ngRedux.getState();

        // Set connected WalletId
        this.connectedWalletId = getConnectedWallet(newState);

        // Get wallet addresses and update wallet address items list
        const currentWalletAddressList = getWalletAddressList(newState);
        this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(currentWalletAddressList);
        console.log(this.walletAddressSelectItems);

        const walletInstruments = getMyInstrumentsList(newState);
        this.walletInstrumentsSelectItems = walletHelper.walletInstrumentListToSelectItem(walletInstruments);

        const walletToRelationship = getWalletToRelationshipList(newState);
        const walletDirectoryList = getWalletDirectoryList(newState);
        this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(walletToRelationship, walletDirectoryList);
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

    requestWalletLabel(requestedState) {

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
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

    requestWalletToRelationship(requestedInstrumentState) {

        if (!requestedInstrumentState) {
            const walletId = this.connectedWalletId;

            // Set request wallet to-relationship flag to true, to indicate that we have already requested wallet to
            // relationship.
            this.ngRedux.dispatch(setRequestedWalletToRelationship());

            InitialisationService.requestToRelationship(this.ngRedux, this.myWalletService, walletId);
        }
    }

    sendAsset() {
        if (this.sendAssetForm.valid) {
            const walletId = this.connectedWalletId;
            const fromAddress = _.get(this.sendAssetForm.value.sendFrom, '[0].id', '');
            const toAddress = this.sendAssetForm.value.recipient;
            const fullAssetId = _.get(this.sendAssetForm.value.asset, '[0].id', '');
            const fullAssetIdSplit = walletHelper.splitFullAssetId(fullAssetId);
            const namespace = fullAssetIdSplit.issuer;
            const instrument = fullAssetIdSplit.instrument;
            const amount = this.sendAssetForm.value.amount;

            // Create a saga pipe.
            const asyncTaskPipe = this.walletnodeTxService.sendAsset({
                walletId,
                fromAddress,
                toAddress,
                namespace,
                instrument,
                amount
            });

            //
            // this.ngRedux.dispatch(SagaHelper.runAsync(
            //     [ISSUE_ASSET_SUCCESS],
            //     [ISSUE_ASSET_FAIL],
            //     asyncTaskPipe,
            //     {},
            //     function (data) {
            //         console.log('issue asset:', data);
            //     },
            //     function (data) {
            //         console.log('fail', data);
            //     }
            // ));
        }
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}

