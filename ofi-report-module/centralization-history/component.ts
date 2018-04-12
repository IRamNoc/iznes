// Vendor
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Unsubscribe} from 'redux';
import {fromJS} from 'immutable';

/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

/* Clarity */
import {ClrDatagridStateInterface} from '@clr/angular';

/* Utils. */
import {ConfirmationService, immutableHelper, SagaHelper, NumberConverterService, commonHelper} from '@setl/utils';

/* Selectors */


/* Core redux */


/* Ofi service */

/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

/* Decorator. */
@Component({
    selector: 'am-centralization-history',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiCentralizationHistoryComponent implements OnInit, AfterViewInit, OnDestroy {

    unknownValue = '???';

    searchForm: FormGroup;
    filterForm: FormGroup;

    /* Datagrid server driven */
    total: number;
    itemPerPage = 10;
    dataGridParams = {
        shareName: null,
        isin: null,
        status: null,
        orderType: null,
        pageSize: this.itemPerPage,
        rowOffSet: 0,
        sortByField: 'orderId', // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
        sortOrder: 'desc', // asc / desc
        dateSearchField: null,
        fromDate: null,
        toDate: null,
    };
    lastPage: number;
    // loading = true;
    loading = false; // debug

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

    /* Tabs Control array */
    tabsControl: Array<any> = [];
    shareID = 0;
    isFundUmbrella = true;

    /* expandable div */

    /* Ui Lists. */
    periodList: Array<SelectedItem> = [
        {id: 'lastcutoff', text: 'Since last cut-off'},
        {id: 'currentweek', text: 'Current week'},
        {id: 'currentmonth', text: 'Current month'},
        {id: 'currentquarter', text: 'Current quarter'},
        {id: 'currentsemester', text: 'Current semester'},
        {id: 'currentyear', text: 'Current year'},
        {id: 'lastweek', text: 'Last week'},
        {id: 'lastmonth', text: 'Last month'},
        {id: 'lastquarter', text: 'Last quarter'},
        {id: 'lastsemester', text: 'Last semester'},
        {id: 'lastyear', text: 'Last year'},
    ];

    currencyList = [
        {id : 0, code: 'EUR', label: 'Euro'},
        {id : 1, code: 'USD', label: 'US Dollar'},
        {id : 2, code: 'GBP', label: 'Pound Sterling'},
        {id : 3, code: 'CHF', label: 'Swiss Franc'},
        {id : 4, code: 'JPY', label: 'Yen'},
        {id : 5, code: 'AUD', label: 'Australian Dollar'},
        {id : 6, code: 'NOK', label: 'Norwegian Krone'},
        {id : 7, code: 'SEK', label: 'Swedish Krona'},
        {id : 8, code: 'ZAR', label: 'Rand'},
        {id : 9, code: 'RUB', label: 'Russian Ruble'},
        {id : 10, code: 'SGD', label: 'Singapore Dollar'},
        {id : 11, code: 'AED', label: 'United Arab Emirates Dirham'},
        {id : 12, code: 'CNY', label: 'Yuan Renminbi'},
        {id : 13, code: 'PLN', label: 'Zloty'},
    ];

    /* Private Properties. */
    private myDetails: any = {};
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;
    dataList: Array<any> = [];
    dataListForSearch: Array<any> = [];

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private route: ActivatedRoute,
        private router: Router,
        private _numberConverterService: NumberConverterService,
        private _fb: FormBuilder,
        private _confirmationService: ConfirmationService
    ) {
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
        });

        this.createsearchForm();
        this.createFilterForm();
        // this.setInitialTabs();

        this.subscriptions.push(this.route.params.subscribe(params => {
            this.shareID = params['tabid'];
            if (typeof this.shareID !== 'undefined' && this.shareID > 0) {
                // const share = this.dataList.find(elmt => {
                //     if (elmt.shareID.toString() === this.shareID.toString()) {
                //         return elmt;
                //     }
                // });

                // debug temp
                this.dataList = [1,2,3,4,5];
                const share = {
                    id: this.shareID,
                    label: 'blablabla',
                };
                if (share && typeof share !== 'undefined' && share !== undefined && share !== null) {
                    // this.fundShareID = order.fundShareID;
                    // this.tabsControl[0].active = false;
                    let tabTitle = 'Orders history';
                    // if (order.orderType === 3) tabTitle += 'Subscription: ';
                    // if (order.orderType === 4) tabTitle += 'Redemption: ';
                    // tabTitle += ' ' + this.padNumberLeft(this.orderID, 5);

                    this.tabsControl.push(
                        {
                            'title': {
                                'icon': 'fa-calendar',
                                'text': tabTitle,
                            },
                            'shareId': this.shareID,
                            'active': true,
                            shareData: share,
                        }
                    );

                    // this.subscriptions.push(this.requestFundShareOb.subscribe((fundShare) => this.getFundShareFromRedux(fundShare)));
                    // const requestData = getOfiFundShareCurrentRequest(this.ngRedux.getState());
                    // requestData.fundShareID = this.fundShareID;
                    // OfiFundShareService.defaultRequestFundShare(this._ofiFundShareService, this.ngRedux, requestData);
                }
            } else {
                // this.tabsControl[0].active = true;
                this.searchForm.get('search').patchValue(null, {emitEvent: false});
                // this.searchForm.get('search').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
            }
        }));

        /* for example to remove when get real datas */
        this.dataListForSearch = [
            {id: 1, text: 'Groupama Avenir Euro - MC (FR123456789)'},
            {id: 2, text: 'Ameri-Gan - IC (FR0012121212)'},
            {id: 3, text: 'G FUND ALPHA FIXED INCOME II - IC (FR015684640654654)'},
        ];
    }

    public ngOnInit() {
        this.subscriptions.push(this.searchForm.valueChanges.subscribe((form) => this.requestSearch(form)));
        this.changeDetectorRef.markForCheck();
    }

    public ngAfterViewInit() {}

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
            this.buildLink('new');
        }

        // const tmpDataGridParams = {
        //     shareName: this.dataGridParams.shareName,
        //     isin: this.dataGridParams.isin,
        //     status: this.dataGridParams.status,
        //     orderType: this.dataGridParams.orderType,
        //     pageSize: this.dataGridParams.pageSize,
        //     rowOffSet: this.dataGridParams.rowOffSet,
        //     sortByField: this.dataGridParams.sortByField,
        //     sortOrder: this.dataGridParams.sortOrder,
        //     dateSearchField: this.dataGridParams.dateSearchField,
        //     fromDate: this.dataGridParams.fromDate,
        //     toDate: this.dataGridParams.toDate,
        // };
        //
        // this.dataGridParams.shareName = (this.tabsControl[0].searchForm.get('sharename').value !== '' && this.tabsControl[0].searchForm.get('sharename').value.length > 2) ? this.tabsControl[0].searchForm.get('sharename').value : null;
        // this.dataGridParams.isin = (this.tabsControl[0].searchForm.get('isin').value !== '' && this.tabsControl[0].searchForm.get('isin').value.length > 2) ? this.tabsControl[0].searchForm.get('isin').value : null;
        // this.dataGridParams.status = (this.tabsControl[0].searchForm.get('status').value && this.tabsControl[0].searchForm.get('status').value[0] && this.tabsControl[0].searchForm.get('status').value[0].id) ? this.tabsControl[0].searchForm.get('status').value[0].id : null;
        // this.dataGridParams.orderType = (this.tabsControl[0].searchForm.get('type').value && this.tabsControl[0].searchForm.get('type').value[0] && this.tabsControl[0].searchForm.get('type').value[0].id) ? this.tabsControl[0].searchForm.get('type').value[0].id : null;
        // // date filters
        // if ((this.tabsControl[0].searchForm.get('dateType').value && this.tabsControl[0].searchForm.get('dateType').value[0] && this.tabsControl[0].searchForm.get('dateType').value[0].id)) {
        //     const tmpDateSearchField = (this.tabsControl[0].searchForm.get('dateType').value && this.tabsControl[0].searchForm.get('dateType').value[0] && this.tabsControl[0].searchForm.get('dateType').value[0].id) ? this.tabsControl[0].searchForm.get('dateType').value[0].id : null;
        //     const tmpFromDate = (this.tabsControl[0].searchForm.get('fromDate').value !== '' && !isNaN(Date.parse(this.tabsControl[0].searchForm.get('fromDate').value))) ? this.tabsControl[0].searchForm.get('fromDate').value : null;
        //     let tmpToDate = (this.tabsControl[0].searchForm.get('toDate').value !== '' && !isNaN(Date.parse(this.tabsControl[0].searchForm.get('toDate').value))) ? this.tabsControl[0].searchForm.get('toDate').value : null;
        //     if (tmpFromDate !== null && tmpToDate !== null) {
        //         let toDate = new Date(this.tabsControl[0].searchForm.get('toDate').value);
        //         toDate.setDate(toDate.getDate() + 1);
        //         tmpToDate = toDate.toISOString().substring(0, 10);
        //     }
        //     if (tmpDateSearchField !== null && tmpFromDate !== null && tmpToDate !== null) {
        //         this.dataGridParams.dateSearchField = tmpDateSearchField;
        //         this.dataGridParams.fromDate = tmpFromDate;
        //         this.dataGridParams.toDate = tmpToDate;
        //     }
        // } else {
        //     this.dataGridParams.dateSearchField = null;
        //     this.dataGridParams.fromDate = null;
        //     this.dataGridParams.toDate = null;
        // }
        //
        // if (JSON.stringify(tmpDataGridParams) !== JSON.stringify(this.dataGridParams)) {
        //     this.getAmOrdersList();
        // }
    }

    buildLink(id) {
        const dest = 'am-reports-section/centralization-history/' + id;
        this.router.navigateByUrl(dest);
    }

    refresh(state: ClrDatagridStateInterface) {
        let filters: {[prop: string]: any[]} = {};
        if (state.filters) {
            for (const filter of state.filters) {
                const {property, value} = <{property: string, value: string}>filter;
                filters[property] = [value];
            }
        }

        console.log('state page', state.page);
        console.log('page asked', state.page.from);
        console.log('sort', state.sort);
        console.log('raw filters', state.filters);
        console.log('map filters', filters);

        // const tmpDataGridParams = {
        //     shareName: this.dataGridParams.shareName,
        //     status: this.dataGridParams.status,
        //     orderType: this.dataGridParams.orderType,
        //     pageSize: this.dataGridParams.pageSize,
        //     rowOffSet: this.dataGridParams.rowOffSet,
        //     sortByField: this.dataGridParams.sortByField,
        //     sortOrder: this.dataGridParams.sortOrder,
        //     dateSearchField: this.dataGridParams.dateSearchField,
        //     fromDate: this.dataGridParams.fromDate,
        //     toDate: this.dataGridParams.toDate,
        // };
        //
        // if (state.sort) {
        //     switch (state.sort.by) {
        //         // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
        //         case 'orderRef':
        //             this.dataGridParams.sortByField = 'orderId';
        //             break;
        //         case 'investor':
        //             this.dataGridParams.sortByField = 'investorWalletID';
        //             break;
        //         case 'orderType':
        //             this.dataGridParams.sortByField = 'orderType';
        //             break;
        //         case 'isin':
        //             this.dataGridParams.sortByField = 'isin';
        //             break;
        //         case 'shareName':
        //             this.dataGridParams.sortByField = 'shareName';
        //             break;
        //         case 'shareCurrency':
        //             this.dataGridParams.sortByField = 'currency';
        //             break;
        //         case 'quantity':
        //             this.dataGridParams.sortByField = 'quantity';
        //             break;
        //         case 'grossAmount':
        //             this.dataGridParams.sortByField = 'amountWithCost';
        //             break;
        //         case 'orderDate':
        //             this.dataGridParams.sortByField = 'orderDate';
        //             break;
        //         case 'cutOffDate':
        //             this.dataGridParams.sortByField = 'cutoffDate';
        //             break;
        //         case 'settlementDate':
        //             this.dataGridParams.sortByField = 'settlementDate';
        //             break;
        //         case 'orderStatus':
        //             this.dataGridParams.sortByField = 'orderStatus';
        //             break;
        //     }
        //     this.dataGridParams.sortOrder = (!state.sort.reverse) ? 'asc' : 'desc';
        // }

        // this.dataGridParams.pageSize =  this.itemPerPage;
        // this.dataGridParams.rowOffSet = (state.page.from / this.itemPerPage);
        //
        // // send request only if changes
        // if (JSON.stringify(tmpDataGridParams) !== JSON.stringify(this.dataGridParams)) {
        //     this.loading = true;
        //     this.getAmOrdersList();
        // }

        this.changeDetectorRef.markForCheck();
    }

    /**
     * Num Pad
     *
     * @param num
     * @returns {string}
     */
    private numPad(num) {
        return num < 10 ? "0" + num : num;
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (let key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
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
