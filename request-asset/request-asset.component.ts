import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { walletHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { MessageActionsConfig, MessagesService } from '@setl/core-messages';
import {
    InitialisationService, WalletNodeRequestService, ConnectionService,
} from '@setl/core-req-services';
import {
    TRANSFER_ASSET_FAIL,
    TRANSFER_ASSET_SUCCESS,
    ADD_WALLETNODE_TX_STATUS,
    setRequestedFromConnections,
    setRequestedToConnections,
} from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Unsubscribe } from 'redux';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-request-asset',
    templateUrl: './request-asset.component.html',
    styleUrls: ['./request-asset.component.css'],
})
export class RequestAssetComponent implements OnInit, OnDestroy {
    subscriptionsArray: Subscription[] = [];

    connectedWalletId: number;
    requestAssetForm: FormGroup;
    allInstrumentList: any[];
    walletAddressList: any[];
    walletRelationshipType: any[];
    requestType: number;
    walletFrom: number;
    addressTo: string;
    fromConnectionList = [];
    toConnectionList = [];
    toRelationshipList = [];

    /* Asset */
    @select(['asset', 'allInstruments', 'requested']) requestedAllInstrumentOb: Observable<boolean>;
    @select(['asset', 'allInstruments', 'instrumentList']) allInstrumentOb: Observable<any>;

    /* Connection */
    @select(['connection', 'myConnections', 'requestedFromConnectionList']) requestedFromConnectionStateObs;
    @select(['connection', 'myConnections', 'requestedToConnectionList']) requestedToConnectionStateObs;
    @select(['connection', 'myConnections', 'fromConnectionList']) fromConnectionListObs;
    @select(['connection', 'myConnections', 'toConnectionList']) toConnectionListObs;

    /* Wallet relationships */
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) toRelationshipListOb;

    /* User */
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    /* Redux unsubscription */
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private messagesService: MessagesService,
                private connectionService: ConnectionService) {

        /* Send asset form */
        this.requestAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
        });

        /* data subscriptions */
        this.initAssetSubscriptions();
    }

    ngOnInit() {
    }

    private initAssetSubscriptions(): void {
        this.subscriptionsArray.push(
            this.requestedAllInstrumentOb.subscribe((requested) => {
                if (!requested) {
                    InitialisationService.requestAllInstruments(this.ngRedux, this.walletNodeRequestService);
                }
            }),
            this.allInstrumentOb.subscribe((instrumentList) => {
                this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(instrumentList);
                this.changeDetectorRef.markForCheck();
            }),
            this.connectedWalletOb.subscribe((connected) => {
                this.requestAssetForm.reset();
                this.getConnectedWallet(connected);
            }),
            this.toRelationshipListOb.subscribe((toRelationshipList) => {
                this.toRelationshipList = toRelationshipList;
                this.changeDetectorRef.markForCheck();
            }),
            this.fromConnectionListObs.subscribe((connections) => {
                this.getFromConnectionList(connections);
            }),
            this.toConnectionListObs.subscribe((connections) => {
                this.getToConnectionList(connections);
            }),
            this.requestedFromConnectionStateObs.subscribe((requested) => {
                this.requestFromConnectionList(requested);
            }),
            this.requestedToConnectionStateObs.subscribe((requested) => {
                this.requestToConnectionList(requested);
            }),
        );
    }

    getConnectedWallet(walletId: number) {
        this.connectedWalletId = walletId;

        ConnectionService.setRequestedFromConnections(false, this.ngRedux);
        ConnectionService.setRequestedToConnections(false, this.ngRedux);

        this.changeDetectorRef.markForCheck();
    }

    getFromConnectionList(fromConnections: any[]) {
        this.fromConnectionList = fromConnections;
        this.changeDetectorRef.markForCheck();
    }

    getToConnectionList(toConnections: any[]) {
        this.toConnectionList = toConnections;
        this.changeDetectorRef.markForCheck();
    }

    requestFromConnectionList(requestedState: boolean) {
        if (!requestedState && this.connectedWalletId) {
            this.ngRedux.dispatch(setRequestedFromConnections());

            ConnectionService.requestFromConnectionList(
                this.connectionService, this.ngRedux, this.connectedWalletId.toString());
        }
    }

    requestToConnectionList(requestedState: boolean) {
        if (!requestedState && this.connectedWalletId) {
            this.ngRedux.dispatch(setRequestedToConnections());

            ConnectionService.requestToConnectionList(
                this.connectionService, this.ngRedux, this.connectedWalletId.toString());
        }
    }

    requestTypeOb(id: number): void {
        this.requestType = id;
    }

    /* Request asset from selected wallet in Connection menu */
    fromRelationshipOb(id: number): void {
        /* Request the asset from the wallet */
        this.walletFrom = id;
        /* Set addressTo using Connection */
        this.setAddressToUsingConnection();
    }

    walletFromOb(id: number): void {
        this.walletFrom = id;
    }

    addressToOb(id: string): void {
        this.addressTo = id;
    }

    /**
     * Sets addressTo using Connection
     *
     * @returns {void}
     */
    setAddressToUsingConnection(): void {
        if (this.walletFrom) {
            if (this.toRelationshipList[this.walletFrom] &&
                this.toRelationshipList[this.walletFrom].toWalletId === this.walletFrom) {

                const connectedWalletAddress = this.toRelationshipList[this.walletFrom].keyDetail;
                let connectionId = 0;

                this.toConnectionList.forEach((item) => {
                    if ((item.keyDetail === connectedWalletAddress) && (item.leiId === this.walletFrom)) {
                        connectionId = item.connectionId;
                    }
                });

                if (connectionId) {
                    this.fromConnectionList.forEach((item) => {
                        if (item.connectionId === connectionId) {
                            this.addressTo = item.keyDetail;
                        }
                    });
                }
            }
        }
    }

    requestAsset(): void {
        /* Trigger loading alert */
        this.alertsService.create('loading');

        const fullAssetId = _.get(this.requestAssetForm.value.asset, '[0].id', '');
        const fullAssetIdSplit = walletHelper.splitFullAssetId(fullAssetId);
        const namespace = fullAssetIdSplit.issuer;
        const instrument = fullAssetIdSplit.instrument;
        const amount = this.requestAssetForm.get('amount').value;

        const actionConfig: MessageActionsConfig = new MessageActionsConfig();
        actionConfig.completeText = 'Transfer of Asset Complete';

        /* Add the action button that will apear on the email */
        actionConfig.actions.push({
            text: 'Transfer Asset',
            text_mltag: 'txt_transferasset',
            styleClasses: 'btn-primary',
            messageType: 'tx',
            payload: {
                topic: 'astra',
                walletid: this.connectedWalletId,
                toaddress: this.addressTo,
                namespace,
                instrument,
                amount,
            },
            successType: TRANSFER_ASSET_SUCCESS,
            failureType: TRANSFER_ASSET_FAIL,
        });

        /* Add the data regarding the asset transfer to the email */
        actionConfig.content.push(
            {
                name: 'Asset',
                name_mltag: 'txt_asset',
                content: fullAssetId,
            },
            {
                name: 'Address To',
                name_mltag: 'txt_addressto',
                content: this.addressTo,
            },
            {
                name: 'Amount',
                name_mltag: 'txt_amount',
                content: amount,
            },
        );

        this.messagesService.sendMessage(
            [this.walletFrom],
            'Transfer Asset Request',
            null,
            actionConfig,
        ).then((data) => {
            this.alertsService.create('success', `<table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">Transfer Request successfully sent</td>
                    </tr>
                </tbody>
            </table>`);
        }).catch((e) => {
            this.alertsService.create('error', `<table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">Transfer Request could not be sent</td>
                    </tr>
                </tbody>
            </table>`);
            console.log('transfer request email failed', e);
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
