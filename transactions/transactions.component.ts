import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import { WalletTxHelperModel } from '@setl/utils';
import { ActivatedRoute } from '@angular/router';
import { ReportingService } from '../reporting.service';
import { Location } from '@angular/common';
import { Transaction } from '@setl/core-store/wallet/transactions/model';

import { TabControl, Tab } from '../tabs';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'setl-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class SetlTransactionsComponent implements OnInit, OnDestroy {

    subscriptions: Array<Subscription> = [];
    tabs: Tab[];
    tabControl: TabControl;
    transactions$: Observable<Transaction[]>;
    readonly transactionFields = new WalletTxHelperModel.WalletTransactionFields().fields;

    constructor(private reportingService: ReportingService,
                private changeDetector: ChangeDetectorRef,
                private location: Location,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.tabControl = new TabControl({
            title: 'Transactions',
            icon: 'th-list',
            active: true,
            data: {}
        });

        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetector.markForCheck();
            })
        );

        const hash = this.route.snapshot.paramMap.get('hash');
        if (hash) {
            this.handleViewTransaction(hash);
        }

        this.transactions$ = this.reportingService.getTransactions();
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

        this.reportingService.getTransaction(hash).first().subscribe((tx) => {
            this.tabControl.new({
                title: tx.shortHash,
                icon: 'th-list',
                active: false,
                data: {
                    hash: tx.hash,
                    transaction: tx,
                }
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

