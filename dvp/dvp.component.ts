import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';

import {walletHelper} from '@setl/utils';
import {
    setRequestedWalletAddresses,
    setRequestedWalletToRelationship
} from '@setl/core-store';
import {
    WalletNodeRequestService,
    InitialisationService,
    MyWalletsService
} from '@setl/core-req-services';

import {ContractModel, PartyModel, PayListItemModel, ReceiveListItemModel} from '../models';
import {PartyService, PayListItemService} from '../services';

@Component({
    selector: 'setl-contracts-dvp',
    templateUrl: 'dvp.component.html',
    styleUrls: ['dvp.component.css']
})
export class ContractsDvpComponent implements OnInit {

    createContractForm: FormGroup;
    parties: any[] = [];

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
        private partyService: PartyService,
        private payListItemService: PayListItemService) {

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
        this.parties.push({
            id: "partyA",
            title: "Party A"
        });
        
        this.parties.push({
            id: "partyB",
            title: "Party B"
        });
    }

    private initCreateContractForm(): void {
        const currentDate = moment();

        this.createContractForm = new FormGroup({
            "creator": new FormControl('', Validators.required),
            "expireDate": new FormControl(currentDate.format('YYYY-MM-DD'), Validators.required),
            "expireTime": new FormControl(currentDate.format('HH:mm'), Validators.required)
        });

        this.addPartiesToForm();
    }

    private addPartiesToForm(): void {
        this.parties.forEach((party: any) => {
            this.createContractForm.addControl(party.id, this.generatePartyFormGroup());
        });
    }

    private generatePartyFormGroup(): FormGroup {
        return new FormGroup({
            "asset": new FormControl('', Validators.required),
            "address": new FormControl('', Validators.required),
            "amount": new FormControl('', Validators.required),
        });
    }


    /**
     * Create Contract
     */
    createContract(): void {
        console.log(this.createContractForm.value);

        const values = this.createContractForm.value;
        const model: ContractModel = new ContractModel();

        model.issuingaddress = values.creator;

        // model.parties[0].payList[0].
    }

    private addPartiesToContract(model: ContractModel): void {
        /**
         * NOTE: At this point the component becomes tightly coupled to a 2 party contract.
         *      this is because we need to set party A in the paylist and party B in the
         *      receive list.
         */
        if(!model.parties) model.parties = [];

        const partyModel = new PartyModel();

        // configure Party A as the payee
        const partyAId = this.parties[0].id;
        partyModel.partyIdentifier = partyAId;
        partyModel.signature = this.createContractForm.value[partyAId].address;
        partyModel.mustSign = false;

        // configure paylist
        const payListItem = new PayListItemModel();
        const splitAsset = this.createContractForm.value[partyAId].asset.split('|');
        payListItem.address = this.createContractForm.value[partyAId].address;
        payListItem.namespace = splitAsset[0];
        payListItem.assetId = splitAsset[1];
        payListItem.quantity = this.createContractForm.value[partyAId].amount;
        payListItem.issuance = true;

        partyModel.payList.push(payListItem);

        // add party
        model.parties.push(partyModel);
    }

}