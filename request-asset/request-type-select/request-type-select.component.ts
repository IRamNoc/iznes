import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs';
import {
    WalletNodeRequestService,
    WalletnodeTxService,
    InitialisationService,
    MyWalletsService
} from '@setl/core-req-services';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {SagaHelper, walletHelper, immutableHelper} from '@setl/utils';

@Component({
    selector: 'app-request-type-select',
    templateUrl: './request-type-select.component.html',
    styleUrls: ['./request-type-select.component.css']
})
export class RequestTypeSelectComponent implements OnInit, OnDestroy {
    
    @Input() connectedWalletId: number;

    subscriptionsArray: Array<Subscription> = [];
    walletAddressList: Array<any>;

    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedWalletAddressListOb: Observable<any>;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedWalletAddressLabelsOb: Observable<any>;
    @select(['wallet', 'myWalletAddress', 'addressList']) walletAddressListOb: Observable<any>;

    constructor(private ngRedux: NgRedux<any>,
        private alertsService: AlertsService,
        private walletNodeRequestService: WalletNodeRequestService,
        private walletnodeTxService: WalletnodeTxService,
        private myWalletService: MyWalletsService) { }
        
    ngOnInit() {
        this.initWalletRelationshipSubscriptions();            
    }

    private initWalletRelationshipSubscriptions(): void {        
        this.subscriptionsArray.push(
            this.requestedWalletAddressListOb.subscribe((requested) => {
                if(!requested) InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
            }),
            this.requestedWalletAddressLabelsOb.subscribe((requested) => {
                if(!requested && this.connectedWalletId !== 0) {
                    MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
                }
            }),
            this.walletAddressListOb.subscribe((walletAddressList) => {
                this.walletAddressList = walletHelper.walletAddressListToSelectItem(walletAddressList, true);
            })
        );
    }

    ngOnDestroy() {
        for(const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}