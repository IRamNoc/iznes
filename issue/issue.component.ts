import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { WalletNodeRequestService } from '@setl/core-req-services';
import { ReportingService } from '../reporting.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TabControl, Tab } from '../tabs';
import { select, NgRedux } from '@angular-redux/store';
import { isEmpty, filter, get } from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import * as json2csv from 'json2csv';
import * as moment from 'moment';
import { FileService, PdfService } from '@setl/core-req-services';
import { SagaHelper } from '@setl/utils';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
    selector: 'setl-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.css'],
})
export class SetlIssueComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('myDataGrid') myDataGrid;
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['wallet', 'addressDirectory']) addressDirectory;
    @select(['wallet', 'myWallets', 'walletList']) walletListOb;

    private issuers$: Observable<any>;
    private tabControl: TabControl;
    private subscriptions: Subscription[] = [];
    public tabs: Tab[] = [];
    public connectedWalletId;
    /* Datagrid properties */
    public pageSize: number;
    public pageCurrent: number;
    private editTab: boolean = false;
    public exportFileHash: string = '';
    public exportModalDisplay: string = '';
    public viewingAddress: string = '';
    private walletName: string;
    private viewingAsset: string;

    constructor(private walletNodeRequestService: WalletNodeRequestService,
                private changeDetector: ChangeDetectorRef,
                private reportingService: ReportingService,
                public translate: MultilingualService,
                private alertsService: AlertsService,
                private fileService: FileService,
                private pdfService: PdfService,
                private ngRedux: NgRedux<any>) {

        this.subscriptions.push(
            combineLatest(this.getConnectedWallet, this.walletListOb).subscribe(([connectedWalletId, walletList]) => {
                this.connectedWalletId = connectedWalletId;
                this.closeTabs();

                this.walletName = (walletList[connectedWalletId] || {}).walletName;
            },
        ));
    }

    ngOnInit() {
        this.issuers$ = this.reportingService.getIssuers();

        this.tabControl = new TabControl({
            title: this.translate.translate('Issue Reports'),
            icon: 'money',
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
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    public handleViewBreakdown(asset): void {
        this.viewingAsset = asset.asset;
        this.editTab = true;
        if (this.tabControl.activate(tab => tab.data.asset === asset.asset)) {
            return;
        }

        this.reportingService.getHoldings(asset.asset).then((holdings) => {
            this.tabControl.new({
                title: asset.asset,
                icon: 'th-list',
                active: false,
                data: {
                    asset: asset.asset,
                    assetObject: asset,
                    hash: asset.hash,
                    holdings,
                },
            });

            /* Subscribe to get holdings wallet details and then map the holding */
            this.subscriptions.push(this.addressDirectory.subscribe((addresses) => {
                if (!isEmpty(addresses)) {
                    this.tabControl.tabs[1].data.holdings =
                        this.reportingService.mapHolding(this.tabControl.tabs[1].data.holdings, addresses);
                    this.changeDetector.detectChanges();
                }
            }));
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
                tabIndex = tabIndex - 1;
            }
        }
        this.viewingAsset = '';
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
     * Export List
     *
     * Exports current dataGrid List to CSV format
     *
     * @return {void}
     */
    public exportCSV() {
        this.alertsService.create('loading');

        const csvData = this.myDataGrid.items['_filtered'];
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
            if (this.viewingAsset) {
                subtitle = this.translate
                    .translate('Breakdown for @viewingAsset@', { viewingAsset: this.viewingAsset });
                return {
                    [this.translate.translate('Wallet')]: item.walletName,
                    [this.translate.translate('Label')]: item.addrLabel,
                    [this.translate.translate('Address')]: item.addr,
                    [this.translate.translate('Percent')]: `${Math.round(item.percentage * 100) / 100}%`,
                    [this.translate.translate('Total')]: item.balance,
                    [this.translate.translate('Encumbered')]: item.encumbered,
                    [this.translate.translate('Free')]: item.free,
                };
            }
            subtitle = this.translate.translate('Overview');
            return {
                [this.translate.translate('Asset')]: item.asset,
                [this.translate.translate('Label')]: item.addressLabel,
                [this.translate.translate('Address')]: item.address,
                [this.translate.translate('Total')]: item.total,
            };
        });

        return {
            title: this.translate.translate('Issue Report'),
            subtitle,
            text: this.translate
                .translate('This is an auto-generated issue report with data correct as of the date above.'),
            data,
            rightAlign: [this.translate.translate('Percent'), this.translate.translate('Total'),
                this.translate.translate('Encumbered'), this.translate.translate('Free')],
            walletName: this.walletName,
            date: moment().format('YYYY-MM-DD H:mm:ss'),
        };
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
     * Checks if the datagrid export buttons should be disabled
     *
     * @returns {boolean}
     */
    disableExportBtn() {
        return Boolean(!get(this.myDataGrid, "items['_filtered'].length", true));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
