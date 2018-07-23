import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {MemberSocketService} from '@setl/websocket-service';

import {NgRedux, select} from '@angular-redux/store';
import {Unsubscribe} from 'redux';
import {fromJS} from 'immutable';
/* Utils. */
import {ConfirmationService, NumberConverterService} from '@setl/utils';
/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

import {Subject} from 'rxjs';

import {ActivatedRoute, Router} from '@angular/router';
/* Clarity */
/* services */
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';
/* store */
import {ofiManageOrderActions} from '@ofi/ofi-main/ofi-store';
import {APP_CONFIG, AppConfig, FileDownloader} from "@setl/utils/index";
import * as moment from 'moment';
import {MultilingualService} from '@setl/multilingual';

import {mDateHelper} from '@setl/utils';

/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CentralizationReportComponent implements OnInit, OnDestroy {

    unknownValue = '???';

    filtersForm: FormGroup;

    fundsUrl = '/reports/precentralisation/funds';
    sharesUrl = '/reports/precentralisation/shares';

    centralizationReportsFundsList: Array<any> = [];
    centralizationReportsSharesList: Array<any> = [];

    // Locale
    language = 'en';

    isFundLevel = true;
    isShareLevel = false;

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    currencyList = [
        {id: 0, text: 'EUR'},
        {id: 1, text: 'USD'},
        {id: 2, text: 'GBP'},
        {id: 3, text: 'CHF'},
        {id: 4, text: 'JPY'},
        {id: 5, text: 'AUD'},
        {id: 6, text: 'NOK'},
        {id: 7, text: 'SEK'},
        {id: 8, text: 'ZAR'},
        {id: 9, text: 'RUB'},
        {id: 10, text: 'SGD'},
        {id: 11, text: 'AED'},
        {id: 12, text: 'CNY'},
        {id: 13, text: 'PLN'},
    ];

    fundSpecificDates = [];
    isPeriod = false;
    isSettlementSelected = false;

    private myDetails: any = {};
    private appConfig: any = {};
    private subscriptions: Array<any> = [];

    fundsList: Array<any> = [];
    selectedFund = 0;
    sharesList: Array<any> = [];
    selectedShare = 0;

    sharesDetails: any = {};
    sharesTotalNetAmount = 0;
    sharesTotalSubscriptionAmount = 0;
    sharesTotalRedemptionAmount = 0;

    fundsDetails: any = {};

    dateFrom = '';
    dateTo = '';
    mode = 0;   // 1 = NAV ; 2 = Settlement

    colorScheme = {domain: ['#51AD5B', '#AF2418']};
    pieChartDatas = [
        {
            name: 'Subscription (%)',
            value: 0,
        },
        {
            name: 'Redemption (%)',
            value: 0,
        }
    ];

    customColors = [
        {
            name: 'Subscription (%)',
            value: '#51AD5B'
        },
        {
            name: 'Redemption (%)',
            value: '#AF2418'
        }
    ];

    fundsPayload: any;
    isFundsPayloadOK: any;
    sharesPayload: any;
    isSharesPayloadOK: any;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;
    // @select(['ofi', 'ofiReports', 'centralizationReports', 'requested']) requestedOfiCentralizationReportsObj;
    // @select(['ofi', 'ofiReports', 'centralizationReports', 'centralizationReportsList']) OfiCentralizationReportsListObj;

    // share list for ng-select
    @select(['ofi', 'ofiReports', 'precentralizationReports', 'requestedSharesList']) requestedSharesListOb;
    @select(['ofi', 'ofiReports', 'precentralizationReports', 'sharesList']) sharesListOb;

    // shares details
    @select(['ofi', 'ofiReports', 'precentralizationReports', 'sharesDetailsList']) sharesDetailsListOb;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private _fb: FormBuilder,
                private memberSocketService: MemberSocketService,
                private ofiReportsService: OfiReportsService,
                private alerts: AlertsService,
                private _confirmationService: ConfirmationService,
                private _numberConverterService: NumberConverterService,
                private _fileDownloader: FileDownloader,
                private _translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.isFundLevel = (this.router.url.indexOf('/precentralisation/funds') !== -1) ? true : false;
        this.isShareLevel = (this.router.url.indexOf('/precentralisation/shares') !== -1) ? true : false;

        this.fundSpecificDates = [
            {id: 0, text: _translate.translate('Specific NAV Date')},
            {id: 1, text: _translate.translate('Specific Settlement Date')},
            {id: 2, text: _translate.translate('Specific NAV Period')},
            {id: 3, text: _translate.translate('Specific Settlement Period')},
        ];

        this.appConfig = appConfig;

        this.createFiltersForm();

        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions.push(this.myDetailOb.subscribe((myDetails) => this.myDetails = myDetails));

        // this.subscriptions.push(this.requestedOfiCentralizationReportsObj.subscribe((requested) => this.getCentralizationReportsRequested(requested)));
        // this.subscriptions.push(this.OfiCentralizationReportsListObj.subscribe((list) => this.getCentralizationReportsListFromRedux(list)));

        // share list for ng-select
        this.subscriptions.push(this.requestedSharesListOb.subscribe((requestedSharesList) => this.requestedSharesListFromRedux(requestedSharesList)));
        this.subscriptions.push(this.sharesListOb.subscribe((sharesList) => this.getSharesListFromRedux(sharesList)));

        // shares details
        this.subscriptions.push(this.sharesDetailsListOb.subscribe((sharesDetailsList) => {
            this.sharesDetails = sharesDetailsList;
            if (this.sharesDetails.totals) {
                if (this.sharesDetails.totals.hasOwnProperty('totalNetAmount')) {
                    this.sharesTotalNetAmount = Number(this.sharesDetails.totals.totalNetAmount);
                    if (this.sharesDetails.totals.hasOwnProperty('totalSubscriptionAmount')) {
                        this.sharesTotalSubscriptionAmount = Number(this.sharesDetails.totals.totalSubscriptionAmount);
                    }
                    if (this.sharesDetails.totals.hasOwnProperty('totalRedemptionAmount')) {
                        this.sharesTotalRedemptionAmount = Number(this.sharesDetails.totals.totalRedemptionAmount);
                    }
                }
                this.pieChartDatas = [
                    {
                        name: 'Subscription (%)',
                        value: (this.sharesTotalSubscriptionAmount * 100 / (this.sharesTotalSubscriptionAmount + this.sharesTotalRedemptionAmount)),
                    },
                    {
                        name: 'Redemption (%)',
                        value: (this.sharesTotalRedemptionAmount * 100 / (this.sharesTotalSubscriptionAmount + this.sharesTotalRedemptionAmount)),
                    }
                ];
            }
            this.changeDetectorRef.markForCheck();
        }));
    }

    public ngOnInit() {

    }

    getLanguage(requested): void {
        if (requested) {
            switch (requested) {
                case 'fra':
                    this.language = 'fr';
                    break;
                case 'eng':
                    this.language = 'en';
                    break;
                default:
                    this.language = 'en';
                    break;
            }
            this.changeDetectorRef.markForCheck();
        }
    }

    requestedSharesListFromRedux(requestedSharesList): void {
        if (!requestedSharesList) {
            OfiReportsService.defaultRequestPrecentralizationReportsSharesList(this.ofiReportsService, this.ngRedux);
        }
    }

    getSharesListFromRedux(sharesList) {
        const listImu = fromJS(sharesList);

        this.sharesList = listImu.reduce((result, item) => {

            result.push({
                id: item.get('shareId'),
                text: item.get('shareName') + ' (' + item.get('isin') + ')',
            });

            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    // getCentralizationReportsRequested(requested): void {
    //     if (!requested) {
    //         OfiReportsService.defaultRequestCentralizationReportsList(this.ofiReportsService, this.ngRedux);
    //     }
    // }
    //
    // getCentralizationReportsListFromRedux(list) {
    //     const listImu = fromJS(list);
    //
    //     this.centralizationReportsFundsList = listImu.reduce((result, item) => {
    //
    //         result.push({
    //             aum: item.get('aum'),
    //             subCutoffDate: mDateHelper.convertToLocal(item.get('subCutoffDate'), 'YYYY-MM-DD HH:mm:ss'),
    //             redCutoffDate: mDateHelper.convertToLocal(item.get('redCutoffDate'), 'YYYY-MM-DD HH:mm:ss'),
    //             fundShareID: item.get('fundShareID'),
    //             fundShareName: item.get('fundShareName'),
    //             isin: item.get('isin'),
    //             latestNav: (item.get('latestNav') === null) ? 0 : item.get('latestNav'),
    //             navDate: (item.get('navDate') === null) ? '-' : mDateHelper.convertToLocal(item.get('navDate'), 'YYYY-MM-DD'),
    //             netPosition: item.get('netPosition'),
    //             netPositionPercentage: item.get('netPositionPercentage'),
    //             redAmount: (item.get('redAmount') === null) ? 0 : item.get('redAmount'),
    //             redQuantity: (item.get('redQuantity') === null) ? 0 : item.get('redQuantity'),
    //             redSettlementDate: mDateHelper.convertToLocal(item.get('redSettlementDate'), 'YYYY-MM-DD'),
    //             shareClassCurrency: item.get('shareClassCurrency'),
    //             subAmount: (item.get('subAmount') === null) ? 0 : item.get('subAmount'),
    //             subQuantity: (item.get('subQuantity') === null) ? 0 : item.get('subQuantity'),
    //             subSettlementDate: mDateHelper.convertToLocal(item.get('subSettlementDate'), 'YYYY-MM-DD'),
    //         });
    //
    //         return result;
    //     }, []);
    //
    //     for (const report of this.centralizationReportsFundsList) {
    //         this.dataListForSearch.push({
    //             id: report.fundShareID,
    //             text: report.fundShareName,
    //         });
    //     }
    //
    //     this.changeDetectorRef.markForCheck();
    // }

    buildLink(id) {
        const dest = 'am-reports-section/centralization-history/' + id;
        this.router.navigateByUrl(dest);
    }

    createFiltersForm() {
        this.filtersForm = this._fb.group({
            selectList: [
                '',
            ],
            specificDate: [
                '',
            ],
            dateFrom: [
                '',
            ],
            dateTo: [
                '',
            ],
        });
        this.subscriptions.push(this.filtersForm.valueChanges.subscribe((form) => this.requestSearch(form)));
    }

    requestSearch(form) {
        if (this.filtersForm.controls['specificDate'].value.length > 0) {
            this.isPeriod = (this.filtersForm.controls['specificDate'].value[0].id < 2) ? false : true;
            this.isSettlementSelected = (this.filtersForm.controls['specificDate'].value[0].id === 1 || this.filtersForm.controls['specificDate'].value[0].id === 3) ? true : false;
            this.mode = (this.isSettlementSelected) ? 2 : 1;    // 1 = NAV ; 2 = Settlement
        } else {
            this.mode = 0;
        }
        if (this.filtersForm.controls['selectList'].value.length > 0) {
            if (this.isFundLevel) {
                this.selectedFund = this.filtersForm.controls['selectList'].value[0].id;
            }
            if (this.isShareLevel) {
                this.selectedShare = this.filtersForm.controls['selectList'].value[0].id;
            }
        } else {
            this.selectedFund = 0;
            this.selectedShare = 0;
        }

        this.dateFrom = (this.filtersForm.controls['dateFrom'].value !== '') ? this.filtersForm.controls['dateFrom'].value : '';
        this.dateTo = (this.filtersForm.controls['dateTo'].value !== '' && this.isPeriod) ? this.filtersForm.controls['dateTo'].value : '';

        // // check data in futur
        // let today = new Date();
        // today.setHours(0,0,0,0); // fix time
        // let dateFrom = new Date(this.dateFrom + ' 00:00:00');
        // let dateTo = new Date(this.dateTo + ' 00:00:00');
        // if (dateFrom < today) {
        //     this.dateFrom = '';
        //     this.filtersForm.controls['dateFrom'].patchValue('', { emitEvent: false });
        //     alert('DateFrom must be at least today\'s date');
        // }
        // if (dateTo < dateFrom) {
        //     this.dateTo = '';
        //     this.filtersForm.controls['dateTo'].patchValue('', { emitEvent: false });
        //     alert('DateTo should be equal or after DateFrom');
        // }

        if (this.isFundLevel) {

        }
        if (this.isShareLevel) {
            this.isSharesPayloadOK = true;
            if (this.mode > 0 && this.dateFrom !== '') {
                if (this.isPeriod && this.dateTo === '') {
                    this.isSharesPayloadOK = false;
                }
                if (this.isSharesPayloadOK) {
                    this.sharesPayload = {
                        shareId: this.selectedShare,
                        dateFrom: this.dateFrom,
                        dateTo: this.dateTo,
                        mode: this.mode,
                    };
                    this.ofiReportsService.requestPrecentralizationReportsSharesDetailsList(this.sharesPayload);
                }
            } else {
                this.isSharesPayloadOK = false;
            }
        }
    }

    showCurrency(currency) {
        const obj = this.currencyList.find(o => o.id === currency);
        if (obj !== undefined) {
            return obj.text;
        } else {
            return currency;
        }
    }

    calculNetPosition(suba, reda, redq, subq, latestNav) {
        return (isFinite(((suba - reda) / ((redq + subq) * latestNav)) * 100)) ? ((suba - reda) / ((redq + subq) * latestNav)) * 100 : 0;
    }

    convertDate(inputDate) {
        let today: any = new Date(inputDate);
        let dd: any = today.getDate();
        let mm: any = today.getMonth() + 1;
        let yyyy: any = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return yyyy + '/' + mm + '/' + dd;
    }

    onClickExportCentralizationReport(id) {

        this._fileDownloader.downLoaderFile({
            method: 'getAllShareInfoCsv',
            token: this.memberSocketService.token,
            userId: this.myDetails.userId
        });

    }


    onClickViewCentralizationHistory(id) {
        this.buildLink(id);
    }

    onClickViewCorrespondingOrders(id) {
        const obj = this.sharesDetails.shares.find(o => o.shareId === id);
        if (obj !== undefined) {
            const orderFilters = {
                filters: {
                    isin: obj.isin,
                    sharename: obj.shareName,
                    status: {id : -3},
                    type: {id : 0},
                    dateType: {id : 'navDate'},
                    fromDate: moment(obj.navDate).format('YYYY-MM-DD'),
                    toDate: moment(obj.navDate).format('YYYY-MM-DD')
                }
            };

            this.ngRedux.dispatch({type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS, filters: orderFilters});
            this.router.navigateByUrl('manage-orders/list');
        }
    }

    onClickDownloadCorrespondingOrders(id) {

        const obj = this.centralizationReportsFundsList.find(o => o.fundShareID === id);
        if (obj !== undefined) {
            const navDate = moment(obj.navDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
            const params = {
                shareName: obj.fundShareName,
                isin: obj.isin,
                status: null,
                orderType: null,
                pageSize: 1000,
                rowOffSet: 0,
                sortByField: 'userEntered',
                sortOrder: 'desc',
                dateSearchField: 'navDate',
                fromDate: navDate,
                toDate: navDate + ' 23:59',
            };

            this._fileDownloader.downLoaderFile({
                method: 'exportAssetManagerOrders',
                token: this.memberSocketService.token,
                userId: this.myDetails.userId,
                ...params
            });
        }
    }

    exportPrecentralizationReport(type) {
        if (type === 's' && this.isSharesPayloadOK) {
            this._fileDownloader.downLoaderFile({
                method: 'exportPrecentralisationShares',
                token: this.memberSocketService.token,
                shareId: this.sharesPayload.shareId,
                dateFrom: this.sharesPayload.dateFrom,
                dateTo: this.sharesPayload.dateTo,
                mode: this.sharesPayload.mode,
            });
        }
    }

    onClickDownloadCentralizationHistory(id) {
        this._fileDownloader.downLoaderFile({
            method: 'getSingleShareInfoCsv',
            token: this.memberSocketService.token,
            fundShareID: id,
            userId: this.myDetails.userId
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
