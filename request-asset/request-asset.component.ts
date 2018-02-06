import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {walletHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {MessageActionsConfig, MessagesService} from '@setl/core-messages';
import {
    InitialisationService, MyWalletsService, WalletNodeRequestService,
    WalletnodeTxService
} from '@setl/core-req-services';
import {TRANSFER_ASSET_FAIL, TRANSFER_ASSET_SUCCESS} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Unsubscribe} from 'redux';
import _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs';
import {PersistService} from "@setl/core-persist";

@Component({
    selector: 'app-request-asset',
    templateUrl: './request-asset.component.html',
    styleUrls: ['./request-asset.component.css']
})
export class RequestAssetComponent implements OnInit, OnDestroy {

    requestAssetForm: FormGroup;

    subscriptionsArray: Array<Subscription> = [];

    connectedWalletId: number;

    allInstrumentList: Array<any>;

    walletAddressList: Array<any>;
    walletRelationshipType: Array<any>;

    requestType: number;
    fromRelationship: number;
    walletFrom: number;
    addressTo: string;

    // Asset
    @select(['asset', 'allInstruments', 'requested']) requestedAllInstrumentOb: Observable<boolean>;
    @select(['asset', 'allInstruments', 'instrumentList']) allInstrumentOb: Observable<any>;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletService: MyWalletsService,
                private messagesService: MessagesService,
                private _persistService: PersistService) {

        /* send asset form */
        const formGroup = new FormGroup({
            asset: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required)
        });

        this.requestAssetForm = this._persistService.watchForm('assetServicing/requestAsset', formGroup);

        /* data subscriptions */
        this.initAssetSubscriptions();
    }

    ngOnInit() {
    }

    private initAssetSubscriptions(): void {
        this.subscriptionsArray.push(
            this.requestedAllInstrumentOb.subscribe((requested) => {
                if (!requested) InitialisationService.requestAllInstruments(this.ngRedux, this.walletNodeRequestService);
            }),
            this.allInstrumentOb.subscribe((instrumentList) => {
                this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(instrumentList);
                this.changeDetectorRef.markForCheck();
            }),
            this.connectedWalletOb.subscribe(connected => {
                this.connectedWalletId = connected;
            })
        );
    }

    requestTypeOb(id: number): void {
        this.requestType = id;
    }

    fromRelationshipOb(id: number): void {
        this.fromRelationship = id;
    }

    walletFromOb(id: number): void {
        this.walletFrom = id;
    }

    addressToOb(id: string): void {
        this.addressTo = id;
    }

    requestAsset(): void {
        const fullAssetId = _.get(this.requestAssetForm.value.asset, '[0].id', '');
        const fullAssetIdSplit = walletHelper.splitFullAssetId(fullAssetId);
        const namespace = fullAssetIdSplit.issuer;
        const instrument = fullAssetIdSplit.instrument;

        const amount = this.requestAssetForm.get('amount').value;

        const actionConfig: MessageActionsConfig = new MessageActionsConfig();
        actionConfig.completeText = 'Transfer of Asset Complete';

        // Add the action button that will apear on the email
        actionConfig.actions.push({
            text: "Transfer Asset",
            text_mltag: "txt_transferasset",
            styleClasses: "btn-primary",
            messageType: "tx",
            payload: {
                topic: 'astra',
                walletid: this.connectedWalletId,
                toaddress: this.addressTo,
                namespace: namespace,
                instrument: instrument,
                amount: amount
            },
            successType: TRANSFER_ASSET_SUCCESS,
            failureType: TRANSFER_ASSET_FAIL
        });

        // Add the data regarding the asset transfer to the email
        actionConfig.content.push({
            name: 'Asset',
            name_mltag: 'txt_asset',
            content: fullAssetId
        }, {
            name: 'Address To',
            name_mltag: 'txt_addressto',
            content: this.addressTo
        }, {
            name: 'Amount',
            name_mltag: 'txt_amount',
            content: amount
        });

        this.messagesService.sendMessage(
            [this.walletFrom],
            'Transfer Asset Request',
            null,
            actionConfig
        ).then((data) => {
            this.alertsService.create('success', `<table class="table grid">
                <tbody>
                    <tr>
                        <td>Transfer Request successfully sent</td>
                    </tr>
                </tbody>
            </table>`);
        }).catch((e) => {
            this.alertsService.create('error', `<table class="table grid">
                <tbody>
                    <tr>
                        <td>Transfer Request could not be sent</td>
                    </tr>
                </tbody>
            </table>`);
            console.log("transfer request email failed", e);
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
