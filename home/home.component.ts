import { tap, map, filter } from 'rxjs/operators';
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { get } from 'lodash';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ConnectionService } from '@setl/core-req-services';
import { setRequestedFromConnections } from '@setl/core-store';
import { ReportingService } from '@setl/core-balances';
import { MultilingualService } from '@setl/multilingual';
import { Transaction } from '@setl/core-store/wallet/transactions/model';

interface Asset {
    total: number;
    asset: string;
}

@Component({
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    connectedWalletId: number;
    connectionCount: number;
    actionCount: number;
    unreadCount: number;
    contractsCount: number;
    username: string;
    lastLogin: string;
    holdingByAsset: any;
    transactions: Transaction[] = [];

    // Rows Per Page datagrid size
    pageSize: any;

    // List of observable subscription
    subscriptions: Subscription[] = [];

    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$: Observable<number>;
    @select(['message', 'myMessages', 'counts', 'action']) actionCount$: Observable<number>;
    @select(['message', 'myMessages', 'counts', 'inboxUnread']) unreadCount$: Observable<number>;
    @select(['connection', 'myConnections', 'requestedFromConnectionList']) reqFromConnections$: Observable<boolean>;
    @select(['connection', 'myConnections', 'fromConnectionList']) connections$: Observable<any>;
    @select(['user', 'myDetail', 'displayName']) username$: Observable<string>;
    @select(['user', 'myDetail', 'lastLogin']) lastLogin$: Observable<string>;
    @select(['wallet', 'myWalletContract', 'contractList']) contracts$: Observable<any>;

    public assetTiles: Asset[];
    public holdingByAsset$: Observable<any[]>;

    public constructor(
        private ngRedux: NgRedux<any>,
        private reportingService: ReportingService,
        private connectionService: ConnectionService,
        public translate: MultilingualService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.assetTiles = [
            { total: 0, asset: '' },
            { total: 0, asset: '' },
        ];
    }

    ngOnInit() {
        this.subscriptions.push(this.connectedWallet$.subscribe((connectedWalletId) => {
            this.connectedWalletId = connectedWalletId;
            this.subscriptions.push(this.reqFromConnections$.subscribe((requested) => {
                this.requestFromConnectionList(requested);
            }));
        }));
        this.subscriptions.push(this.connections$.pipe(map(list => list.length)).subscribe((count) => {
            this.connectionCount = count;
            this.changeDetectorRef.detectChanges();
        }));
        this.subscriptions.push(this.actionCount$.subscribe(count => this.actionCount = count));
        this.subscriptions.push(this.unreadCount$.subscribe(count => this.unreadCount = count));
        this.subscriptions.push(this.contracts$.subscribe(contracts => this.contractsCount = contracts.length));
        this.subscriptions.push(this.username$.subscribe(username => this.username = username));
        this.subscriptions.push(this.lastLogin$.pipe(filter(lastLogin => !!lastLogin)).subscribe((lastLogin) => {
            this.lastLogin = lastLogin;
        }));

        this.reportingService.getTransactions().subscribe((transactions) => {
            const page = get(transactions, ['pages', 0], null);
            if (!page) {
                return;
            }
            this.transactions = page.transactions;
        });

        this.holdingByAsset$ = this.reportingService.getBalances();

        this.subscriptions.push(this.reportingService.getBalances().subscribe((assets) => {
            assets.slice(0, 2).map((asset, idx) => {
                this.assetTiles[idx] = asset;
            });

            if (this.assetTiles[0].asset) {
                this.changeDetectorRef.detectChanges();
            }
        }));
    }

    requestFromConnectionList(requestedState: boolean) {
        if (!requestedState && this.connectedWalletId) {
            this.ngRedux.dispatch(setRequestedFromConnections());

            ConnectionService.requestFromConnectionList(
                this.connectionService, this.ngRedux, this.connectedWalletId.toString());
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }

        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Destroy reporting service subscriptions */
        this.reportingService.onDestroy();
    }
}
