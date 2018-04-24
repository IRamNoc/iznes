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


/* services */
import {MemberSocketService} from '@setl/websocket-service';
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';

/* store */
import {ofiAmHoldersActions} from '@ofi/ofi-main/ofi-store';

/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

/* Decorator. */
@Component({
    selector: 'am-share-holders',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ShareHoldersComponent implements OnInit, AfterViewInit, OnDestroy {

    unknownValue = '???';

    searchListForm: FormGroup;
    searchInShareForm: FormGroup;

    /* Datagrid server driven */
    total: number;
    itemPerPage = 10;
    dataGridParams = {
        shareName: null,
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

    /* expandable div */

    /* Ui Lists. */
    topHolders: Array<SelectedItem> = [
        {id: '80%', text: 'Top 80% holders'},
        {id: '10', text: 'Top 10 holders'},
        {id: '20', text: 'Top 20 holders'},
        {id: '50', text: 'Top 50 holders'},
        {id: '100', text: 'Top 100 holders'},
    ];

    currencyList = [
        {id : 0, text: 'EUR'},
        {id : 1, text: 'USD'},
        {id : 2, text: 'GBP'},
        {id : 3, text: 'CHF'},
        {id : 4, text: 'JPY'},
        {id : 5, text: 'AUD'},
        {id : 6, text: 'NOK'},
        {id : 7, text: 'SEK'},
        {id : 8, text: 'ZAR'},
        {id : 9, text: 'RUB'},
        {id : 10, text: 'SGD'},
        {id : 11, text: 'AED'},
        {id : 12, text: 'CNY'},
        {id : 13, text: 'PLN'},
    ];

    /* Private Properties. */
    private myDetails: any = {};
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;
    dataList: Array<any> = [];
    dataListForSearch: Array<any> = [];
    holdersList: Array<any> = [];

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['ofi', 'ofiReports', 'amHolders', 'requested']) requestedOfiAmHoldersObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'amHoldersList']) OfiAmHoldersListObj;

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private route: ActivatedRoute,
        private router: Router,
        private _numberConverterService: NumberConverterService,
        private _fb: FormBuilder,
        private memberSocketService: MemberSocketService,
        private ofiReportsService: OfiReportsService,
        private _confirmationService: ConfirmationService
    ) {
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
        });

        this.subscriptions.push(this.requestedOfiAmHoldersObj.subscribe((requested) => this.getAmHoldersRequested(requested)));
        this.subscriptions.push(this.OfiAmHoldersListObj.subscribe((list) => this.getAmHoldersListFromRedux(list)));

        this.createSearchListForm();
        this.createSearchInShareForm();
        this.setInitialTabs();

        this.subscriptions.push(this.route.params.subscribe(params => {
            this.shareID = params['tabid'];
            if (typeof this.shareID !== 'undefined' && this.shareID > 0) {
                // const share = this.dataList.find(elmt => {
                //     if (elmt.shareID.toString() === this.shareID.toString()) {
                //         return elmt;
                //     }
                // });

                // debug temp
                const share = {
                    id: this.shareID,
                    label: 'balblabla',
                };
                if (share && typeof share !== 'undefined' && share !== undefined && share !== null) {
                    // this.fundShareID = order.fundShareID;
                    this.tabsControl[0].active = false;
                    let tabTitle = 'TEMP TITLE';
                    // if (order.orderType === 3) tabTitle += 'Subscription: ';
                    // if (order.orderType === 4) tabTitle += 'Redemption: ';
                    // tabTitle += ' ' + this.padNumberLeft(this.orderID, 5);

                    if (this.tabsControl.length > 1) {
                        this.tabsControl.splice(1, this.tabsControl.length - 1);
                    }

                    this.tabsControl.push(
                        {
                            'title': {
                                'icon': 'fa-sitemap',
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
                if (this.tabsControl.length > 1) {
                    this.tabsControl.splice(1, this.tabsControl.length - 1);
                }
                this.tabsControl[0].active = true;
                this.searchListForm.get('search').patchValue(null, {emitEvent: false});
                // this.searchListForm.get('search').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
            }
        }));
    }

    public ngOnInit() {
        this.subscriptions.push(this.searchListForm.valueChanges.subscribe((form) => this.requestSearch(form)));
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

    getAmHoldersRequested(requested): void {
        if (!requested) {
            OfiReportsService.defaultRequestAmHoldersList(this.ofiReportsService, this.ngRedux);
        }
    }

    getAmHoldersListFromRedux(list) {
        const listImu = fromJS(list);

        this.holdersList = listImu.reduce((result, item) => {

            result.push({
                fundId: item.get('fundId'),
                fundName: item.get('fundName'),
                fundLei: item.get('fundLei'),
                fundCurrency: item.get('fundCurrency'),
                fundAum: item.get('fundAum'),
                fundHolderNumber: item.get('fundHolderNumber'),
                shareId: item.get('shareId'),
                shareName: item.get('shareName'),
                shareIsin: item.get('shareIsin'),
                shareNav: item.get('shareNav'),
                shareUnitNumber: item.get('shareUnitNumber'),
                shareCurrency: item.get('shareCurrency'),
                shareAum: item.get('shareAum'),
                shareHolderNumber: item.get('shareHolderNumber'),
                shareRatio: item.get('shareRatio'),
            });

            return result;
        }, []);

        // hardcoded
        this.holdersList = [{
            'fundId': 1,
            'fundName': 'fund1',
            'fundLei': '',
            'fundCurrency': '',
            'fundAum': 15000,
            'fundHolderNumber': 3,
            'shareId': '',
            'shareName': '',
            'shareIsin': '',
            'shareNav': 0,
            'shareUnitNumber': 0,
            'shareCurrency': '',
            'shareAum': 0,
            'shareHolderNumber': 0,
            'isFund': true,
            'shareRatio': 0
        }, {
            'fundId': 1,
            'fundName': 'fund1',
            'fundLei': '',
            'fundCurrency': '',
            'fundAum': 0,
            'fundHolderNumber': 0,
            'shareId': 1,
            'shareName': 'fundshare 1',
            'shareIsin': 'fundshare 1',
            'shareNav': 10,
            'shareUnitNumber': 1500,
            'shareCurrency': '',
            'shareAum': 15000,
            'shareHolderNumber': 2,
            'isFund': false,
            'shareRatio': 100
        }, {
            'fundId': 1,
            'fundName': 'fund1',
            'fundLei': '',
            'fundCurrency': '',
            'fundAum': 0,
            'fundHolderNumber': 0,
            'shareId': 2,
            'shareName': 'fund share 2',
            'shareIsin': 'isin fund share 2',
            'shareNav': 0,
            'shareUnitNumber': 800,
            'shareCurrency': '',
            'shareAum': 0,
            'shareHolderNumber': 1,
            'isFund': false,
            'shareRatio': 0
        }, {
            'fundId': 2,
            'fundName': 'fund2',
            'fundLei': '',
            'fundCurrency': '',
            'fundAum': 0,
            'fundHolderNumber': 1,
            'shareId': '',
            'shareName': '',
            'shareIsin': '',
            'shareNav': 0,
            'shareUnitNumber': 0,
            'shareCurrency': '',
            'shareAum': 0,
            'shareHolderNumber': 0,
            'isFund': true,
            'shareRatio': 0
        }, {
            'fundId': 2,
            'fundName': 'fund2',
            'fundLei': '',
            'fundCurrency': '',
            'fundAum': 0,
            'fundHolderNumber': 0,
            'shareId': 3,
            'shareName': 'fund2-share1',
            'shareIsin': 'fund2-share1-isin',
            'shareNav': 0,
            'shareUnitNumber': 100,
            'shareCurrency': '',
            'shareAum': 0,
            'shareHolderNumber': 1,
            'isFund': false,
            'shareRatio': 0
        }];

        for (const holder of this.holdersList) {
            if (!holder.isFund) {
                this.dataListForSearch.push({
                    id: holder.shareId,
                    text: holder.fundName + ' - ' + holder.shareName + ' (' + holder.shareIsin + ')',
                });
            }
        }

        // this.subscriptions.push(this.searchForm.valueChanges.subscribe((form) => this.requestSearch(form)));

        this.changeDetectorRef.markForCheck();
    }

    createSearchListForm() {
        this.searchListForm = this._fb.group({
            search: [
                '',
            ],
        });
    }

    createSearchInShareForm() {
        this.searchInShareForm = this._fb.group({
            top: [
                '',
            ],
            dateUsed: [
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

        if (this.searchListForm.get('search').value && this.searchListForm.get('search').value[0] && this.searchListForm.get('search').value[0].id) {
            this.buildLink(this.searchListForm.get('search').value[0].id);
        } else {
            this.buildLink('new');
        }
    }

    buildLink(id) {
        const dest = 'reports/holders-list/' + id;
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

        this.changeDetectorRef.markForCheck();
    }

    exportHolders() {
        const paramUrl = 'file?token=' + this.memberSocketService.token + '&method=exportAssetManagerHolders&userId=' + this.myDetails.userId;
        const url = this.generateExportURL(paramUrl, false);
        window.open(url, '_blank');
    }

    generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` :
            `http://${window.location.hostname}:9788/${url}`;
    }

    showCurrency(order) {
        const obj = this.currencyList.find(o => o.id === order.currency);
        if (obj !== undefined) {
            return obj.text;
        } else {
            return 'Not found!';
        }
    }

    /**
     * Num Pad
     *
     * @param num
     * @returns {string}
     */
    private numPad(num) {
        return num < 10 ? '0' + num : num;
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
