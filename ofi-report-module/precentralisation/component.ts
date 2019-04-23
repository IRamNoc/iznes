import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MemberSocketService } from '@setl/websocket-service';
import { NgRedux, select } from '@angular-redux/store';
import { fromJS } from 'immutable';
/* Utils. */
import { ConfirmationService, NumberConverterService, mDateHelper } from '@setl/utils';
import { APP_CONFIG, AppConfig, FileDownloader } from '@setl/utils/index';
/* Alerts and confirms. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ActivatedRoute, Router } from '@angular/router';
/* Clarity */
/* services */
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
/* store */
import { ofiManageOrderActions } from '@ofi/ofi-main/ofi-store';
import * as moment from 'moment';
import { MultilingualService } from '@setl/multilingual';
import { get } from 'lodash';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrecentralisationReportComponent implements OnInit, OnDestroy {
    filtersForm: FormGroup;

    fundsUrl = '/reports/precentralisation/funds';
    sharesUrl = '/reports/precentralisation/shares';

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
            // make sure the dateFrom that greater than dateTo can not be selected
            if (!!thisDate && this.filtersForm.controls['dateTo'].value !== '') {
                return (thisDate.diff(this.filtersForm.controls['dateTo'].value) > 0);
            }
            return false;
        },
    };
    toConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            // make sure the dateTo that less than dateFrom can not be selected
            if (!!thisDate && this.filtersForm.controls['dateFrom'].value !== '') {
                return (thisDate.diff(this.filtersForm.controls['dateFrom'].value) < 0);
            }
            return false;
        },
    };

    fundSpecificDates = [];
    isPeriod = true;
    isSettlementSelected = true;

    private myDetails: any = {};
    private appConfig: any = {};
    private subscriptions: Array<any> = [];

    fundsList: Array<any> = [];
    selectedFund = 0;
    sharesList: Array<any> = [];
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

    pieChartDatas: any = {};
    customColors: any = [];

    colorScheme = { domain: ['#51AD5B', '#AF2418'] };

    fundsPayload: any;
    isFundsPayloadOK: any;
    sharesPayload: any;
    isSharesPayloadOK: any;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;

    // share list for ng-select
    @select(['ofi', 'ofiReports', 'precentralisationReports', 'requestedFundsList']) requestedFundsListOb;
    @select(['ofi', 'ofiReports', 'precentralisationReports', 'fundsList']) fundsListOb;

    // shares details
    @select(['ofi', 'ofiReports', 'precentralisationReports', 'fundsDetailsList']) fundsDetailsListOb;

    // share list for ng-select
    @select(['ofi', 'ofiReports', 'precentralisationReports', 'requestedSharesList']) requestedSharesListOb;
    @select(['ofi', 'ofiReports', 'precentralisationReports', 'sharesList']) sharesListOb;

    // shares details
    @select(['ofi', 'ofiReports', 'precentralisationReports', 'sharesDetailsList']) sharesDetailsListOb;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder,
                private memberSocketService: MemberSocketService,
                private ofiReportsService: OfiReportsService,
                private alerts: AlertsService,
                private confirmationService: ConfirmationService,
                private numberConverterService: NumberConverterService,
                private fileDownloader: FileDownloader,
                public translate: MultilingualService,
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
                name: `${this.translate.translate('Subscription')} (%)`,
                value: 0,
            },
            {
                name: `${this.translate.translate('Redemption')} (%)`,
                value: 0,
            },
        ];

        this.customColors = [
            {
                name: `${this.translate.translate('Subscription')} (%)`,
                value: '#51AD5B',
            },
            {
                name: `${this.translate.translate('Redemption')} (%)`,
                value: '#AF2418',
            },
        ];

        this.isFundLevel = (this.router.url.indexOf('/precentralisation/funds') !== -1) ? true : false;
        this.isShareLevel = (this.router.url.indexOf('/precentralisation/shares') !== -1) ? true : false;

        if (!this.isFundLevel && !this.isShareLevel) {
            this.router.navigateByUrl('/reports/precentralisation/funds');
        }

        this.fundSpecificDates = [
            { id: 0, text: translate.translate('Specific NAV Date') },
            { id: 1, text: translate.translate('Specific Settlement Date') },
            { id: 2, text: translate.translate('Specific NAV Period') },
            { id: 3, text: translate.translate('Specific Settlement Period') },
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
                if (this.fundsDetails.totals) {
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
                            name: `${this.translate.translate('Subscription')} (%)`,
                            value: (this.fundsTotalSubscriptionAmount * 100 / (this.fundsTotalSubscriptionAmount + this.fundsTotalRedemptionAmount)),
                        },
                        {
                            name: `${this.translate.translate('Redemption')} (%)`,
                            value: (this.fundsTotalRedemptionAmount * 100 / (this.fundsTotalSubscriptionAmount + this.fundsTotalRedemptionAmount)),
                        },
                    ];
                } else {
                    // this.fundsDetails = [];
                    this.fundsTotalNetAmount = 0;
                    this.fundsTotalSubscriptionAmount = 0;
                    this.fundsTotalRedemptionAmount = 0;
                    this.pieChartDatas = [
                        {
                            name: `${this.translate.translate('Subscription')} (%)`,
                            value: 0,
                        },
                        {
                            name: `${this.translate.translate('Redemption')} (%)`,
                            value: 0,
                        },
                    ];
                }
                this.changeDetectorRef.markForCheck();
            }));
        }

        if (this.isShareLevel) {
            // share list for ng-select
            this.subscriptions.push(this.requestedSharesListOb.subscribe(requestedSharesList => this.requestedSharesListFromRedux(requestedSharesList)));
            this.subscriptions.push(this.sharesListOb.subscribe(sharesList => this.getSharesListFromRedux(sharesList)));

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
                            name: `${this.translate.translate('Subscription')} (%)`,
                            value: (this.sharesTotalSubscriptionAmount * 100 / (this.sharesTotalSubscriptionAmount + this.sharesTotalRedemptionAmount)),
                        },
                        {
                            name: `${this.translate.translate('Redemption')} (%)`,
                            value: (this.sharesTotalRedemptionAmount * 100 / (this.sharesTotalSubscriptionAmount + this.sharesTotalRedemptionAmount)),
                        },
                    ];
                } else {
                    // this.sharesDetails = [];
                    this.sharesTotalNetAmount = 0;
                    this.sharesTotalSubscriptionAmount = 0;
                    this.sharesTotalRedemptionAmount = 0;
                    this.pieChartDatas = [
                        {
                            name: `${this.translate.translate('Subscription')} (%)`,
                            value: 0,
                        },
                        {
                            name: `${this.translate.translate('Redemption')} (%)`,
                            value: 0,
                        },
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
                name: `${this.translate.translate('Subscription')} (%)`,
                value: 0,
            },
            {
                name: `${this.translate.translate('Redemption')} (%)`,
                value: 0,
            },
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
            OfiReportsService.defaultRequestPrecentralisationReportsFundsList(this.ofiReportsService, this.ngRedux);
        }
    }

    getFundsListFromRedux(fundsList) {
        const listImu = fromJS(fundsList);

        this.fundsList = listImu.reduce(
            (result, item) => {
                const isLei = (item.get('lei') === '' || item.get('lei') === null) ? '' : ' (' + item.get('isin') + ')';
                result.push({
                    id: item.get('fundId'),
                    text: item.get('fundName') + isLei,
                });

                return result;
            },
            [],
        );

        if (this.fundsList.length > 0 && this.fundsPayload) {
            // console.log('fundsPayload', this.fundsPayload);
            this.ofiReportsService.requestPrecentralisationReportsFundsDetailsList(this.fundsPayload);
        }

        this.changeDetectorRef.markForCheck();
    }

    requestedSharesListFromRedux(requestedSharesList): void {
        if (!requestedSharesList) {
            OfiReportsService.defaultRequestPrecentralisationReportsSharesList(this.ofiReportsService, this.ngRedux);
        }
    }

    getSharesListFromRedux(sharesList) {
        const listImu = fromJS(sharesList);

        this.sharesList = listImu.reduce(
            (result, item) => {
                const isIsin = (item.get('isin') === '' || item.get('isin') === null) ? '' : ' (' + item.get('isin') + ')';
                result.push({
                    id: item.get('shareId'),
                    text: item.get('shareName') + isIsin,
                });

                return result;
            },
            [],
        );

        if (this.sharesList.length > 0 && this.sharesPayload) {
            // console.log('sharesPayload', this.sharesPayload);
            this.ofiReportsService.requestPrecentralisationReportsSharesDetailsList(this.sharesPayload);
        }

        this.changeDetectorRef.markForCheck();
    }

    updateFiltersForm() {
        const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
        const nextWeek = moment().add(1, 'week').format('YYYY-MM-DD');
        this.filtersForm.get('specificDate').patchValue(
            [{
                id: 3,
                text: this.translate.translate('Specific Settlement Period'),
            }],
            { emitEvent: false },
        );
        this.filtersForm.get('dateFrom').patchValue(yesterday, { emitEvent: false });
        this.filtersForm.get('dateTo').patchValue(nextWeek, { emitEvent: false });
        this.filtersForm.get('specificDate').updateValueAndValidity();
        this.filtersForm.get('dateFrom').updateValueAndValidity();
        this.filtersForm.get('dateTo').updateValueAndValidity();
        this.changeDetectorRef.markForCheck();
    }

    createFiltersForm() {
        const today = new Date();
        const yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().slice(0, 10);
        const nextWeek = new Date(today.setDate(today.getDate() + 7)).toISOString().slice(0, 10);
        this.filtersForm = this.fb.group({
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
        this.dateFrom = yesterday;
        this.dateTo = nextWeek;
        this.filtersForm.get('specificDate').patchValue(
            [{
                id: 2,
                text: this.translate.translate('Specific NAV Period'),
            }],
            { emitEvent: false },
        );
        this.filtersForm.get('dateFrom').patchValue(yesterday, { emitEvent: false });
        this.filtersForm.get('dateTo').patchValue(nextWeek, { emitEvent: false });
        this.filtersForm.get('specificDate').updateValueAndValidity();
        this.filtersForm.get('dateFrom').updateValueAndValidity();
        this.filtersForm.get('dateTo').updateValueAndValidity();
        this.subscriptions.push(this.filtersForm.valueChanges.debounceTime(1000).subscribe(form => this.requestSearch(form)));
        this.changeDetectorRef.markForCheck();
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
        this.dateTo = (!this.isPeriod ? '' : (this.filtersForm.controls['dateTo'].value === '' || this.filtersForm.controls['dateTo'].value === null) ? '2100-01-01' : this.filtersForm.controls['dateTo'].value);

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
                    this.ofiReportsService.requestPrecentralisationReportsFundsDetailsList(this.fundsPayload);
                }
            } else {
                this.isFundsPayloadOK = false;
                this.fundsDetails = [];
                this.pieChartDatas = [
                    {
                        name: `${this.translate.translate('Subscription')} (%)`,
                        value: 0,
                    },
                    {
                        name: `${this.translate.translate('Redemption')} (%)`,
                        value: 0,
                    },
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
                    this.ofiReportsService.requestPrecentralisationReportsSharesDetailsList(this.sharesPayload);
                }
            } else {
                this.isSharesPayloadOK = false;
                this.sharesDetails = [];
                this.pieChartDatas = [
                    {
                        name: `${this.translate.translate('Subscription')} (%)`,
                        value: 0,
                    },
                    {
                        name: `${this.translate.translate('Redemption')} (%)`,
                        value: 0,
                    },
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
        this.router.navigateByUrl('manage-orders');
    }

    exportPrecentralisationReport() {
        if (this.myDetails) {
            if (this.myDetails.userId) {
                if (this.isFundLevel && this.isFundsPayloadOK) {
                    this.fileDownloader.downLoaderFile({
                        method: 'exportPrecentralisationFunds',
                        token: this.memberSocketService.token,
                        fundId: this.fundsPayload.fundId,
                        dateFrom: this.fundsPayload.dateFrom,
                        dateTo: this.fundsPayload.dateTo,
                        mode: this.fundsPayload.mode,
                        userId: this.myDetails.userId,
                    });
                }
                if (this.isShareLevel && this.isSharesPayloadOK) {
                    this.fileDownloader.downLoaderFile({
                        method: 'exportPrecentralisationShares',
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
