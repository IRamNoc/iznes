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
    setRequestedWalletToRelationship,
    SEND_ASSET_SUCCESS,
    SEND_ASSET_FAIL
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
    allInstrumentList: Array<any>;
    addressList: any;
    toRelationshipSelectItems: Array<any>;

    // Asset
    @select(['asset', 'allInstruments', 'requested']) requestedAllInstrumentOb;
    @select(['asset', 'allInstruments', 'instrumentList']) allInstrumentOb;
    
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
        this.subscriptionsArray.push(this.requestedAllInstrumentOb.subscribe(requested => this.requestAllInstrument(requested)));
        this.subscriptionsArray.push(this.allInstrumentOb.subscribe((instrumentList) => {
            this.allInstrumentList = this.convertInstrumentItemsForDropdown(instrumentList);
        }));

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));

        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => {
            this.addressList = this.convertAddressItemsForDropdown(addressList);
        }));
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe(requested => {
            this.requestAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));
    }

    ngOnInit() { }

    sendAsset(): void {
        if (this.sendAssetForm.valid) {
            const walletId = this.connectedWalletId;
            const toAddress = this.sendAssetForm.value.recipient;
            const fullAssetId = _.get(this.sendAssetForm.value.asset, '[0].id', '');
            const fullAssetIdSplit = walletHelper.splitFullAssetId(fullAssetId);
            const fromAddress = _.get(this.sendAssetForm.value.assetAddress, '[0].id', '');
            const namespace = fullAssetIdSplit.issuer;
            const instrument = fullAssetIdSplit.instrument;
            const amount = this.sendAssetForm.value.amount;

            // Create a saga pipe.
            const asyncTaskPipe = this.walletnodeTxService.sendAsset({
                walletId,
                toAddress,
                fromAddress,
                namespace,
                instrument,
                amount
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SEND_ASSET_SUCCESS],
                [SEND_ASSET_FAIL],
                asyncTaskPipe,
                {},
                function (data) {
                    console.log('send asset:', data);
                },
                function (data) {
                    console.log('fail', data);
                }
            ));
        }
    }

    updateState(): void {
        const newState = this.ngRedux.getState();
        
        // Set connected WalletId
        this.connectedWalletId = getConnectedWallet(newState);

        // const walletInstruments = getMyInstrumentsList(newState);        
        // this.walletInstrumentsSelectItems = walletHelper.walletInstrumentListToSelectItem(walletInstruments);

        const walletToRelationship = getWalletToRelationshipList(newState);
        const walletDirectoryList = getWalletDirectoryList(newState);

        this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(walletToRelationship, walletDirectoryList);
    }

    requestAllInstrument(requested: boolean): void {
        if (!requested) {
            // request all instruments
            InitialisationService.requestAllInstruments(this.ngRedux, this.walletNodeRequestService);
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

    convertInstrumentItemsForDropdown(items: any[]): any[] {
        const dropdownItems = [];

        _.forEach(items, item => {
            const id = `${item.issuer}|${item.instrument}`;

            dropdownItems.push({
                id,
                text: id
            });
        });
        
        return dropdownItems;
    }

    convertAddressItemsForDropdown(items: any[]): any[] {
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

    getError(): any {
        if(this.fieldHasError('asset')) {
            return {
                mltag: 'txt_assetisrequired',
                text: 'Asset is Required'
            }
        } else if(this.fieldHasError('assetAddress')) {
            return {
                mltag: 'txt_assetisrequired',
                text: 'Asset Address is Required'
            }
        } else if(this.fieldHasError('recipient')) {
            return {
                mltag: 'txt_recipientisrequired',
                text: 'Recipient is Required'
            }
        } else if(this.fieldHasError('amount')) {
            return {
                mltag: 'txt_amountisrequired',
                text: 'Amount is Required'
            }
        } else {
            return false;
        }
    }

    fieldHasError(field: string): boolean {
        return !this.sendAssetForm.controls[field].valid &&
            this.sendAssetForm.controls[field].touched;
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for(const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
