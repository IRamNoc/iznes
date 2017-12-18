import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, transition} from '@angular/core';
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

    /**
     * Handle View
     *
     * @param {index} number - The index of a wallet to be editted.
     *
     * @return {void}
     */
    public handleView(index): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].hash === this.transactions[index].hash) {
                /* Found the index for that tab, lets activate it... */
                this.setTabActive(i);

                /* And return. */
                return;
            }
        }

        /* Push the edit tab into the array. */
        let transaction = this.transactions[index];

        /* And also prefill the form... let's sort some of the data out. */
        this.tabs.push({
            "title": "<i class='fa fa-th-list'></i> " + this.transactions[index].shortHash,
            "hash": this.transactions[index].hash,
            "transaction": transaction,
            "active": false
        });

        /* Activate the new tab. */
        this.setTabActive(this.tabs.length - 1);

        /* Return. */
        return;
    }

    /**
     * Set Tab Active
     * --------------
     * Sets all tabs to inactive other than the given index, this means the
     * view is switched to the wanted tab.
     *
     * @param {index} number - the tab inded to close.
     *
     * @return {void}
     */
    public setTabActive(index: number = 0) {
        this.tabs.map((i) => {
            i.active = false;
        });

        this.changeDetectorRef.detectChanges();

        this.tabs[index].active = true;

        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy() {
        
    }

}

