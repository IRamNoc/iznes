import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HoldingByAsset } from '@setl/core-store/wallet/my-wallet-holding';
import { ReportingService } from '@setl/core-balances/reporting.service';
import { WalletTxHelperModel } from '@setl/utils';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
import { TabControl, Tab } from '../tabs';

@Component({
    selector: 'setl-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.css']
})
export class SetlBalancesComponent implements AfterViewInit, OnInit, OnDestroy {

    balances$: Observable<HoldingByAsset>;

    @ViewChild('myDataGrid') myDataGrid;

    public tabControl: TabControl;
    public tabs: Tab[];
    readonly transactionFields = new WalletTxHelperModel.WalletTransactionFields().fields;
    private subscriptions: Array<Subscription> = [];

    constructor(private reportingService: ReportingService,
                private route: ActivatedRoute,
                private changeDetector: ChangeDetectorRef,
                private location: Location) { }

    ngOnInit() {
        let previous = null;
        this.balances$ = this.reportingService.getBalances().map(assets => {
            previous = assets;
            return this.markUpdated([previous, assets]);
        });

        this.tabControl = new TabControl({
            title: 'Balances',
            icon: 'th-list',
            active: true,
            data: {
                asset: -1,
            }
        });
        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetector.markForCheck();
            })
        );

        const hash = this.route.snapshot.paramMap.get('hash');
        if (hash) {
            switch (this.route.snapshot.paramMap.get('action')) {
                case 'history':
                    return this.findAsset(hash).then(asset => this.handleViewHistory(asset));
                case 'breakdown':
                    return this.findAsset(hash).then(asset => this.handleViewBreakdown(asset));
            }
        }
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    private findAsset(hash: string) {
        return new Promise((resolve) => {
            return this.reportingService.getBalances().first().subscribe((assets) => {
                resolve(assets.find(asset => asset.hash === hash));
            });
        });
    }

    /**
     * Open a breakdown tab for the given asset.
     *
     * @param asset
     *
     * @return void
     */
    public handleViewBreakdown(asset): void {
        if (this.tabControl.activate(this.findTab(asset.hash, 'breakdown'))) {
            return;
        }

        this.tabControl.new({
            title: asset.asset,
            icon: 'th-list',
            active: false,
            data: {
                assetObject: asset,
                hash: asset.hash,
                template: 'breakdown',
            }
        });
    }

    /**
     * Open a history tab for a given transaction.
     *
     * @param asset
     *
     * @return void
     */
    handleViewHistory(asset): void {
        if (this.tabControl.activate(this.findTab(asset.hash, 'history'))) {
            return;
        }

        this.tabControl.new({
            title: `${asset.asset} History`,
            icon: 'history',
            active: false,
            data: {
                transactions: this.reportingService.getTransactionsForAsset(asset.asset),
                hash: asset.hash,
                template: 'history',
            }
        });
    }

    /**
     * Open a transactions tab for a given transaction.
     *
     * @param transaction
     *
     * @return void
     */
    handleViewTransaction(transaction): void {
        if (this.tabControl.activate(this.findTab(transaction.hash, 'transaction'))) {
            return;
        }

        this.tabControl.new({
            title: transaction.shortHash,
            icon: 'th-list',
            active: false,
            data: {
                hash: transaction.hash,
                transaction: transaction,
                template: 'transaction',
            }
        });
    }

    /**
     * Return a function to handle filtering tabControl by hash and template
     *
     * @param {string} hash
     * @param {string} template
     *
     * @returns {(tab) => boolean}
     */
    private findTab(hash: string, template: string) {
        return (tab) => tab.data.hash === hash && tab.data.template === template;
    }

    /**
     * Check for new and updated assets.
     *
     * @param {any} prev
     * @param {any} next
     *
     * @return void
     */
    private markUpdated([prev, next]) {
        return next.map((asset) => {
            const updatedAsset = { ...asset, isNew: false, totalChange: false, encumberChange: false, freeChange: false };
            if (!prev.length) {
                return updatedAsset;
            }
            const oldAsset = prev.find(oldAsset => oldAsset.asset === asset.asset);
            if (!oldAsset) {
                updatedAsset.isNew = true;
            }
            if (oldAsset.total !== asset.total) {
                updatedAsset.totalChange = true;
            }
            if (oldAsset.encumbered !== asset.encumbered) {
                updatedAsset.encumberChange = true;
            }
            if (oldAsset.free !== asset.free) {
                updatedAsset.freeChange = true;
            }

            return updatedAsset;
        });
    }

    /**
     * Close tab. Update the location.
     *
     * @param id
     */
    closeTab(id: number) {
        this.location.go('/reports/balances');
        this.tabControl.close(id);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}

