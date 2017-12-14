import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';

import {setConnectedChain} from '@setl/core-store';
import {WalletNodeRequestService} from '@setl/core-req-services';
import {Unsubscribe} from 'redux';

@Component({
    selector: 'setl-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class SetlTransactionsComponent implements OnInit, OnDestroy {

    constructor(private ngRedux: NgRedux<any>,
        private walletNodeRequestService: WalletNodeRequestService) {

    }

    ngOnInit() {

    }

    ngOnDestroy() {
        
    }

}

