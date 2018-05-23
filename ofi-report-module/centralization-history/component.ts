// Vendor
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {MemberSocketService} from '@setl/websocket-service';

import {NgRedux, select} from '@angular-redux/store';
import {Unsubscribe} from 'redux';
import {fromJS} from 'immutable';
/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
/* Utils. */
import {ConfirmationService, immutableHelper, NumberConverterService} from '@setl/utils';
/* Ofi service */
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';
/* Core redux */
import {ofiManageOrderActions} from '@ofi/ofi-main/ofi-store';
import {APP_CONFIG, AppConfig} from "@setl/utils/index";
import * as moment from 'moment';
import {mDateHelper} from '@setl/utils';

/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

/* Decorator. */
@Component({
    selector: 'app-am-centralization-history',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiCentralizationHistoryComponent implements OnInit, AfterViewInit, OnDestroy {

    unknownValue = '???';

    searchForm: FormGroup;
    filterForm: FormGroup;
    filterParams = {
        fundShareID: null,
        dateFrom: null,
        dateTo: null,
        dateRange: null,
    };
    hideCalendars = true;
    isValidDates = true;

    // Locale
    language = 'fr';

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };
    dateFrom: any;
    dateTo: any;

    /* Tabs Control array */
    tabsControl: Array<any> = [];
    shareID = 0;
    isFundUmbrella = true;

    centralizationReportsList: Array<any> = [];
    baseCentralizationHistory: any;
    centralizationHistory: Array<any> = [];

    /* expandable div */

    /* Ui Lists. */
    periodList: Array<SelectedItem> = [
        {id: 'custom', text: 'Choose specific dates'},
        // {id: 'inception', text: 'Since inception'},
        // {id: 'lastcutoff', text: 'Since last cut-off'},
        // {id: 'currentweek', text: 'Current week'},
        // {id: 'currentmonth', text: 'Current month'},
        // {id: 'currentquarter', text: 'Current quarter'},
        // {id: 'currentsemester', text: 'Current semester'},
        // {id: 'currentyear', text: 'Current year'},
        {id: 'week', text: 'Last week'},
        {id: 'month', text: 'Last month'},
        {id: 'quarter', text: 'Last quarter'},
        {id: 'semester', text: 'Last semester'},
        {id: 'year', text: 'Last year'},
    ];

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

    /* Private Properties. */
    private myDetails: any = {};
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;
    private appConfig: any = {};
    dataList: Array<any> = [];
    dataListForSearch: Array<any> = [];

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'requested']) requestedOfiCentralizationReportsObj;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'centralizationReportsList']) OfiCentralizationReportsListObj;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'baseCentralizationHistory']) OfiBaseCentralizationHistoryObj;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'centralizationHistory']) OfiCentralizationHistoryObj;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private ofiReportsService: OfiReportsService,
                private memberSocketService: MemberSocketService,
                private _numberConverterService: NumberConverterService,
                private _fb: FormBuilder,
                private _confirmationService: ConfirmationService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));
        this.subscriptions.push(this.OfiBaseCentralizationHistoryObj.subscribe((requested) => this.getBaseCentralizationHistoryFromRedux(requested)));
        this.subscriptions.push(this.OfiCentralizationHistoryObj.subscribe((requested) => this.getCentralizationHistoryFromRedux(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions.push(this.myDetailOb.subscribe((myDetails) => {this.myDetails = myDetails;}));

        this.createsearchForm();
        this.createFilterForm();
        // this.setInitialTabs();

        this.subscriptions.push(this.route.params.subscribe(params => {
            this.shareID = params['tabid'];
            if (typeof this.shareID !== 'undefined' && this.shareID > 0) {

                // launch only if got shareID from URL
                this.subscriptions.push(this.requestedOfiCentralizationReportsObj.subscribe((requested) => this.getCentralizationReportsRequested(requested)));
                this.subscriptions.push(this.OfiCentralizationReportsListObj.subscribe((list) => this.getCentralizationReportsListFromRedux(list)));
                this.ofiReportsService.requestBaseCentralizationHistory(this.shareID);

                const tabTitle = 'History';
                const tabAlreadyHere = this.tabsControl.find(o => o.shareId === this.shareID);
                if (tabAlreadyHere === undefined) {
                    this.tabsControl = [
                        {
                            'title': {
                                'icon': 'fa-calendar',
                                'text': tabTitle,
                            },
                            'shareId': this.shareID,
                            'active': true,
                        }
                    ];
                }
                this.setTabActive(this.shareID);
            } else {
                this.searchForm.get('search').patchValue(null, {emitEvent: false});
                this.router.navigateByUrl('/reports/centralization');
            }
        }));
    }

    public ngOnInit() {
        this.subscriptions.push(this.searchForm.valueChanges.subscribe((form) => this.requestSearch(form)));
        this.subscriptions.push(this.filterForm.valueChanges.subscribe((form) => this.requestFilters(form)));

        this.filterForm.controls['period'].setValue([this.periodList[0]]);
        
        this.dateTo = this.reformatDate(moment().add(1, 'weeks'));
        this.dateFrom = this.reformatDate(moment().subtract(1, 'weeks'));

        this.changeDetectorRef.markForCheck();
    }

    public ngAfterViewInit() {
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
        }
    }

    getCentralizationReportsRequested(requested): void {
        if (!requested) {
            OfiReportsService.defaultRequestCentralizationReportsList(this.ofiReportsService, this.ngRedux);
        }
    }

    getCentralizationReportsListFromRedux(list) {
        const listImu = fromJS(list);

        this.centralizationReportsList = listImu.reduce((result, item) => {

            result.push({
                id: item.get('fundShareID'),
                text: item.get('fundShareName'),
                // text: item.get('fundShareName') + ' - ' + item.get('isin'),
            });

            return result;
        }, []);

        if (this.centralizationReportsList.length > 0) {
            const obj = this.centralizationReportsList.find(o => o.id.toString() === this.shareID.toString());
            if (obj !== undefined) {
                this.searchForm.get('search').patchValue([{id: obj.id, text: obj.text}], {emitEvent: false});
            }
        }

        this.changeDetectorRef.markForCheck();
    }

    getBaseCentralizationHistoryFromRedux(list) {
        const listImu = fromJS(list);

        this.baseCentralizationHistory = listImu.reduce((result, item) => {

            result = {
                fundName: item.get('fundName'),
                fundShareName: item.get('fundShareName'),
                isin: item.get('isin'),
                shareClassCurrency: item.get('shareClassCurrency'),
                umbrellaFundName: (item.get('umbrellaFundName') !== '') ? item.get('umbrellaFundName') : 'None',
            };

            return result;
        }, []);


        if (this.baseCentralizationHistory.length > 0) {
            // this.baseCentralizationHistory = JSON.parse(JSON.stringify(this.baseCentralizationHistory[0]));
            this.ofiReportsService.requestCentralizationHistory({
                fundShareID: this.shareID,
                dateFrom: '',
                dateTo: '',
                dateRange: '',
            });
        }

        this.changeDetectorRef.markForCheck();
    }

    getCentralizationHistoryFromRedux(list) {
        const listImu = fromJS(list);

        this.centralizationHistory = listImu.reduce((result, item) => {

            result.push({
                walletID: item.get('walletID'),
                latestNav: item.get('latestNav'),
                navDate: (item.get('navDate') == null) ? '' : mDateHelper.convertToLocal(item.get('navDate'),'YYYY-MM-DD'),
                latestNavBackup: item.get('latestNavBackup'),
                navDateBackup: item.get('navDateBackup'),
                subQuantity: item.get('subQuantity'),
                subAmount: item.get('subAmount'),
                subSettlementDate: mDateHelper.convertToLocal(item.get('subSettlementDate'),'YYYY-MM-DD'),
                redQuantity: item.get('redQuantity'),
                redAmount: item.get('redAmount'),
                redSettlementDate: mDateHelper.convertToLocal(item.get('redSettlementDate'),'YYYY-MM-DD'),
                subCutoffDate: mDateHelper.convertToLocal(item.get('subCutoffDate'),'YYYY-MM-DD HH:mm:ss'),
                redCutoffDate: mDateHelper.convertToLocal(item.get('redCutoffDate'),'YYYY-MM-DD HH:mm:ss'),
                aum: item.get('aum'),
                netPosition: item.get('netPosition'),
                netPositionPercentage: item.get('netPositionPercentage'),
            });

            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    createsearchForm() {
        this.searchForm = this._fb.group({
            search: [
                '',
            ],
        });
    }

    createFilterForm() {
        this.filterForm = this._fb.group({
            period: [
                '',
            ],
            dateFrom: [
                '',
            ],
            dateTo: [
                '',
            ],
        });
    }

    public setTabActive(id) {
        for (const i in this.tabsControl) {
            this.tabsControl[i].active = (Number(this.tabsControl[i].shareId) === Number(id));
        }
        this.changeDetectorRef.markForCheck();
    }

    getMonday(date) {
        let d = new Date(date);
        let day = d.getDay();
        let diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    addDays(date, nb) {
        let result = new Date(date);
        result.setDate(result.getDate() + nb);
        return result;
    }

    addMonths(date, nb) {
        let result = new Date(date);
        result.setMonth(result.getMonth() + nb);
        return result;
    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    private getOnlyDate(dateString): string {
        return this.formatDate('YYYY-MM-DD', new Date(dateString)) || '';
    }

    private getOnlyTime(dateString): string {
        return this.formatDate('hh:mm:ss', new Date(dateString));
    }

    reformatDate(dateString): string {
        return this.formatDate('YYYY-MM-DD', new Date(dateString)) || '';
    }

    formatDate(formatString: string, dateObj: Date): string {
        /* Return if we're missing a param. */
        if (!formatString || !dateObj) return '';

        /* Return the formatted string. */
        return formatString
            .replace('YYYY', dateObj.getFullYear().toString())
            .replace('YY', dateObj.getFullYear().toString().slice(2, 3))
            .replace('MM', this.numPad((dateObj.getMonth() + 1).toString()))
            .replace('DD', this.numPad(dateObj.getDate().toString()))
            .replace('hh', this.numPad(dateObj.getHours()))
            .replace('hH', this.numPad(dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours()))
            .replace('mm', this.numPad(dateObj.getMinutes()))
            .replace('ss', this.numPad(dateObj.getSeconds()))
    }

    showCurrency(currency) {
        const obj = this.currencyList.find(o => o.id === currency);
        if (obj !== undefined) {
            return obj.text;
        } else {
            return currency;
        }
    }

    requestFilters(form) {
        if (this.filterForm.get('period').value && this.filterForm.get('period').value[0] && this.filterForm.get('period').value[0].id) {
            this.hideCalendars = (this.filterForm.get('period').value[0].id === 'custom') ? false : true;

            const today = new Date();
            let m: any,
                y: any,
                nbDaysInMonth: any,
                currentQuarter: any,
                currentSemester: any
            ;

            switch (this.filterForm.get('period').value[0].id) {
                // case 'lastcutoff':
                //     break;
                // case 'currentweek':
                //     this.dateFrom = this.reformatDate(this.getMonday(today));
                //     this.dateTo = this.reformatDate(today);
                //     break;
                // case 'currentmonth':
                //     m = today.getMonth() + 1;
                //     y = today.getFullYear();
                //     nbDaysInMonth = this.daysInMonth(m, y);
                //     this.dateFrom = this.reformatDate(new Date(y + '-' + m + '-' + '01'));
                //     // this.dateTo = this.reformatDate(new Date(y + '-' + m + '-' + nbDaysInMonth));
                //     this.dateTo = this.reformatDate(today);
                //     break;
                // case 'currentquarter':
                //     y = today.getFullYear();
                //     currentQuarter = Math.floor((today.getMonth() + 3) / 3) - 1;
                //     this.dateFrom = this.reformatDate(new Date(y + '-' + ((currentQuarter * 3) + 1) + '-' + '01'));
                //     this.dateTo = this.reformatDate(today);
                //     break;
                // case 'currentsemester':
                //     y = today.getFullYear();
                //     currentSemester = Math.floor((today.getMonth() + 6) / 6) - 1;
                //     this.dateFrom = this.reformatDate(new Date(y + '-' + ((currentSemester * 6) + 1) + '-' + '01'));
                //     this.dateTo = this.reformatDate(today);
                //     break;
                // case 'currentyear':
                //     y = today.getFullYear();
                //     this.dateFrom = this.reformatDate(new Date(y + '-' + '01' + '-' + '01'));
                //     this.dateTo = this.reformatDate(today);
                //     break;
                case 'week':
                    this.dateTo = this.reformatDate(today);
                    this.dateFrom = this.reformatDate(moment(today).subtract(1, 'weeks'));
                    break;
                case 'month':
                    this.dateTo = this.reformatDate(today);
                    this.dateFrom = this.reformatDate(moment(today).subtract(1, 'months'));
                    break;
                case 'quarter':
                    this.dateTo = this.reformatDate(today);
                    this.dateFrom = this.reformatDate(moment(today).subtract(1, 'quarters'));
                    break;
                case 'semester':
                    this.dateTo = this.reformatDate(today);
                    this.dateFrom = this.reformatDate(moment(today).subtract(15, 'weeks'));
                    break;
                case 'year':
                    this.dateTo = this.reformatDate(today);
                    this.dateFrom = this.reformatDate(moment(today).subtract(1, 'years'));
                    break;
            }

            // check dates are valid
            if (!this.hideCalendars && this.filterForm.get('dateFrom').value !== '' && this.filterForm.get('dateTo').value !== '') {
                const d1 = new Date(this.filterForm.get('dateFrom').value);
                const d2 = new Date(this.filterForm.get('dateTo').value);
                const validDates = (d1 <= d2);
                if (!validDates) {
                    this.isValidDates = false;
                    this.dateTo = '';
                } else {
                    this.isValidDates = true;
                }
            }

        } else {
            this.dateFrom = '';
            this.dateTo = '';
            this.hideCalendars = true;
        }


        // emitEvent = true to not propage to valueChanges
        this.filterForm.get('period').updateValueAndValidity({emitEvent: false});
        this.filterForm.get('dateFrom').updateValueAndValidity({emitEvent: false});
        this.filterForm.get('dateTo').updateValueAndValidity({emitEvent: false});

        const dateRange = (this.filterForm.get('period').value && this.filterForm.get('period').value[0] && this.filterForm.get('period').value[0].id) ? this.filterForm.get('period').value[0].id : '';

        const tmpFilterParams = {
            fundShareID: this.filterParams.fundShareID,
            dateFrom: this.filterParams.dateFrom,
            dateTo: this.filterParams.dateTo,
            dateRange: this.filterParams.dateRange,
        };

        this.filterParams = {
            fundShareID: this.shareID,
            dateFrom: (this.filterForm.get('period').value && this.filterForm.get('period').value[0] && this.filterForm.get('period').value[0].id && this.filterForm.get('period').value[0].id === 'custom') ? this.dateFrom : '',
            dateTo: (this.filterForm.get('period').value && this.filterForm.get('period').value[0] && this.filterForm.get('period').value[0].id && this.filterForm.get('period').value[0].id === 'custom') ? this.dateTo : '',
            dateRange: dateRange,
        };

        if (JSON.stringify(tmpFilterParams) !== JSON.stringify(this.filterParams)) {
            this.ofiReportsService.requestCentralizationHistory(this.filterParams);
        }
    }

    exportAllHistory(): void {
        const methodName = 'getSingleShareInfoCsv';
        const period = (this.filterForm.get('period').value && this.filterForm.get('period').value[0] && this.filterForm.get('period').value[0].id) ? this.filterForm.get('period').value[0].id : '';

        let paramUrl = 'file?token=' + this.memberSocketService.token + '&method=' + methodName + '&fundShareID=' + this.shareID + '&dateFrom=' + this.dateFrom + '&dateTo=' + this.dateTo + '&dateRange=' + period + '&userId=' + this.myDetails.userId;
        const url = this.generateExportURL(paramUrl, this.appConfig.production);
        window.open(url, '_blank');
    }

    exportHistory(historyRow): void {
        let paramUrl = 'file?token=' + this.memberSocketService.token + '&method=exportAssetManagerOrders&userId=' + this.myDetails.userId;

        if (historyRow !== undefined) {
            const cutoffDate = moment(historyRow.subCutoffDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
            const params = {
                shareName: this.centralizationReportsList[0].text,
                isin: null,
                status: null,
                orderType: null,
                pageSize: 1000,
                rowOffSet: 0,
                sortByField: 'userEntered',
                sortOrder: 'desc',
                dateSearchField: 'cutoffDate',
                fromDate: cutoffDate,
                toDate: cutoffDate + ' 23:59',
            };
            for (let filter in params) {
                if (params.hasOwnProperty(filter)) {
                    paramUrl += '&' + filter + '=' + encodeURIComponent(params[filter]);
                }
            }
            const url = this.generateExportURL(paramUrl, this.appConfig.production);
            // console.log(url);
            window.open(url, '_blank');
        }
    }

    generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` :
            `http://${window.location.hostname}:9788/${url}`;
    }

    viewOrder(cutoffDate) {
        const orderFilters = {
            filters: {
                isin: this.baseCentralizationHistory.isin,
                sharename: this.baseCentralizationHistory.fundShareName,
                status: {id : -3},
                type: {id : 0},
                dateType: {id : 'cutOffDate'},
                fromDate: moment(cutoffDate).format('YYYY-MM-DD'),
                toDate: moment(cutoffDate).format('YYYY-MM-DD')
            }
        };
        this.ngRedux.dispatch({type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS, filters: orderFilters});
        this.router.navigateByUrl('manage-orders/list');
    }

    setInitialTabs() {

        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['ofi', 'ofiOrders', 'manageOrders', 'openedTabs']);

        if (openedTabs.length === 0) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    'title': {
                        'icon': 'fa fa-th-list',
                        'text': 'List'
                    },
                    'shareId': -1,
                    'active': true
                }
            ];
            return true;
        }

        this.tabsControl = openedTabs;
    }

    requestSearch(form) {

        if (this.searchForm.get('search').value && this.searchForm.get('search').value[0] && this.searchForm.get('search').value[0].id) {
            this.buildLink(this.searchForm.get('search').value[0].id);
        } else {
            this.buildLink('list');
        }
    }

    buildLink(id) {
        const dest = 'am-reports-section/centralization-history/' + id;
        this.router.navigateByUrl(dest);
    }

    numPad(num) {
        return num < 10 ? '0' + num : num;
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    /**
     * ===============
     * Alert Functions
     * ===============
     */

    /**
     * Show Error Message
     * ------------------
     * Shows an error popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showError(message) {
        /* Show the error. */
        this.alertsService.create('error', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-danger">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Warning Message
     * ------------------
     * Shows a warning popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showWarning(message) {
        /* Show the error. */
        this.alertsService.create('warning', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-warning">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Success Message
     * ------------------
     * Shows an success popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    showSuccess(message) {
        /* Show the message. */
        this.alertsService.create('success', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-success">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

}
