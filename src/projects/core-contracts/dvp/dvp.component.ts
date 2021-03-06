import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import * as moment from 'moment';
import { walletHelper, mDateHelper } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';
import {
    setRequestedWalletAddresses,
    setRequestedWalletToRelationship,
} from '@setl/core-store';
import {
    WalletNodeRequestService,
    InitialisationService,
    MyWalletsService,
} from '@setl/core-req-services';
import { DvpParty, partyA, partyB } from './dvp.model';
import { DVPContractService } from './dvp.service';

@Component({
    selector: 'setl-contracts-dvp',
    templateUrl: 'dvp.component.html',
    styleUrls: ['dvp.component.css'],
})
export class ContractsDvpComponent implements OnInit, OnDestroy {
    createContractForm: FormGroup;
    parties: [DvpParty, DvpParty];
    allInstrumentList: any[];
    connectedWalletId: number;
    subscriptions: Subscription[] = [];
    addressList: any[];
    toRelationshipSelectItems: any[];
    walletDirectoryList: {} = {};
    walletAddressSelectItems: any;
    walletDirectoryListRaw: any[];
    walletRelationships: any[];
    language: string = 'en';

    /* Setup datepicker */
    public configDatePicker = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        min: moment(),
        locale: this.language,
    };

    public configTimePicker = {
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        format: 'HH:mm',
    };

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['asset', 'allInstruments', 'requested']) requestedAllInstrumentOb;
    @select(['asset', 'allInstruments', 'instrumentList']) allInstrumentOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedWalletRelationshipListOb;
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) walletRelationshipListOb;
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryListOb;
    @select(['user', 'siteSettings', 'language']) languageOb;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private walletNodeRequestService: WalletNodeRequestService,
                private myWalletService: MyWalletsService,
                private alertsService: AlertsService,
                private dvpService: DVPContractService,
                public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.initParties();
        this.initCreateContractForm();
    }

    /**
     * Redux
     */
    private initSubscriptions(): void {
        this.subscriptions.push(this.connectedWalletOb.subscribe((connected) => {
            this.connectedWalletId = connected;
        }));
        this.subscriptions.push(
            this.requestedAllInstrumentOb.subscribe((requested) => {
                this.requestAllInstrument(requested);
            }),
        );
        this.subscriptions.push(this.allInstrumentOb.subscribe((instrumentList) => {
            this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(instrumentList);
            this.changeDetectorRef.markForCheck();
        }));
        this.subscriptions.push(this.addressListOb.subscribe((walletList) => {
            this.walletDirectoryListRaw = walletList;
            this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(walletList, 'label');
            this.changeDetectorRef.markForCheck();
        }));
        this.subscriptions.push(this.requestedAddressListOb.subscribe((requested) => {
            this.requestAddressList(requested);
            this.changeDetectorRef.markForCheck();
        }));
        this.subscriptions.push(this.requestedLabelListOb.subscribe((requested) => {
            this.requestWalletLabel(requested);
        }));
        this.subscriptions.push(this.requestedWalletRelationshipListOb.subscribe((requested) => {
            this.requestWalletToRelationship(requested);
        }));
        this.subscriptions.push(this.walletRelationshipListOb.subscribe((toRelationshipList) => {
            this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(
                toRelationshipList,
                this.walletDirectoryList,
            );
            this.changeDetectorRef.markForCheck();
        }));
        this.subscriptions.push(
            this.walletDirectoryListOb.subscribe((walletList) => {
                this.walletDirectoryListRaw = walletList;
                this.walletDirectoryList = walletHelper.walletAddressListToSelectItem(walletList, 'walletName');
            }),
        );
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
                this.changeDetectorRef.markForCheck();
            }),
        );
        this.subscriptions.push(this.languageOb.subscribe(lang => this.language = lang === 'fr-Latn' ? 'fr' : 'en'));
    }

    private requestAllInstrument(requested: boolean): void {
        if (!requested) {
            InitialisationService.requestAllInstruments(
                this.ngRedux,
                this.walletNodeRequestService,
            );
        }
    }

    private requestAddressList(requested: boolean): void {
        if (!requested && this.connectedWalletId !== 0) {
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(
                this.ngRedux,
                this.walletNodeRequestService,
                this.connectedWalletId,
            );
        }
    }

    private requestWalletLabel(requested: boolean): void {
        if (!requested && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(
                this.ngRedux,
                this.myWalletService,
                this.connectedWalletId,
            );
        }
    }

    private requestWalletToRelationship(requestedInstrumentState) {
        if (!requestedInstrumentState) {
            this.ngRedux.dispatch(setRequestedWalletToRelationship());

            InitialisationService.requestToRelationship(
                this.ngRedux,
                this.myWalletService,
                this.connectedWalletId,
            );
        }
    }

    /**
     * UI
     */
    private initParties(): void {
        this.parties = [{
            id: partyA,
            title: this.translate.translate('Party A'),
        }, {
            id: partyB,
            title: this.translate.translate('Party B'),
            toggleAssetReturn: true,
        }];
    }

    private initCreateContractForm(): void {
        const currentDate = moment(mDateHelper.getCurrentUnixTimestamp());

        this.createContractForm = new FormGroup({
            creator: new FormControl('', Validators.required),
            expireDate: new FormControl(
                currentDate.add(1, 'days').format('YYYY-MM-DD'),
                [Validators.pattern('^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'),
                    Validators.required],
            ),
            expireTime: new FormControl('', Validators.required),
        });

        this.addPartiesToForm();
        this.toggleReturnAsset(false);

        this.createContractForm.controls[partyB].get('return_asset').valueChanges
        .subscribe((value: boolean) => {
            this.toggleReturnAsset(value);
        });
    }

    private addPartiesToForm(): void {
        this.parties.forEach((party: DvpParty) => {
            this.createContractForm.addControl(party.id, this.generatePartyFormGroup());
        });
    }

    private generatePartyFormGroup(): FormGroup {
        return new FormGroup({
            asset: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
            return_asset: new FormControl(false),
        });
    }

    isReturnAssetEnabled(party: DvpParty): boolean {
        return (party.toggleAssetReturn && this.createContractForm.value[party.id].return_asset) ||
            !party.toggleAssetReturn;
    }

    private toggleReturnAsset(value: boolean): void {
        if (value) {
            this.createContractForm
                .controls[partyB]
            .get('asset')
            .setValidators(Validators.required);
            this.createContractForm
                .controls[partyB]
            .get('amount')
            .setValidators(Validators.required);
        } else {
            this.createContractForm.controls[partyB].get('asset').clearValidators();
            this.createContractForm.controls[partyB].get('amount').clearValidators();
        }

        this.createContractForm.controls[partyB].get('asset').updateValueAndValidity();
        this.createContractForm.controls[partyB].get('amount').updateValueAndValidity();
    }

    /**
     * Create Contract
     */
    createContract(): void {
        if (this.createContractForm.invalid) {
            this.alertsService.generate(
                'error',
                this.translate.translate('Please complete all details on the form correctly.'),
            );
            return;
        }

        this.dvpService.create(
            this.parties,
            this.createContractForm.value,
            this.connectedWalletId,
            res => this.showResponseModal(res),
            (res) => {
                console.error('Fail', res);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to create contract.'),
                );
            },
        );
    }

    showResponseModal(createContractResponse) {
        const contractData = this.createContractForm.controls;

        this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Contract')}:</b></td>
                        <td>${createContractResponse.contractaddress}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Creator Address')}:</b></td>
                        <td>${contractData.creator.value[0].id}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Contract Expires')}:</b></td>
                        <td>${contractData.expireDate.value} ${contractData.expireTime.value}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Tx hash')}:</b></td>
                        <td>${createContractResponse.hash.substring(0, 10)}...</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
