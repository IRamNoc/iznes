/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { isEmpty } from 'lodash';
import { ReportingService } from '../../core-balances/reporting.service';

interface Asset {
    total: number;
    asset: string;
}

@Component({
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent {

    connectionCount: number;
    actionCount: number;
    unreadCount: number;
    username: string;
    lastLogin: string;
    connectedWalletId: number;
    holdingByAsset: any;
    transactions$: Observable<Array<any>>;
    myChainAccess: any;

    // List of observable subscription
    subscriptions: Array<Subscription> = [];

    // List of redux observable.
    @select(['message', 'myMessages', 'counts', 'action']) actionCount$: Observable<number>;
    @select(['message', 'myMessages', 'counts', 'inboxUnread']) unreadCount$: Observable<number>;
    @select(['connection', 'myConnection', 'fromConnectionList']) connections$: Observable<any>;
    @select(['user', 'myDetail', 'displayName']) username$: Observable<string>;
    @select(['user', 'myDetail', 'lastLogin']) lastLogin$: Observable<string>;

    public assetTiles: Array<Asset>;
    public holdingByAsset$: Observable<Array<any>>;

    public constructor(
        private reportingService: ReportingService
    ) { }

    ngOnInit() {
        this.subscriptions = [
            this.actionCount$.subscribe(count => this.actionCount = count),
            this.unreadCount$.subscribe(count => this.unreadCount = count),
            this.connections$.map(list => list.length).subscribe(count => this.connectionCount = count),
            this.username$.subscribe(username => this.username = username),
            this.lastLogin$.filter(lastLogin => !!lastLogin).subscribe(lastLogin => this.lastLogin = lastLogin)
        ];

        this.assetTiles = [
            { total: 0, asset: '' },
            { total: 0, asset: '' },
        ];

        this.transactions$ = this.reportingService.getTransactions().map(txs => txs.slice(0, 5));
        this.holdingByAsset$ = this.reportingService.getBalances()
           .do((assets) => {
                assets.slice(0, 2).map((asset, idx) => {
                    this.assetTiles[idx] = asset;
                });
           })
           .map(assets => assets.slice(0, 5));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
