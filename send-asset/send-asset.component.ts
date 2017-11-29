import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {walletHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {
    getMyInstrumentsList,
    getWalletToRelationshipList,
    getWalletDirectoryList,
    getWalletAddressList
} from '@setl/core-store';
import {Unsubscribe} from 'redux';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-send-asset',
    templateUrl: './send-asset.component.html',
    styleUrls: ['./send-asset.component.css']
})
export class SendAssetComponent implements OnInit, OnDestroy {
    // Observable subscription array.
    subscriptionsArry: Array<Subscription> = [];

    sendAssetForm: FormGroup;

    walletInstrumentsSelectItems: Array<any>;
    toRelationshipSelectItems: Array<any>;

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>) {
        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Issuer Asset form
         */
        this.sendAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {
        //
    }

    updateState() {
        const newState = this.ngRedux.getState();

        // Get wallet addresses and update wallet address items list
        const currentWalletAddressList = getWalletAddressList(newState);
        this.walletAddressSelectItems = walletHelper.walletAddressListToSelectItem(currentWalletAddressList);

        const walletInstruments = getMyInstrumentsList(newState);
        this.walletInstrumentsSelectItems = walletHelper.walletInstrumentListToSelectItem(walletInstruments);

        const walletToRelationship = getWalletToRelationshipList(newState);
        const walletDirectoryList = getWalletDirectoryList(newState);
        this.toRelationshipSelectItems = walletHelper.walletToRelationshipToSelectItem(walletToRelationship, walletDirectoryList);
    }

    sendAsset() {
        console.log('Send Asset');
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for (const subscription of this.subscriptionsArry) {
            subscription.unsubscribe();
        }
    }

}

