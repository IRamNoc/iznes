import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, transition} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Unsubscribe} from 'redux';
import * as _ from 'lodash';

import {SagaHelper, WalletTxHelper, WalletTxHelperModel} from '@setl/utils';
import {setConnectedChain} from '@setl/core-store';
import {WalletNodeRequestService} from '@setl/core-req-services';

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
    readonly transactionFields = new WalletTxHelperModel.WalletTransactionFields().fields;

    @ViewChild('pagination') pagination;
    private currentGridPage: number;

    @ViewChild('myDataGrid') transactionsGrid;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: Observable<number>;
    @select(['user', 'connected', 'connectedChain']) connectedChainOb: Observable<number>;
    @select(['chain', 'myChainAccess', 'myChainAccess']) myChainAccessOb: Observable<number>;

    constructor(private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
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
        }, 100, 0);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            req,
            {},
            (data) => {
                this.getTransactionsFromReportingNode(data);
            },
            (data) => {
                console.log('get transaction history error:', data);
            }
        ));
    }

    private getTransactionsFromReportingNode(data: any): void {
        const msgsig: string = (data[1]) ? data[1].data.msgsig : null;

        if(msgsig) {
            this.walletNodeRequestService.requestTransactionHistoryFromReportingNode(
                data[1].data.msgsig,
                this.connectedChainId,
                this.myChainAccess.nodeAddress
            ).subscribe((res) => {
                this.transactions = WalletTxHelper.WalletTxHelper.convertTransactions(res.json().data);
            }, (e) => {
                console.log("reporting node error", e);
            });
        } else {
            console.log("invalid signature request");
        }
    }

    /**
     * Handle View
     *
     * @param {index} number - The index of a wallet to be editted.
     * @return {void}
     */
    handleView(index): void {
        const transaction = this.transactions[index];
        
        let i;
        for (i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].hash === transaction.hash) {
                this.setTabActive(i);

                return;
            }
        }

        this.tabs.push({
            "title": "<i class='fa fa-th-list'></i> " + transaction.shortHash,
            "hash": transaction.hash,
            "transaction": transaction,
            "active": false
        });

        this.setTabActive(this.tabs.length - 1);

        return;
    }

    /**
     * Set Tab Active
     * --------------
     * Sets all tabs to inactive other than the given index, this means the
     * view is switched to the wanted tab.
     *
     * @param {index} number - the tab inded to close.
     * @return {void}
     */
    setTabActive(index: number = 0) {
        this.tabs.map((i) => {
            i.active = false;
        });

        this.changeDetectorRef.detectChanges();

        this.tabs[index].active = true;

        this.changeDetectorRef.detectChanges();
    }

    /**
     * Close Transaction
     * --------------
     * Closes the current transaction tab
     *
     * @param {index} number - the tab inded to close.
     * @return {void}
     */
    closeTransaction(index: number): void {
        this.tabs.map((i) => {
            i.active = false;
        });

        this.changeDetectorRef.detectChanges();
        
        this.tabs.splice(index,1);
        this.tabs[0].active = true;
    }

    ngOnDestroy() { }

}

