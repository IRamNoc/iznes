import { first } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { WalletTxHelperModel } from '@setl/utils';
import { ActivatedRoute } from '@angular/router';
import { ReportingService } from '../reporting.service';
import { Location } from '@angular/common';
import { get } from 'lodash';
import { NgRedux, select } from '@angular-redux/store';
import { Transaction } from '@setl/core-store/wallet/transactions/model';
import {
    decrementAllCurrentPage,
    incrementAllRequestedPage,
    decrementAllRequestedPage,
    incrementAllCurrentPage,
    resetAllTransactions,
    setAllLoading,
} from '@setl/core-store/wallet/transactions/actions';

import { TabControl, Tab } from '../tabs';

@Component({
    selector: 'setl-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class SetlTransactionsComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];
    tabs: Tab[];
    tabControl: TabControl;
    transactions: Transaction[] = [];
    readonly transactionFields = new WalletTxHelperModel.WalletTransactionFields().fields;
    /* Rows Per Page datagrid size */
    public pageSize: number;
    public previousDisabled  = true;
    public nextDisabled = true;
    public dataLoading = true;
    public currentPage: number;

    @select(['wallet', 'transactions', 'all', 'loading']) readonly loading$: Observable<boolean>;
    @select(['wallet', 'transactions', 'all', 'currentPage']) readonly currentPage$: Observable<number>;

    constructor(public reportingService: ReportingService,
                private changeDetector: ChangeDetectorRef,
                private location: Location,
                private redux: NgRedux<any>,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.tabControl = new TabControl({
            title: 'Transactions',
            icon: 'key',
            active: true,
            data: {},
        });

        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetector.markForCheck();
            }),
        );
        this.loading$.subscribe(loading => this.dataLoading = loading);
        this.currentPage$.subscribe((page) => {
            this.currentPage = page;
        });

        const hash = this.route.snapshot.paramMap.get('hash');
        if (hash) {
            this.handleViewTransaction(hash);
        }

        this.reportingService.getTransactions().subscribe((transactions) => {
            const page = get(transactions, ['pages', transactions.currentPage], null);
            if (!page) {
                return;
            }
            this.transactions = page.transactions;
            this.previousDisabled = transactions.currentPage === 0;
            this.nextDisabled = (
                transactions.pages.length <= transactions.currentPage - 1
                || transactions.pages[transactions.currentPage].next === null
            );
        });
    }

    /**
     * Handle View
     *
     * @param hash string Transaction hash
     *
     * @return {void}
     */
    handleViewTransaction(hash: string): void {
        if (this.tabControl.activate(tab => tab.data.hash === hash)) {
            return;
        }

        this.reportingService.getTransaction(hash).pipe(first()).subscribe((tx) => {
            this.tabControl.new({
                title: tx.shortHash,
                icon: 'th-list',
                active: false,
                data: {
                    hash: tx.hash,
                    transaction: tx,
                },
            });
        });
    }

    closeTab(id) {
        this.location.go('/reports/transactions');
        this.tabControl.close(id);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
