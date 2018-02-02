import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import * as moment from 'moment';

import {walletHelper, mDateHelper} from '@setl/utils';
import {
    setRequestedWalletAddresses,
    setRequestedWalletToRelationship
} from '@setl/core-store';
import {
    WalletNodeRequestService,
    InitialisationService,
    MyWalletsService
} from '@setl/core-req-services';

import {DvpParty, DvpForm, DvpFormParty, partyA, partyB} from './dvp.model';
import {DVPContractService} from './dvp.service';
import {ContractService} from '@setl/core-contracts/services';

@Component({
    selector: 'setl-contracts-dvp',
    templateUrl: 'dvp.component.html',
    styleUrls: ['dvp.component.css']
})
export class ContractsDvpComponent implements OnInit {

    createContractForm: FormGroup;
    parties: [DvpParty, DvpParty];

    allInstrumentList: any[];
    connectedWalletId: number;
    subscriptionsArray: Subscription[] = [];
    addressList: any[];
    toRelationshipSelectItems: any[];
    walletDirectoryList: {} = {};

    @select(['asset', 'allInstruments', 'requested']) requestedAllInstrumentOb;
    @select(['asset', 'allInstruments', 'instrumentList']) allInstrumentOb;

    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;

    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedToRelationshipState;
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) toRelationshipListOb;

    @select(['wallet', 'walletDirectory', 'walletList']) directoryListOb;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    constructor(private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private walletNodeRequestService: WalletNodeRequestService,
        private myWalletService: MyWalletsService,
        private alertsService: AlertsService,
        private dvpService: DVPContractService,
        private contractService: ContractService) {

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
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));

        this.subscriptionsArray.push(this.requestedAllInstrumentOb.subscribe(requested => this.requestAllInstrument(requested)));
        this.subscriptionsArray.push(this.allInstrumentOb.subscribe((instrumentList) => {
            this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(instrumentList);
            this.changeDetectorRef.markForCheck();
        }));

        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => {
            this.addressList = walletHelper.walletAddressListToSelectItem(addressList, 'label');
            this.changeDetectorRef.markForCheck();
        }));

        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe(requested => {
            this.requestAddressList(requested);
            this.changeDetectorRef.markForCheck();
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));
        
        this.subscriptionsArray.push(this.requestedToRelationshipState.subscribe((requested) => this.requestWalletToRelationship(requested)));
        this.subscriptionsArray.push(this.toRelationshipListOb.subscribe((toRelationshipList) => {
            this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(toRelationshipList, this.walletDirectoryList);
            this.changeDetectorRef.markForCheck();
        }));

        this.subscriptionsArray.push(this.directoryListOb.subscribe((directoryList) => {
            this.walletDirectoryList = directoryList;
            this.changeDetectorRef.markForCheck();
        }));
    }

    private requestAllInstrument(requested: boolean): void {
        if (!requested) {
            InitialisationService.requestAllInstruments(this.ngRedux, this.walletNodeRequestService);
        }
    }

    private requestAddressList(requested: boolean): void {
        if (!requested && this.connectedWalletId !== 0) {
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    private requestWalletLabel(requested: boolean): void {
        if (!requested && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    private requestWalletToRelationship(requestedInstrumentState) {
        if(!requestedInstrumentState) {
            this.ngRedux.dispatch(setRequestedWalletToRelationship());

            InitialisationService.requestToRelationship(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }
    

    /**
     * UI
     */
    private initParties(): void {
        this.parties = [{
            id: partyA,
            title: "Party A"
        }, {
            id: partyB,
            title: "Party B",
            toggleAssetReturn: true
        }];
    }

    private initCreateContractForm(): void {
        const currentDate = moment(mDateHelper.getCurrentUnixTimestamp());

        this.createContractForm = new FormGroup({
            "creator": new FormControl('', Validators.required),
            "expireDate": new FormControl(currentDate.add(1 ,'days').format('YYYY-MM-DD'), Validators.required),
            "expireTime": new FormControl(currentDate.format('HH:mm'), Validators.required)
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
            "asset": new FormControl('', Validators.required),
            "address": new FormControl('', Validators.required),
            "amount": new FormControl('', Validators.required),
            "return_asset": new FormControl(false, Validators.required)
        });
    }

    isReturnAssetEnabled(party: DvpParty): boolean {
        return (party.toggleAssetReturn && this.createContractForm.value[party.id].return_asset) ||
            !party.toggleAssetReturn;
    }

    private toggleReturnAsset(value: boolean): void {
        if(value) {
            this.createContractForm.controls[partyB].get('asset').setValidators(Validators.required);
            this.createContractForm.controls[partyB].get('amount').setValidators(Validators.required);
        } else {
            this.createContractForm.controls[partyB].get('asset').clearValidators();
            this.createContractForm.controls[partyB].get('amount').clearValidators();
        }

        this.createContractForm.controls[partyB].get('asset').updateValueAndValidity();
        this.createContractForm.controls[partyB].get('amount').updateValueAndValidity();
    }

    private isFormValid(): boolean {
        return this.createContractForm.valid;
    }

    getError(): any {
        if(this.fieldHasError('creator')) {
            return {
                mltag: 'txt_contracterror_creator',
                text: 'Creator Address is Required'
            }
        } else if(this.fieldHasError('expireDate')) {
            return {
                mltag: 'txt_contracterror_expiredate',
                text: 'Expire Date is Required'
            }
        } else if(this.fieldHasError('expireTime')) {
            return {
                mltag: 'txt_contracterror_expiretime',
                text: 'Expire Time is Required'
            }
        } else if(this.fieldHasError(partyA)) {
            return {
                mltag: 'txt_contracterror_partya',
                text: 'Party A is invalid'
            }
        } else if(this.fieldHasError(partyB)) {
            return {
                mltag: 'txt_contracterror_partyb',
                text: 'Party B is invalid'
            }
        } else {
            return false;
        }
    }

    fieldHasError(field: string): boolean {
        return !this.createContractForm.controls[field].valid &&
            this.createContractForm.controls[field].touched;
    }


    /**
     * Create Contract
     */
    createContract(): void {
        if(!this.isFormValid()) return;

        this.dvpService.create(
            this.parties,
            this.createContractForm.value,
            this.connectedWalletId,
            (res) => this.showResponseModal(res),
            (res) => this.showErrorModal(res)
        );
    }

    showResponseModal(createContractResponse) {
        const expiryDate = moment.unix(createContractResponse.contractdata.expiry).format('DD/MM/YY HH:mm:ss');

        this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>Creator Address:</b></td>
                        <td>${createContractResponse.contractdata.issuingaddress}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Contract Expires:</b></td>
                        <td>${expiryDate}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Tx hash:</b></td>
                        <td>${createContractResponse.hash.substring(0, 10)}...</td>
                    </tr>
                </tbody>
            </table>
        `);

        // this.ngRedux.dispatch(finishCreateContractNotification());   
    }

    showErrorModal(data): void {
        this.alertsService.create('error',
            `${data[1].status}`);
    }

    ngOnDestroy() {
        for(const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}