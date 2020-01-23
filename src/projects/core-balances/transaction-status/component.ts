import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ReportingService } from '../reporting.service';
import { select } from '@angular-redux/store';

import { TabControl, Tab } from '../tabs';
import { MultilingualService } from '@setl/multilingual';

import { statusFieldsModel, statusListActions } from './model';

@Component({
    selector: 'transaction-status-report',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
})
export class TransactionsStatusComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    tabs: Tab[];
    tabControl: TabControl;
    transactions: {}[] = [];
    public pageSize: number;
    public currentPage: number;
    public statusFieldsModel = statusFieldsModel;
    public statusListActions = statusListActions;
    public showModal: boolean = false;
    public modalJson: {};

    @select(['walletNode', 'transactionStatus']) transactionsOb;

    constructor(public reportingService: ReportingService,
                private changeDetector: ChangeDetectorRef,
                public translate: MultilingualService,
    ) {}

    ngOnInit() {
        this.tabControl = new TabControl({
            title: this.translate.translate('Transaction Status'),
            icon: 'lightbulb-o',
            active: true,
            data: {},
        });

        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetector.markForCheck();
            }),
        );

        this.subscriptions.push(this.transactionsOb.subscribe((transactions) => {
            this.transactions = [];
            if (transactions) {
                Object.keys(transactions).forEach((transaction) => {
                    this.transactions.push({
                        hash: transaction,
                        status: transactions[transaction].success ? 'Success'
                            : (transactions[transaction].fail ? 'Fail' : 'Pending'),
                        date: transactions[transaction].dateRequested,
                        request: transactions[transaction].request,
                    });
                });
            }
        }));
    }

    onAction(action) {
        if (action.type === 'viewTx') this.handleShowModal(action.data.request);
    }

    handleShowModal(json) {
        this.modalJson = json;
        this.showModal = true;
    }

    formatText(text) {
        const string = String(text);
        if (string.length > 18) {
            return `${string.substring(0, 15)}...`;
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    validItem(item) {
        return item !== '' && typeof item !== 'object';
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
