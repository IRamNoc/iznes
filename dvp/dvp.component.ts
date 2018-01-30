import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';

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

@Component({
    selector: 'setl-contracts-dvp',
    templateUrl: 'dvp.component.html'
})
export class ContractsDvpComponent implements OnInit {

    createContractForm: FormGroup;
    parties: any[] = [];

    allInstrumentList: Array<any>;
    connectedWalletId: number;
    subscriptionsArray: Array<Subscription> = [];
    addressList: any;
    toRelationshipSelectItems: Array<any>;
    walletDirectoryList = {};

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
        private myWalletService: MyWalletsService) {

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
        this.createContractForm = new FormGroup({
            "creator": new FormControl('', Validators.required),
            "partyA": this.generatePartyFormGroup(),
            "partyB": this.generatePartyFormGroup()
        });
    }

    private generatePartyFormGroup(): FormGroup {
        return new FormGroup({
            "asset": new FormControl('', Validators.required),
            "address": new FormControl('', Validators.required),
            "amount": new FormControl('', Validators.required),
        });
    }

}