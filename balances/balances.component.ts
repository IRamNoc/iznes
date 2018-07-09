<<<<<<< HEAD
import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HoldingByAsset } from '@setl/core-store/wallet/my-wallet-holding';
import { ReportingService } from '@setl/core-balances/reporting.service';
import { WalletTxHelperModel } from '@setl/utils';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TabControl, Tab } from '../tabs';
import { NgRedux, select } from '@angular-redux/store';
import * as json2csv from 'json2csv';
import * as SagaHelper from '@setl/utils/sagaHelper/index';
import { FileService } from '@setl/core-req-services';
import { isEqual } from 'lodash';
import { distinctUntilChanged, share, map } from 'rxjs/operators';

@Component({
    selector: 'setl-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.css'],
})
export class SetlBalancesComponent implements AfterViewInit, OnInit, OnDestroy {
    balances$: Observable<HoldingByAsset>;
    balances: HoldingByAsset;

    @ViewChild('myDataGrid') myDataGrid;
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;

    public tabControl: TabControl;
    public tabs: Tab[];
    readonly transactionFields = new WalletTxHelperModel.WalletTransactionFields().fields;
    private subscriptions: Subscription[] = [];
    public connectedWalletId;
    public exportModalDisplay: boolean = false;
    public exportFilename: string = 'BalancesExport.csv';
    public exportFileHash: string = '';

    /**
     * Constructor
     *
     * @param {ReportingService} reportingService
     * @param {ActivatedRoute} route
     * @param {ChangeDetectorRef} changeDetector
     * @param {NgRedux<any>} ngRedux
     * @param {FileService} fileService
     */
    public constructor(private reportingService: ReportingService,
                       private route: ActivatedRoute,
                       private changeDetector: ChangeDetectorRef,
                       private ngRedux: NgRedux<any>,
                       private fileService: FileService,
    ) {
    }

    /**
     * Ng On Init
     *
     * @returns {Promise<void>}
     */
    public ngOnInit() {
        let previous = [];
        this.balances$ = this.reportingService
            .getBalances()
            .pipe(
                distinctUntilChanged((oldAssets, newAssets) => isEqual(oldAssets, newAssets)),
                map(assets => {
                    let result = this.markUpdated([previous, assets]);
                    previous = assets;
                    return result;
                }),
                share()
            );

        this.balances$.subscribe((balances) => {
            this.balances = balances;
        });

        this.subscriptions.push(
            this.getConnectedWallet.subscribe((connectedWalletId) => {
                this.connectedWalletId = connectedWalletId;
                this.closeTabs();
                previous = [];
            },
        ));

        this.initTabUpdates();

        this.tabControl = new TabControl({
            title: 'Balances',
            icon: 'th-list',
            active: true,
            data: {
                asset: -1,
            },
        });
        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetector.markForCheck();
            }),
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

    /**
     * Ng After View Init
     *
     * @return {void}
     */
    public ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    /**
     * Init Tab Updates
     *
     * @return {void}
     */
    public initTabUpdates() {
        this.balances$.subscribe((balances) => {
            if (this.tabs && this.tabs.length) {
                this.tabs.filter(tab => tab.data.assetObject).forEach((tab) => {
                    const foundAsset = (balances as any[]).find(asset => asset.hash === tab.data.hash);

                    if (foundAsset !== undefined) {
                        tab.data.assetObject = foundAsset;
                    }
                });
            }

        });
    }

    /**
     * Find Asset
     *
     * @param {string} hash
     *
     * @returns {Promise<any>}
     */
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
            },
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
            },
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
                transaction,
                template: 'transaction',
            },
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
        return tab => tab.data.hash === hash && tab.data.template === template;
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
            const updatedAsset = {
                ...asset,
                isNew: false,
                totalChange: false,
                encumberChange: false,
                freeChange: false,
            };
            if (!prev.length) {
                return updatedAsset;
            }
            const oldAsset = prev.find(oldAsset => oldAsset.asset === asset.asset);

            if (!oldAsset) {
                updatedAsset.isNew = true;
            }
            if (oldAsset) {
                if (oldAsset.total !== asset.total) {
                    updatedAsset.totalChange = true;
                }
                if (oldAsset.encumbered !== asset.encumbered) {
                    updatedAsset.encumberChange = true;
                }
                if (oldAsset.free !== asset.free) {
                    updatedAsset.freeChange = true;
                }
            }

            return updatedAsset;
        });
    }

    /**
     * Close tabs.
     *
     * @return void
     */
    closeTabs() {
        if (this.tabControl) {
            let tabIndex = this.tabControl.tabs.length;

            while (tabIndex) {
                this.tabControl.close(tabIndex);
                this.changeDetector.markForCheck();
                tabIndex -= 1;
            }
        }
    }

    /**
     * Export List
     *
     * Exports current dataGrid List to CSV format
     *
     * @return {void}
     */
    public exportList() {
        const options = {};
        const csvData = this.myDataGrid.items['_filtered'];
        if (csvData.length === 0) {
            return;
        }
        const encodedCsv = Buffer.from(json2csv.parse(csvData, options)).toString('base64');
        const fileData = {
            name: this.exportFilename,
            data: encodedCsv,
            status: '',
            filePermission: 1,
        };
        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter([fileData], (file) => {
                return file.status !== 'uploaded-file';
            }),
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                if (data[1] && data[1].Data) {
                    let errorMessage;
                    _.each(data[1].Data, (file) => {
                        if (file.error) {
                            errorMessage = file.error;
                        } else {
                            this.exportFileHash = file[0].fileHash;
                            this.showExportModal();
                        }
                    });
                    if (errorMessage) {
                    }
                }
            },
            (data) => {
                let errorMessage;
                _.each(data[1].Data, (file) => {
                    if (file.error) {
                        errorMessage += file.error + '<br/>';
                    }
                });
                if (errorMessage) {
                    if (errorMessage) {
                    }
                }
            }),
        );
    }

    /**
     * Show Export Modal
     *
     * @return {void}
     */
    public showExportModal() {
        this.exportModalDisplay = true;
        this.changeDetector.markForCheck();
        this.changeDetector.detectChanges();
    }

    /**
     * Hide Export Modal
     *
     * @return {void}
     */
    public hideExportModal() {
        this.exportModalDisplay = false;
        this.changeDetector.markForCheck();
        this.changeDetector.detectChanges();
    }

    /**
     * Ng On Destroy
     *
     * @return {void}
     */
    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
