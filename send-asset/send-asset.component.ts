import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {SagaHelper, walletHelper, immutableHelper} from '@setl/utils';
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
    
    sendAssetForm: FormGroup;

    subscriptionsArray: Array<Subscription> = [];

    connectedWalletId: number;
    walletInstrumentsSelectItems: Array<any>;
    addressList: any;
    toRelationshipSelectItems: Array<any>;

    // Asset
    @select(['asset', 'myInstruments', 'requestedWalletInstrument']) requestedInstrumentState;
    
    // Asset Address
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletService: MyWalletsService) {

        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();
        
        /* send asset form */
        this.sendAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            assetAddress: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required)
        });

        /* data subscriptions */
        this.subscriptionsArray.push(this.requestedInstrumentState.subscribe(requested => this.requestWalletInstrumentLabel(requested)));

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));

        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => {
            this.addressList = this.convertItemsForDropdown(addressList);
        }));
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe(requested => {
            this.requestAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));
    }

    ngOnInit() { }

    updateState(): void {
        const newState = this.ngRedux.getState();
        
        // Set connected WalletId
        this.connectedWalletId = getConnectedWallet(newState);

        const walletInstruments = getMyInstrumentsList(newState);        
        this.walletInstrumentsSelectItems = walletHelper.walletInstrumentListToSelectItem(walletInstruments);

        const walletToRelationship = getWalletToRelationshipList(newState);
        const walletDirectoryList = getWalletDirectoryList(newState);

        this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(walletToRelationship, walletDirectoryList);
    }

    requestWalletInstrumentLabel(requested: boolean): void {
        if (!requested) {
            const walletId = this.connectedWalletId;

            // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
            this.ngRedux.dispatch(setRequestedWalletInstrument());

            InitialisationService.requestWalletInstruments(this.ngRedux, this.walletNodeRequestService, walletId);
        }
    }

    requestAddressList(requested: boolean): void {
        // If the state is false, that means we need to request the list.
        if (!requested && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requested: boolean): void {
        // If the state is false, that means we need to request the list.
        if (!requested && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    convertItemsForDropdown(items: any[]): any[] {
        const dropdownItems = [];

        _.forEach(items, item => {
            console.log(item);

            dropdownItems.push({
                id: item.addr,
                text: (item.label) ? item.label : item.addr
            });
        });
        
        return dropdownItems;
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();
        
        for(const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
