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
    getConnectedWallet
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Unsubscribe} from 'redux';
import _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-request-asset',
    templateUrl: './request-asset.component.html',
    styleUrls: ['./request-asset.component.css']
})
export class RequestAssetComponent implements OnInit, OnDestroy {
    
    requestAssetForm: FormGroup;

    subscriptionsArray: Array<Subscription> = [];

    connectedWalletId: number;

    // Asset
    

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private walletnodeTxService: WalletnodeTxService,
                private myWalletService: MyWalletsService) {

        /* send asset form */
        this.requestAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required)
        });
    }

    ngOnInit() { }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for(const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
