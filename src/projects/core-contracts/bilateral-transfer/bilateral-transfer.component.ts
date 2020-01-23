import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { BilateralTransferService } from './bilateral-transfer.service';
import { walletHelper, SagaHelper } from '@setl/utils';
import * as _ from 'lodash';
import {
    WalletNodeRequestService,
    InitialisationService,
    MyWalletsService,
    WalletnodeTxService,
} from '@setl/core-req-services';
import { MultilingualService } from '@setl/multilingual';

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
                private bilateralTransferService: BilateralTransferService,
                private alertsService: AlertsService,
                private translate: MultilingualService) {
    }

    ngOnInit() {
        /* Get connected wallet ID */
        this.subscriptions.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            this.connectedWalletId = connectedWalletId;
            this.createFormGroup();
        }));

        /* Get asset list */
        this.subscriptions.push(this.holdingByAssetOb.subscribe((holdings) => {
            const walletsAssetList = _.get(holdings, `[${this.connectedWalletId}]`, {});

            this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(walletsAssetList);
            this.changeDetectorRef.detectChanges();
        }));

        /* Get wallet addresses */
        this.subscriptions.push(this.addressListOb.subscribe((addressList) => {
            this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(addressList, 'label');
            this.changeDetectorRef.detectChanges();
        }));

        /* Get connections array */
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

    /**
     * Create FormGroup
     * -----------------
     * Sets up the Bilateral Transfer FromGroup
     */
    createFormGroup() {
        const addressPattern = '^[A]{1}[A-Za-z0-9_-]{32}[AQgw]{1}$';

        this.bilateralTransferForm = new FormGroup(
            {
                asset: new FormControl('', Validators.required),
                offerType: new FormControl('buy', Validators.required),
                assetAddress: new FormControl('', Validators.required),
                recipient: new FormControl('', [Validators.required, Validators.pattern(addressPattern)]),
                amount: new FormControl('', [Validators.required, Validators.pattern('^((?!(0))[0-9]+)$')]),
                witness1: new FormControl(''),
                witness2: new FormControl(''),
            },
            [
                this.addressValidator,
                this.witnessValidator,
            ],
        );
    }

    /**
     * Address Validator
     * ----------------
     * Validates the party addresses to ensure they do not match
     * @param g: FormGroup
     * @return null
     */
    addressValidator(g: FormGroup) {
        const assetAddress = _.get(g, 'controls.assetAddress.value[0].id', '');
        const recipient = _.get(g, 'controls.recipient.value', '');
        const existingErrors = g.controls.recipient.errors;
        if (existingErrors !== null) delete existingErrors.matchesAssetAddress;

        if (assetAddress && recipient) {
            assetAddress === recipient ?
                g.controls.recipient.setErrors({ matchesAssetAddress: true }) :
                g.controls.recipient.setErrors(_.isEmpty(existingErrors) ? null : existingErrors);
        }
        return null;
    }

    /**
     * Witness Validator
     * ----------------
     * Validates the witnesses to ensure they do not match another address within the contract
     * @param g: FormGroup
     * @return null
     */
    witnessValidator(g: FormGroup) {
        const assetAddress = _.get(g, 'controls.assetAddress.value[0].id', '');
        const recipient = _.get(g, 'controls.recipient.value', '');
        const witness1 = _.get(g, 'controls.witness1.value[0].id', '');
        const witness2 = _.get(g, 'controls.witness2.value[0].id', '');
        let existingErrors;

        if (assetAddress && recipient) {
            existingErrors = g.controls.witness2.errors;
            if (existingErrors !== null) delete existingErrors.matchesParty;

            witness1 === assetAddress || witness1 === recipient ?
                g.controls.witness1.setErrors({ matchesParty: true }) :
                g.controls.witness1.setErrors(null);

            witness2 === assetAddress || witness2 === recipient ?
                g.controls.witness2.setErrors({ matchesParty: true }) :
                g.controls.witness2.setErrors(_.isEmpty(existingErrors) ? null : existingErrors);
        }

        if (witness1 && witness2) {
            existingErrors = g.controls.witness2.errors;
            if (existingErrors !== null) delete existingErrors.matchesWitness;
            witness1 === witness2 ?
                g.controls.witness2.setErrors(
                    _.isEmpty(existingErrors) ?
                        { matchesWitness: true } :
                        Object.assign({}, existingErrors, { matchesWitness: true }),
                ) :
                g.controls.witness2.setErrors(_.isEmpty(existingErrors) ? null : existingErrors);
        }
        return null;
    }

    /**
     * Create Contract
     * ---------------
     * Creates a bilateral contract request from formatted FormGroup values
     */
    createContract() {
        const contractData = this.bilateralTransferService.getContractData(this.bilateralTransferForm.value);

        const asyncTaskPipe = this.walletnodeTxService.newContract({
            walletId: this.connectedWalletId,
            address: _.get(this.bilateralTransferForm, 'value.assetAddress[0].id', ''),
            contractData: contractData.contractdata,
            function: 'dvp_uk',
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (response) => {
                this.showResponseModal(response);
                this.createFormGroup();
            },
            (data) => {
                console.log('ERROR', data);
                this.alertsService.generate('error', this.translate.translate('Bilateral Transfer failed.'));
            },
        ));
    }

    /**
     * Shows Response Modal
     * -------------------
     * Triggers a success alert displaying details of the newly created contract
     *
     * @param response
     */
    showResponseModal(response) {
        if (_.get(response, '[1].data.contractaddress', false) && _.get(response, '[1].data.hash', false)) {
            this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Contract')}:</b></td>
                        <td>${response[1].data.contractaddress}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Creator Address')}:</b></td>
                        <td>${this.bilateralTransferForm.controls.assetAddress.value[0].id}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Tx hash')}:</b></td>
                        <td>${response[1].data.hash.substring(0, 10)}...</td>
                    </tr>
                </tbody>
            </table>`);
        } else {
            this.alertsService.create('success', 'Contract created successfully.');
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
