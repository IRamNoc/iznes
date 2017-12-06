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
    setRequestedWalletToRelationship
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Unsubscribe} from 'redux';
import _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs';

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

    // Wallet ID
    @select(['wallet', 'connected', 'connectedWallet']) walletIdOb: Observable<any>;

    // Asset
    @select(['asset', 'allInstruments', 'requested']) requestedAllInstrumentOb: Observable<boolean>;
    @select(['asset', 'allInstruments', 'instrumentList']) allInstrumentOb: Observable<any>;

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletService: MyWalletsService) {

        /* send asset form */
        this.requestAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required)
        });

        /* data subscriptions */
        this.initWalletIdSubscription();
        this.initAssetSubscriptions();
    }

    ngOnInit() { }

    private initWalletIdSubscription(): void {
        this.subscriptionsArray.push(
            this.walletIdOb.subscribe((walletId: number) => {
                this.connectedWalletId = 6;
            })
        );
    }

    private initAssetSubscriptions(): void {
        this.subscriptionsArray.push(
            this.requestedAllInstrumentOb.subscribe((requested) => {
                if(!requested) InitialisationService.requestAllInstruments(this.ngRedux, this.walletNodeRequestService);
            }),
            this.allInstrumentOb.subscribe((instrumentList) => {
                this.allInstrumentList = walletHelper.walletInstrumentListToSelectItem(instrumentList);
            })
        );
    }

    ngOnDestroy() {
        for(const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
