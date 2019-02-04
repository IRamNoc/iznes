import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HoldingByAsset } from '@setl/core-store/wallet/my-wallet-holding';
import { ReportingService } from '@setl/core-balances/reporting.service';
import { WalletTxHelperModel } from '@setl/utils';
import { ActivatedRoute } from '@angular/router';
import { TabControl, Tab } from '../tabs';
import { NgRedux, select } from '@angular-redux/store';
import * as json2csv from 'json2csv';
import * as SagaHelper from '@setl/utils/sagaHelper/index';
import { FileService, PdfService } from '@setl/core-req-services';
import { filter, get } from 'lodash';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { MultilingualService } from '@setl/multilingual';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import * as moment from 'moment';

@Component({
    selector: 'setl-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.scss'],
})
export class SetlBalancesComponent implements AfterViewInit, OnInit, OnDestroy {
    balances$: Observable<HoldingByAsset>;
    balances: HoldingByAsset;

    @ViewChild('myDataGrid') myDataGrid;
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['wallet', 'myWallets', 'walletList']) walletListOb;

    public tabControl: TabControl;
    public tabs: Tab[];
    readonly transactionFields = new WalletTxHelperModel.WalletTransactionFields().fields;
    private subscriptions: Subscription[] = [];
    public connectedWalletId;
    private walletName: string;
    public exportModalDisplay: string = '';
    public exportFileHash: string = '';
    private viewingAsset: string;
    /* Datagrid properties */
    public pageSize: number;
    public pageCurrent: number;
    private editTab: boolean = false;

    /**
     * Constructor
     *
     * @param {ReportingService} reportingService
     * @param {ActivatedRoute} route
     * @param {ChangeDetectorRef} changeDetector
     * @param {NgRedux<any>} ngRedux
     * @param {FileService} fileService
     */
    public constructor(public reportingService: ReportingService,
                       private route: ActivatedRoute,
                       private changeDetector: ChangeDetectorRef,
                       private ngRedux: NgRedux<any>,
                       private fileService: FileService,
                       public translate: MultilingualService,
                       private alertsService: AlertsService,
                       private pdfService: PdfService) {}

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
            map((assets) => {
                const updated = this.markUpdated([previous, assets]);
                previous = assets;
                return updated;
            }),
        );

        this.balances$.subscribe((balances) => {
            this.balances = balances;
        });

        this.subscriptions.push(
            combineLatest(this.getConnectedWallet, this.walletListOb).subscribe(([connectedWalletId, walletList]) => {
                this.connectedWalletId = connectedWalletId;
                this.closeTabs();
                previous = [];

                this.walletName = (walletList[connectedWalletId] || {}).walletName;
            },
        ));

        this.initTabUpdates();

        this.tabControl = new TabControl({
            title: this.translate.translate('Balances'),
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
            return this.reportingService.getBalances().pipe(first()).subscribe((assets) => {
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
        this.viewingAsset = asset.asset;
        this.editTab = true;
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
            title: `${asset.asset} ${this.translate.translate('History')}`,
            icon: 'history',
            active: false,
            data: {
                transactions: this.reportingService.getTransactionsForAsset(asset.asset),
                hash: asset.hash,
                template: 'history',
                assetObject: asset,
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

    handleClose(id, asset) {
        this.tabControl.close(id);
        this.reportingService.historyResetByAsset(asset.asset);
        this.viewingAsset = '';
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
            } else {
                if (oldAsset.total !== asset.total) {
                    updatedAsset.totalChange = true;
                }
                if (oldAsset.totalencumbered !== asset.totalencumbered) {
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
    public exportCSV() {
        this.alertsService.create('loading');

        const csvData = this.formatExportCSVData();
        if (csvData.length === 0) {
            this.alertsService.generate('error', this.translate.translate('There are no records to export'));
            return;
        }

        const encodedCsv = Buffer.from(json2csv.parse(csvData, {})).toString('base64');

        const fileData = {
            name: 'Balance-Export.csv',
            data: encodedCsv,
            status: '',
            filePermission: 1,
        };

        const asyncTaskPipe = this.fileService.addFile({
            files: filter([fileData], (file) => {
                return file.status !== 'uploaded-file';
            }),
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (successResponse) => {
                const data = get(successResponse, '[1].Data[0][0]', {});
                if (data.fileHash) {
                    this.exportFileHash = data.fileHash;
                    this.showExportModal('CSV');
                    this.alertsService.create('clear');
                    return;
                }
                this.alertsService.generate(
                    'error', this.translate.translate('Something has gone wrong. Please try again later'));
            },
            (failResponse) => {
                const data = get(failResponse, '[1].Data[0]', {});
                const errorText = data.error ? data.error : 'Something has gone wrong. Please try again later';
                this.alertsService.generate('error', this.translate.translate(errorText));
            }),
        );
    }

    /**
     * Export PDF
     *
     * Exports current dataGrid List to PDF format
     *
     * @returns {void}
     */
    public exportPDF() {
        this.alertsService.create('loading');

        const metadata = this.formatExportPDFData();
        const asyncTaskPipe = this.pdfService.createPdfMetadata({ type: null, metadata });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (successResponse) => {
                const pdfID = get(successResponse, '[1].Data[0].pdfID', 0);

                if (!pdfID) {
                    return this.alertsService.generate(
                        'error', this.translate.translate('Something has gone wrong. Please try again later'));
                }

                const pdfOptions = {
                    orientation: 'portrait',
                    border: { top: '15mm', right: '15mm', bottom: '0', left: '15mm' },
                    footer: {
                        height: '20mm',
                        contents: `
                        <div class="footer">
                            <p class="left">${metadata.title} | {{page}} of {{pages}}</p>
                            <p class="right">${metadata.date}</p>
                        </div>`,
                    },
                };

                this.pdfService.getPdf(pdfID, 'report', pdfOptions).then((response) => {
                    this.exportFileHash = response;
                    this.showExportModal('PDF');
                    this.alertsService.create('clear');
                }).catch((e) => {
                    console.error(e);
                    this.alertsService.generate(
                        'error', this.translate.translate('Something has gone wrong. Please try again later'));
                });
            },
            (e) => {
                console.error(e);
                this.alertsService.generate(
                    'error', this.translate.translate('Something has gone wrong. Please try again later'));
            }),
        );
    }

    /**
     * Format Export Data
     *
     * Formats the current filtered datagrid data for PDF exports
     *
     * @returns {array} exportData
     */
    private formatExportPDFData() {
        const rawData = this.myDataGrid.items['_filtered'];
        let subtitle;

        const data = rawData.map((item) => {
            if (item.breakdown) {
                subtitle = this.translate.translate('Overview');
                return {
                    [this.translate.translate('Asset')]: item.asset,
                    [this.translate.translate('Free')]: item.free,
                    [this.translate.translate('Total')]: item.total,
                    [this.translate.translate('Encumbered')]: item.totalencumbered,
                };
            }
            subtitle = this.translate.translate('Breakdown for @asset@', { asset: this.viewingAsset });
            return {
                [this.translate.translate('Address Label')]: item.label,
                [this.translate.translate('Address')]: item.addr,
                [this.translate.translate('Total')]: item.balance,
                [this.translate.translate('Encumbered')]: item.encumbrance,
                [this.translate.translate('Free')]: item.free,
            };
        });

        return {
            title: this.translate.translate('Balances Report'),
            subtitle,
            text: this.translate
                .translate('This is an auto-generated balances report with data correct as of the date above.'),
            data,
            rightAlign: [this.translate.translate('Free'), this.translate.translate('Total'),
                this.translate.translate('Encumbered')],
            walletName: this.walletName,
            date: moment().format('YYYY-MM-DD H:mm:ss'),
        };
    }

    /**
     * Format Export CSV Data
     *
     * Formats the current filtered datagrid data for CSV exports
     *
     * @returns {array} exportData
     */
    formatExportCSVData() {
        const rawData = JSON.parse(JSON.stringify(this.myDataGrid.items['_filtered']));

        return rawData.map((item) => {
            delete item.breakdown;
            delete item.deleted;
            return item;
        });
    }

    /**
     * Show Export Modal
     *
     * @return {void}
     */
    public showExportModal(type) {
        this.exportModalDisplay = type;
        this.changeDetector.detectChanges();
    }

    /**
     * Hide Export Modal
     *
     * @return {void}
     */
    public hideExportModal() {
        this.exportModalDisplay = '';
        this.changeDetector.detectChanges();
    }

    /**
     * Sets Currently Viewed Page of Datagrid
     *
     * Note: When the datagrid is destroyed, the emitted value (1) is ignored when the View/Edit btn is clicked
     *
     * @param page - page number value emitted from datagrid
     */
    public setCurrentPage(page) {
        if (!this.editTab) this.pageCurrent = page;
        this.editTab = false;
    }

    /**
     * Checks if the datagrid export buttons should be disabled
     *
     * @returns {boolean}
     */
    disableExportBtn() {
        return Boolean(!get(this.myDataGrid, "items['_filtered'].length", true));
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
