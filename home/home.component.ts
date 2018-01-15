/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { setRequestedWalletHolding } from '@setl/core-store';
import {InitialisationService, WalletNodeRequestService} from '@setl/core-req-services';
import { HoldingByAsset } from '../../core-store/wallet/my-wallet-holding';
import { isEmpty } from 'lodash';

interface Asset {
    total: number;
    identifier: string;
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

    // List of observable subscription
    subscriptions: Array<Subscription> = [];

    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$: Observable<number>;
    @select(['message', 'myMessages', 'counts', 'action']) actionCount$: Observable<number>;
    @select(['message', 'myMessages', 'counts', 'inboxUnread']) unreadCount$: Observable<number>;
    @select(['connection', 'myConnection', 'fromConnectionList']) connections$: Observable<any>;
    @select(['user', 'myDetail', 'displayName']) username$: Observable<string>;
    @select(['user', 'myDetail', 'lastLogin']) lastLogin$: Observable<string>;
    @select(['wallet', 'myWalletHolding', 'requested']) walletHoldingReq$: Observable<boolean>;
    @select(['wallet', 'myWalletHolding']) holdings$: Observable<any>;

    public assetTiles: Array<Asset>;

    public constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ngRedux: NgRedux<any>,
        private _walletNodeRequestService: WalletNodeRequestService
    ) { }

    ngOnInit() {
        this.holdingByAsset = [];
        this.walletHoldingReq$.subscribe(requested => this.requestWalletHolding(requested));
        this.subscriptions.push(this.actionCount$.subscribe(count => this.actionCount = count));
        this.subscriptions.push(this.unreadCount$.subscribe(count => this.unreadCount = count));
        this.subscriptions.push(this.connections$.map(list => list.length).subscribe(count => this.connectionCount = count));
        this.subscriptions.push(this.username$.subscribe(username => this.username = username));
        this.subscriptions.push(this.lastLogin$.filter(lastLogin => !!lastLogin).subscribe(lastLogin => this.lastLogin = lastLogin));
        this.assetTiles = [
            {total: 0, identifier: ''},
            {total: 0, identifier: ''},
        ];

        const onLoadSubscriptions = [
            this.connectedWallet$.filter(id => id > 0).first(),
            this.holdings$.filter(holdings => !isEmpty(holdings.holdingByAsset)).map(holding => holding.holdingByAsset).first()
        ];

        Observable.forkJoin(onLoadSubscriptions).subscribe(([connectedWalletId, holdingByAsset]) => {
            this.connectedWalletId = connectedWalletId;
            holdingByAsset = Object.getOwnPropertyNames(holdingByAsset[connectedWalletId]).map((key) => {
                return Object.assign({}, holdingByAsset[connectedWalletId][key], {identifier: key});
            });
            for (let i = 0; i < holdingByAsset.length && i < 2; i++) {
                this.assetTiles[i] = Object.assign({}, holdingByAsset[i]);
            }
            this._changeDetectorRef.markForCheck();
        });

        this.subscriptions.push(
            this.connectedWallet$
                .distinctUntilChanged()
                .subscribe((connected) => {
                    this.connectedWalletId = connected;
                })
        );
    }

    requestWalletHolding(requestedState: boolean) {
        if (requestedState || this.connectedWalletId === 0) {
            return;
        }

        this._ngRedux.dispatch(setRequestedWalletHolding());
        InitialisationService.requestWalletHolding(this._ngRedux, this._walletNodeRequestService, this.connectedWalletId);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
