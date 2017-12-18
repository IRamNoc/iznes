import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

import {SagaHelper, WalletTxHelper} from '@setl/utils';
import {setConnectedChain} from '@setl/core-store';
import {WalletNodeRequestService} from '@setl/core-req-services';
import {Unsubscribe} from 'redux';

@Component({
    selector: 'setl-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class SetlTransactionsComponent implements OnInit, OnDestroy {

    subscriptionsArray: Array<any> = [];
    onLoadSubscriptions: Observable<number>[] = [];

    connectedWalletId: number;
    connectedChainId: number;
    myChainAccess: any;

    tabs: any[];
    transactions: any[] = [];

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: Observable<number>;
    @select(['user', 'connected', 'connectedChain']) connectedChainOb: Observable<number>;
    @select(['chain', 'myChainAccess', 'myChainAccess']) myChainAccessOb: Observable<number>;

    constructor(private ngRedux: NgRedux<any>,
        private walletNodeRequestService: WalletNodeRequestService) {
        
        this.initTabs();

        this.onLoadSubscriptions.push(
            this.connectedWalletOb.first(),
            this.connectedChainOb.first(),
            this.myChainAccessOb.first()
        );

        Observable.forkJoin(this.onLoadSubscriptions).subscribe((results: number[]) => {
            this.connectedWalletId = results[0];
            this.connectedChainId = results[1];
            this.myChainAccess = results[2][this.connectedChainId];

            this.getTransactionsFromWalletNode();

            this.initSubscriptions();
        });        
    }

    ngOnInit() { }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(
            this.connectedWalletOb.subscribe((walletId) => {
                this.connectedWalletId = walletId;
            }),
            this.connectedChainOb.subscribe((connectedChainId) => {
                this.connectedChainId = connectedChainId;
            }),
            this.myChainAccessOb.subscribe((myChainAccess) => {
                this.myChainAccess = myChainAccess[this.connectedChainId];
            })
        );
    }

    private initTabs(): void {
        this.tabs = [{
            title: "<i class='fa fa-th-list'></i> Transactions",
            active: true
        }];
    }

    private getTransactionsFromWalletNode(): void {
        const req = this.walletNodeRequestService.requestTransactionHistory({
            walletIds: [this.connectedWalletId],
            chainId: this.connectedChainId
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            req,
            {},
            (data) => {
                console.log('get transaction history success:', data);

                this.walletNodeRequestService.requestTransactionHistoryFromReportingNode(
                    data[1].data.msgsig,
                    this.connectedChainId,
                    this.myChainAccess.nodeAddress
                ).subscribe((res) => {
                    this.transactions = WalletTxHelper.WalletTxHelper.convertTransactions(res.json().data);
                    console.log(this.transactions);
                }, (e) => {
                    console.log("reporting node error", e);
                });
            },
            (data) => {
                console.log('get transaction history error:', data);
            }
        ));
    }

    ngOnDestroy() {
        
    }

}

