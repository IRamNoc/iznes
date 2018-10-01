import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MemberSocketService } from '@setl/websocket-service';

import { NgRedux, select } from '@angular-redux/store';
import { Unsubscribe } from 'redux';
import { fromJS } from 'immutable';
/* Utils. */
import { ConfirmationService, NumberConverterService } from '@setl/utils';
/* Alerts and confirms. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';

import { Subject } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
/* Clarity */
/* services */
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
/* store */
import { ofiManageOrderActions } from '@ofi/ofi-main/ofi-store';
import { APP_CONFIG, AppConfig, FileDownloader } from "@setl/utils/index";
import * as moment from 'moment';
import { MultilingualService } from '@setl/multilingual';
import { get } from 'lodash';

import { mDateHelper } from '@setl/utils';

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

export class CentralisationReportComponent implements OnInit, OnDestroy {

    unknownValue = '???';

    filtersForm: FormGroup;

    fundsUrl = '/reports/centralisation/funds';
    sharesUrl = '/reports/centralisation/shares';

    centralisationReportsFundsList: Array<any> = [];
    centralisationReportsSharesList: Array<any> = [];

    // Locale
    language = 'en';

    isFundLevel = true;
    isShareLevel = false;

    // Datepicker config
    fromConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.filtersForm.controls['dateTo'].value != '') {
                return (thisDate.diff(this.filtersForm.controls['dateTo'].value) > 0);
            } else {
                return false;
            }
        },
    };
    toConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.filtersForm.controls['dateFrom'].value != '') {
                return (thisDate.diff(this.filtersForm.controls['dateFrom'].value) < 0);
            } else {
                return false;
            }
        },
    };

    currencyList = [
        { id: 0, text: 'EUR' },
        { id: 1, text: 'USD' },
        { id: 2, text: 'GBP' },
        { id: 3, text: 'CHF' },
        { id: 4, text: 'JPY' },
        { id: 5, text: 'AUD' },
        { id: 6, text: 'NOK' },
        { id: 7, text: 'SEK' },
        { id: 8, text: 'ZAR' },
        { id: 9, text: 'RUB' },
        { id: 10, text: 'SGD' },
        { id: 11, text: 'AED' },
        { id: 12, text: 'CNY' },
        { id: 13, text: 'PLN' },
    ];

    fundSpecificDates = [];
    isPeriod = true;
    isSettlementSelected = true;

    private myDetails: any = {};
    private appConfig: any = {};
    private subscriptions: Array<any> = [];

    fundsList: Array<any> = [];
    sharesList: Array<any> = [];
    selectedFund = 0;
    selectedShare = 0;

    sharesDetails: any = [];
    sharesTotalNetAmount = 0;
    sharesTotalSubscriptionAmount = 0;
    sharesTotalRedemptionAmount = 0;

    fundsDetails: any = [];
    fundsTotalNetAmount = 0;
    fundsTotalSubscriptionAmount = 0;
    fundsTotalRedemptionAmount = 0;

    dateFrom = '';
    dateTo = '';
    mode = 2;   // 1 = NAV ; 2 = Settlement

    colorScheme = { domain: ['#51AD5B', '#AF2418'] };
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

    // share list for ng-select
    @select(['ofi', 'ofiReports', 'centralisationReports', 'requestedFundsList']) requestedFundsListOb;
    @select(['ofi', 'ofiReports', 'centralisationReports', 'fundsList']) fundsListOb;

    // shares details
    @select(['ofi', 'ofiReports', 'centralisationReports', 'fundsDetailsList']) fundsDetailsListOb;

    // share list for ng-select
    @select(['ofi', 'ofiReports', 'centralisationReports', 'requestedSharesList']) requestedSharesListOb;
    @select(['ofi', 'ofiReports', 'centralisationReports', 'sharesList']) sharesListOb;

    // shares details
    @select(['ofi', 'ofiReports', 'centralisationReports', 'sharesDetailsList']) sharesDetailsListOb;

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
        // reset datagrid
        this.fundsDetails = [];
        this.sharesDetails = [];
        this.selectedFund = 0;
        this.selectedShare = 0;
        this.sharesTotalNetAmount = 0;
        this.sharesTotalSubscriptionAmount = 0;
        this.sharesTotalRedemptionAmount = 0;
        this.fundsTotalNetAmount = 0;
        this.fundsTotalSubscriptionAmount = 0;
        this.fundsTotalRedemptionAmount = 0;
        this.pieChartDatas = [
            {
                name: 'Subscription (%)',
                value: 0,
            },
            {
                name: 'Redemption (%)',
                value: 0,
            }
        ];

        this.isFundLevel = (this.router.url.indexOf('/centralisation/funds') !== -1) ? true : false;
        this.isShareLevel = (this.router.url.indexOf('/centralisation/shares') !== -1) ? true : false;

        if (!this.isFundLevel && !this.isShareLevel) {
            this.router.navigateByUrl('/reports/centralisation/funds');
        }

        this.fundSpecificDates = [
            { id: 0, text: _translate.translate('Specific NAV Date') },
            { id: 1, text: _translate.translate('Specific Settlement Date') },
            { id: 2, text: _translate.translate('Specific NAV Period') },
            { id: 3, text: _translate.translate('Specific Settlement Period') },
        ];

        this.appConfig = appConfig;

        this.createFiltersForm();
        this.filtersForm.reset();

        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions.push(this.myDetailOb.subscribe((myDetails) => this.myDetails = myDetails));

        if (this.isFundLevel) {
            // funds list for ng-select
            this.subscriptions.push(this.requestedFundsListOb.subscribe((requestedFundsList) => this.requestedFundsListFromRedux(requestedFundsList)));
            this.subscriptions.push(this.fundsListOb.subscribe((fundsList) => this.getFundsListFromRedux(fundsList)));

            // funds details
            this.subscriptions.push(this.fundsDetailsListOb.subscribe((fundsDetailsList) => {
                this.fundsDetails = fundsDetailsList;
                //TODO: temp fix. this.fundsDetails.funds.length > 0 fix in backend.
                if (this.fundsDetails.totals && this.fundsDetails.funds.length > 0) {
                    if (this.fundsDetails.totals.hasOwnProperty('totalNetAmount')) {
                        this.fundsTotalNetAmount = Number(this.fundsDetails.totals.totalNetAmount);
                        if (this.fundsDetails.totals.hasOwnProperty('totalSubscriptionAmount')) {
                            this.fundsTotalSubscriptionAmount = Number(this.fundsDetails.totals.totalSubscriptionAmount);
                        }
                        if (this.fundsDetails.totals.hasOwnProperty('totalRedemptionAmount')) {
                            this.fundsTotalRedemptionAmount = Number(this.fundsDetails.totals.totalRedemptionAmount);
                        }
                    }
                    this.pieChartDatas = [
                        {
                            name: 'Subscription (%)',
                            value: (this.fundsTotalSubscriptionAmount * 100 / (this.fundsTotalSubscriptionAmount + this.fundsTotalRedemptionAmount)),
                        },
                        {
                            name: 'Redemption (%)',
                            value: (this.fundsTotalRedemptionAmount * 100 / (this.fundsTotalSubscriptionAmount + this.fundsTotalRedemptionAmount)),
                        }
                    ];
                } else {
                    // this.fundsDetails = [];
                    this.fundsTotalNetAmount = 0;
                    this.fundsTotalSubscriptionAmount = 0;
                    this.fundsTotalRedemptionAmount = 0;
                    this.pieChartDatas = [
                        {
                            name: 'Subscription (%)',
                            value: 0,
                        },
                        {
                            name: 'Redemption (%)',
                            value: 0,
                        }
                    ];
                }
                this.changeDetectorRef.markForCheck();
            }));
        }

        if (this.isShareLevel) {
            // share list for ng-select
            this.subscriptions.push(this.requestedSharesListOb.subscribe((requestedSharesList) => this.requestedSharesListFromRedux(requestedSharesList)));
            this.subscriptions.push(this.sharesListOb.subscribe((sharesList) => this.getSharesListFromRedux(sharesList)));

            // shares details
            this.subscriptions.push(this.sharesDetailsListOb.subscribe((sharesDetailsList) => {
                this.sharesDetails = sharesDetailsList;
                //TODO: temp fix. this.sharesDetails.shares.length > 0 fix in backend.
                if (this.sharesDetails.totals && this.sharesDetails.shares.length > 0) {
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
                } else {
                    // this.sharesDetails = [];
                    this.sharesTotalNetAmount = 0;
                    this.sharesTotalSubscriptionAmount = 0;
                    this.sharesTotalRedemptionAmount = 0;
                    this.pieChartDatas = [
                        {
                            name: 'Subscription (%)',
                            value: 0,
                        },
                        {
                            name: 'Redemption (%)',
                            value: 0,
                        }
                    ];
                }
                this.changeDetectorRef.markForCheck();
            }));
        }
    }

    resetDatas() {
        // reset datagrid
        this.filtersForm.reset();
        this.fundsDetails = [];
        this.sharesDetails = [];
        this.selectedFund = 0;
        this.selectedShare = 0;
        this.sharesTotalNetAmount = 0;
        this.sharesTotalSubscriptionAmount = 0;
        this.sharesTotalRedemptionAmount = 0;
        this.fundsTotalNetAmount = 0;
        this.fundsTotalSubscriptionAmount = 0;
        this.fundsTotalRedemptionAmount = 0;
        this.pieChartDatas = [
            {
                name: 'Subscription (%)',
                value: 0,
            },
            {
                name: 'Redemption (%)',
                value: 0,
            }
        ];
    }

    public ngOnInit() {
        this.resetDatas();
        this.updateFiltersForm();
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

    requestedFundsListFromRedux(requestedFundsList): void {
        if (!requestedFundsList) {
            OfiReportsService.defaultRequestCentralisationReportsFundsList(this.ofiReportsService, this.ngRedux);
        }
    }

    getFundsListFromRedux(fundsList) {
        const listImu = fromJS(fundsList);

        this.fundsList = listImu.reduce((result, item) => {
            let isLei = (item.get('lei') === '' || item.get('lei') === null) ? '' : ' (' + item.get('isin') + ')';
            result.push({
                id: item.get('fundId'),
                text: item.get('fundName') + isLei,
            });

            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    requestedSharesListFromRedux(requestedSharesList): void {
        if (!requestedSharesList) {
            OfiReportsService.defaultRequestCentralisationReportsSharesList(this.ofiReportsService, this.ngRedux);
        }
    }

    getSharesListFromRedux(sharesList) {
        const listImu = fromJS(sharesList);

        this.sharesList = listImu.reduce((result, item) => {
            let isIsin = (item.get('isin') === '' || item.get('isin') === null) ? '' : ' (' + item.get('isin') + ')';
            result.push({
                id: item.get('shareId'),
                text: item.get('shareName') + isIsin,
            });

            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    buildLink(id) {
        const dest = 'am-reports-section/centralisation/' + id;
        this.router.navigateByUrl(dest);
    }

    updateFiltersForm() {
        const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
        const lastMonth = moment().subtract(1, 'month').format('YYYY-MM-DD');
        this.filtersForm.get('specificDate').patchValue([{
            id: 3,
            text: this._translate.translate('Specific Settlement Period')
        }], { emitEvent: false });
        this.filtersForm.get('dateFrom').patchValue(lastMonth, { emitEvent: false });
        this.filtersForm.get('dateTo').patchValue(tomorrow, { emitEvent: false });
        this.filtersForm.get('specificDate').updateValueAndValidity();
        this.filtersForm.get('dateFrom').updateValueAndValidity();
        this.filtersForm.get('dateTo').updateValueAndValidity();
        this.changeDetectorRef.markForCheck();
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
        if (this.filtersForm.controls['specificDate'].value !== null) {
            if (this.filtersForm.controls['specificDate'].value.length > 0) {
                this.isPeriod = (this.filtersForm.controls['specificDate'].value[0].id < 2) ? false : true;
                this.isSettlementSelected = (this.filtersForm.controls['specificDate'].value[0].id === 1 || this.filtersForm.controls['specificDate'].value[0].id === 3) ? true : false;
                this.mode = (this.isSettlementSelected) ? 2 : 1;    // 1 = NAV ; 2 = Settlement
            } else {
                this.mode = 0;
                this.filtersForm.get('dateFrom').patchValue(null, { emitEvent: false });
                this.filtersForm.get('dateTo').patchValue(null, { emitEvent: false });
                this.sharesTotalNetAmount = 0;
                this.sharesTotalSubscriptionAmount = 0;
                this.sharesTotalRedemptionAmount = 0;
                this.fundsTotalNetAmount = 0;
                this.fundsTotalSubscriptionAmount = 0;
                this.fundsTotalRedemptionAmount = 0;
            }
        } else {
            this.mode = 0;
            this.filtersForm.get('dateFrom').patchValue(null, { emitEvent: false });
            this.filtersForm.get('dateTo').patchValue(null, { emitEvent: false });
            this.sharesTotalNetAmount = 0;
            this.sharesTotalSubscriptionAmount = 0;
            this.sharesTotalRedemptionAmount = 0;
            this.fundsTotalNetAmount = 0;
            this.fundsTotalSubscriptionAmount = 0;
            this.fundsTotalRedemptionAmount = 0;
        }
        if (this.filtersForm.controls['selectList'].value !== null) {
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
        } else {
            this.selectedFund = 0;
            this.selectedShare = 0;
        }

        this.dateFrom = (this.filtersForm.controls['dateFrom'].value === '' || this.filtersForm.controls['dateFrom'].value === null) ? '2000-01-01' : this.filtersForm.controls['dateFrom'].value;
        this.dateTo = ((this.filtersForm.controls['dateTo'].value === '' || this.filtersForm.controls['dateTo'].value === null) || !this.isPeriod) ? '2100-01-01' : this.filtersForm.controls['dateTo'].value;

        if (this.isFundLevel) {
            this.isFundsPayloadOK = true;
            if (this.mode > 0 && this.dateFrom !== '') {
                if (this.isPeriod && (this.dateTo === '' || this.dateTo === null)) {
                    this.isFundsPayloadOK = false;
                }
                if (this.isFundsPayloadOK) {
                    this.fundsPayload = {
                        fundId: this.selectedFund,
                        dateFrom: this.dateFrom,
                        dateTo: this.dateTo,
                        mode: this.mode,
                    };
                    this.ofiReportsService.requestCentralisationReportsFundsDetailsList(this.fundsPayload);
                }
            } else {
                this.isFundsPayloadOK = false;
                this.fundsDetails = [];
                this.pieChartDatas = [
                    {
                        name: 'Subscription (%)',
                        value: 0,
                    },
                    {
                        name: 'Redemption (%)',
                        value: 0,
                    }
                ];
            }
        }
        if (this.isShareLevel) {
            this.isSharesPayloadOK = true;
            if (this.mode > 0 && this.dateFrom !== '') {
                if (this.isPeriod && (this.dateTo === '' || this.dateTo === null)) {
                    this.isSharesPayloadOK = false;
                }
                if (this.isSharesPayloadOK) {
                    this.sharesPayload = {
                        shareId: this.selectedShare,
                        dateFrom: this.dateFrom,
                        dateTo: this.dateTo,
                        mode: this.mode,
                    };
                    this.ofiReportsService.requestCentralisationReportsSharesDetailsList(this.sharesPayload);
                }
            } else {
                this.isSharesPayloadOK = false;
                this.sharesDetails = [];
                this.pieChartDatas = [
                    {
                        name: 'Subscription (%)',
                        value: 0,
                    },
                    {
                        name: 'Redemption (%)',
                        value: 0,
                    }
                ];
            }
        }
        this.changeDetectorRef.markForCheck();
    }

    onClickViewCorrespondingOrders(id) {

        let fundname;
        let sharename;
        let searchDate;

        const searchDateType = this.getSearchDateType();

        // build the filter depending we on the fund-level page or share-level page.
        if (this.isShareLevel) {
            sharename = get(this.sharesDetails, ['shares', id, 'shareName'], '');
            searchDate = get(this.sharesDetails, ['shares', id, searchDateType], '');
        }
        // fund level
        else {
            fundname = get(this.fundsDetails, ['funds', id, 'fundName'], '');
            searchDate = get(this.fundsDetails, ['funds', id, searchDateType], '');
        }

        const orderFilters = {
            sharename,
            fundname,
            status: { id: -3 },
            type: { id: 0 },
            dateType: [{ id: this.getSearchDateType() }],
            fromDate: searchDate,
            toDate: searchDate,
        };

        this.ngRedux.dispatch({ type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS, filters: orderFilters });
        this.router.navigateByUrl('manage-orders/list');
    }

    exportCentralisationReport() {
        if (this.myDetails) {
            if (this.myDetails.userId) {
                if (this.isFundLevel && this.isFundsPayloadOK) {
                    this._fileDownloader.downLoaderFile({
                        method: 'exportCentralisationFunds',
                        token: this.memberSocketService.token,
                        fundId: this.fundsPayload.fundId,
                        dateFrom: this.fundsPayload.dateFrom,
                        dateTo: this.fundsPayload.dateTo,
                        mode: this.fundsPayload.mode,
                        userId: this.myDetails.userId,
                    });
                }
                if (this.isShareLevel && this.isSharesPayloadOK) {
                    this._fileDownloader.downLoaderFile({
                        method: 'exportCentralisationShares',
                        token: this.memberSocketService.token,
                        shareId: this.sharesPayload.shareId,
                        dateFrom: this.sharesPayload.dateFrom,
                        dateTo: this.sharesPayload.dateTo,
                        mode: this.sharesPayload.mode,
                        userId: this.myDetails.userId,
                    });
                }
            }
        }
    }

    /**
     * Get whether the search date type is "navDate" or "settlementDate", base on the search date dropdown
     * @return {'navDate' | 'settlementDate'}
     */
    getSearchDateType(): 'navDate' | 'settlementDate' {

        // get date filter value
        const curDateFilterVal = get(this.filtersForm.controls['specificDate'].value, '[0].id');
        // 0 or 2 is navDate
        if (curDateFilterVal === 0 || curDateFilterVal === 2) {
            return 'navDate';
        }

        return 'settlementDate';
    }

    ngOnDestroy() {
        // reset datagrid
        this.resetDatas();

        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
