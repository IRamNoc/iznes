import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { walletHelper, SagaHelper } from '@setl/utils';
import * as _ from 'lodash';
import {
    WalletNodeRequestService,
    InitialisationService,
    MyWalletsService,
    WalletnodeTxService,
} from '@setl/core-req-services';

@Component({
    selector: 'bilateral-transfer',
    templateUrl: 'bilateral-transfer.component.html',
    styleUrls: ['bilateral-transfer.component.scss'],
})

export class BilateralTransferComponent implements OnInit, OnDestroy {
    public bilateralTransferForm: FormGroup;
    public allInstrumentList: any[];
    public walletRelationships: any[];
    public walletAddressSelectItems: any;

    private walletDirectoryList = {};
    private connectedWalletId: number;
    private subscriptions: Subscription[] = [];

    @select(['wallet', 'myWalletHolding', 'holdingByAsset']) holdingByAssetOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedWalletRelationshipListOb;
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) walletRelationshipListOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletService: MyWalletsService,
                private alertsService: AlertsService) {
    }

    ngOnInit() {
        this.createFormGroup();

        /* Get connectedWalletId */
        this.subscriptions.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            this.connectedWalletId = connectedWalletId;
            this.bilateralTransferForm.controls.asset.reset();
        }));

        /* Get asset list */
        this.subscriptions.push(this.holdingByAssetOb.subscribe((holdings) => {
            const walletsAssetList = _.get(holdings, `[${this.connectedWalletId}]`, {});
            console.log('+++ walletsAssetList', walletsAssetList);

            this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(walletsAssetList);
            this.changeDetectorRef.detectChanges();
        }));

        /* Get wallet addresses */
        this.subscriptions.push(this.addressListOb.subscribe((addressList) => {
            this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(addressList, 'label');
            this.changeDetectorRef.detectChanges();
        }));

        /* Get connected addresses array */
        this.subscriptions.push(
            this.requestedWalletRelationshipListOb.subscribe((requested) => {
                if (!requested) {
                    InitialisationService.requestToRelationship(
                        this.ngRedux, this.myWalletService, this.connectedWalletId);
                }
            }),
            this.walletRelationshipListOb.subscribe((walletList) => {
                if (Object.keys(walletList).length) {
                    this.walletRelationships = walletHelper.walletToRelationshipToSelectItem(
                        walletList, this.walletDirectoryList);
                }
            }),
        );
    }

    createFormGroup() {
        const addressPattern = '^[A]{1}[A-Za-z0-9_-]{32}[AQgw]{1}$';

        this.bilateralTransferForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            offerType: new FormControl('buy', Validators.required),
            assetAddress: new FormControl('', Validators.required),
            recipient: new FormControl('', [Validators.required, Validators.pattern(addressPattern)]),
            amount: new FormControl('', [Validators.required, Validators.pattern('^((?!(0))[0-9]+)$')]),
            witness1: new FormControl('', Validators.required),
            witness2: new FormControl('', Validators.required),
        });
    }

    createContract() {
        console.log('+++ form values', this.bilateralTransferForm.value);
        const data = this.bilateralTransferForm.value;
        const asyncTaskPipe = this.walletnodeTxService.newContract({
            walletId: this.connectedWalletId,
            address: data.assetAddress.id || '',
            contractData: {},
            function: 'dvp_uk',
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (data) => {
            },
            (data) => {
                console.error('error', data);
            },
        ));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
