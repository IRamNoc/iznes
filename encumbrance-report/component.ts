import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { TabControl, Tab } from '@setl/core-balances/tabs';
import { WalletNodeRequestService } from '@setl/core-req-services';
import { Subscription } from 'rxjs/Subscription';
import { MultilingualService } from '@setl/multilingual';
import { SagaHelper } from '@setl/utils';
import { SET_ENCUMBRANCES, setRequestedEncumbrances, clearRequestedEncumbrances } from '@setl/core-store';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, get, isEmpty } from 'lodash';
import * as moment from 'moment';
import * as json2csv from 'json2csv';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { FileService, PdfService } from '@setl/core-req-services';

@Component({
    selector: 'encumbrance-report',
    templateUrl: './component.html',
})

export class EncumbranceReportComponent implements OnInit, OnDestroy {
    @ViewChild('myDataGrid') myDataGrid;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'encumbrances', 'requested']) encumbrancesRequestedOb;
    @select(['wallet', 'encumbrances', 'encumbrances']) encumbrancesOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletHolding', 'holdingByAddress']) holdingsByAddressOb;
    @select(['wallet', 'myWallets', 'walletList']) walletListOb;

    private subscriptions: Subscription[] = [];
    public connectedWalletId: number = 0;
    private walletName: string;
    public pageSize: number;
    public pageCurrent: number;
    public tabControl: TabControl;
    public tabs: Tab[];
    public encumbrances: any = [];
    public exportFileHash: string = '';
    public exportModalDisplay: string = '';
    public viewingAddress: string = '';
    private addressList: any;

    public constructor(private changeDetector: ChangeDetectorRef,
                       private ngRedux: NgRedux<any>,
                       public translate: MultilingualService,
                       private walletNodeRequestService: WalletNodeRequestService,
                       private alertsService: AlertsService,
                       private fileService: FileService,
                       private pdfService: PdfService) {
        this.initSubscriptions();
    }

    public ngOnInit() {
        this.tabControl = new TabControl({
            title: this.translate.translate('Encumbrance Report'),
            icon: 'th-list',
            active: true,
            data: {},
        });

        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
            }),
        );
    }

    /**
     * Initialise subscriptions
     *
     * @returns void
     */
    initSubscriptions() {
        this.subscriptions.push(
            combineLatest(this.connectedWalletOb, this.encumbrancesRequestedOb, this.walletListOb).subscribe(
                ([walletID, requested, walletList]) => {
                    // Clear requested flag on wallet change
                    if (this.connectedWalletId && walletID !== this.connectedWalletId && requested) {
                        this.ngRedux.dispatch(clearRequestedEncumbrances());
                    }
                    this.connectedWalletId = walletID;
                    this.requestEncumbrances(requested);
                    this.walletName = (walletList[walletID] || {}).walletName;
                },
            ),
        );

        this.subscriptions.push(
            combineLatest(this.encumbrancesOb, this.addressListOb, this.holdingsByAddressOb).subscribe(
                ([encumbrances, addressList, holdingsByAddress]) => {
                    this.formatEncumbranceList(encumbrances, addressList, holdingsByAddress);
                },
            ),
        );
    }

    /**
     * Request encumbrance data
     *
     * @param {boolean} requested
     * @returns void
     */
    requestEncumbrances(requested: boolean) {
        if (!requested) {
            this.ngRedux.dispatch(setRequestedEncumbrances());

            const asyncTaskpipe = this.walletNodeRequestService.requestEncumbranceDetails({
                walletid: this.connectedWalletId,
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_ENCUMBRANCES],
                [],
                asyncTaskpipe,
                {},
            ));
        }
    }

    /**
     * Format encumbrance list for datagrid
     *
     * @param {object} encumbrances
     * @param {object} addressList
     * @param {object} holdingsByAddress
     * @returns void
     */
    formatEncumbranceList(encumbrances, addressList, holdingsByAddress) {
        this.encumbrances = [];
        if (!isEmpty(encumbrances) && !isEmpty(addressList)) {
            this.addressList = addressList;
            Object.keys(encumbrances).forEach((address) => {
                const label = addressList[address].label;
                const details = [];

                Object.keys(holdingsByAddress[this.connectedWalletId][address] || {}).forEach((asset) => {
                    const assetSpilt = asset.split('|');
                    get(encumbrances, `[${address}][${assetSpilt[0]}][${assetSpilt[1]}]`, []).forEach((detail) => {
                        details.push({
                            reference: detail.reference,
                            asset,
                            amount: detail.amount,
                            beneficiary: `${addressList[detail.beneficiaries[0].address].label}
                                         (${detail.beneficiaries[0].address})`,
                            start: moment.unix(detail.beneficiaries[0].starttime).format('YYYY-MM-DD HH:mm:ss'),
                            end: detail.beneficiaries[0].endtime === 0 ? this.translate.translate('Not set')
                                : moment.unix(detail.beneficiaries[0].endtime).format('YYYY-MM-DD HH:mm:ss'),
                        });
                    });
                });

                this.encumbrances.push({
                    label,
                    address,
                    details,
                });
            });
            this.changeDetector.detectChanges;
        }
    }

    /**
     * Open breakdown tab for the given address
     *
     * @param {object} encumbrance
     * @returns void
     */
    public handleViewBreakdown(encumbrance): void {
        if (this.tabControl.activate(this.findTab(encumbrance.address))) {
            return;
        }

        this.tabControl.new({
            title: encumbrance.label,
            icon: 'th-list',
            active: false,
            data: {
                encumbranceObject: encumbrance,
                address: encumbrance.address,
            },
        });
    }

    /**
     * Closes a tab
     *
     * @param {number} id
     * @returns void
     */
    handleClose(id) {
        this.viewingAddress = '';
        this.tabControl.close(id);
    }

    /**
     * Return a function to handle filtering tabControl by address
     *
     * @param {string} address
     * @param {string} template
     * @returns {(tab) => boolean}
     */
    findTab(address: string) {
        this.setViewingAddress(address);
        return tab => tab.data.address === address;
    }

    /**
     * Set Viewing Address
     */
    setViewingAddress(address) {
        this.viewingAddress = get(this.addressList, `${address}.label`, address);
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
            name: 'Encumbrance-Export.csv',
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
        const data = this.myDataGrid.items['_filtered'].map((item) => {
            return {
                [this.translate.translate('Reference')]: item.reference,
                [this.translate.translate('Asset')]: item.asset,
                [this.translate.translate('Beneficiary Address')]: item.beneficiary,
                [this.translate.translate('Encumbered')]: item.amount,
                [this.translate.translate('Start')]: item.start,
                [this.translate.translate('End')]: item.end,
            };
        });

        return {
            title: this.translate.translate('Encumbrance Report'),
            subtitle: this.translate
                .translate('Breakdown for @viewingAddress@', { viewingAddress: this.viewingAddress }),
            text: this.translate
                .translate('This is an auto-generated encumbrance report with data correct as of the date above.'),
            data,
            rightAlign: [this.translate.translate('Encumbered')],
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
