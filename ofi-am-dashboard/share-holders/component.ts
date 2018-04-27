// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {NgRedux, select} from '@angular-redux/store';
/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
/* Clarity */
import {ClrDatagridStateInterface} from '@clr/angular';
/* Utils. */
import {immutableHelper, NumberConverterService} from '@setl/utils';
/* services */
import {MemberSocketService} from '@setl/websocket-service';
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';
import {Subscription} from 'rxjs/Subscription';

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

export class ShareHoldersComponent implements OnInit, OnDestroy {
    searchListForm: FormGroup;
    searchInShareForm: FormGroup;

    /* Datagrid server driven */
    total: number;
    itemPerPage = 10;
    // dataGridParams = {
    //     shareName: null,
    //     status: null,
    //     orderType: null,
    //     pageSize: this.itemPerPage,
    //     rowOffSet: 0,
    //     sortByField: 'orderId', // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
    //     sortOrder: 'desc', // asc / desc
    //     dateSearchField: null,
    //     fromDate: null,
    //     toDate: null,
    // };
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
    holderFilters: Array<SelectedItem> = [
        {id: 1, text: 'All'},
        {id: 2, text: 'Top 10 holders'},
        {id: 3, text: 'Top 20 holders'},
        {id: 4, text: 'Top 50 holders'},
        {id: 5, text: 'Top 100 holders'},
    ];

    shareTabTitle: string;
    // dataList: Array<any> = [];
    dataListForSearch: Array<any> = [];
    holdersList: Array<any> = [];
    holderDetail: any;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['ofi', 'ofiReports', 'amHolders', 'requested']) requestedOfiAmHoldersObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'amHoldersList']) OfiAmHoldersListObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'holderDetailRequested']) requestedHolderDetailObs;
    @select(['ofi', 'ofiReports', 'amHolders', 'shareHolderDetail']) holderDetailObs;

    /* Private Properties. */
    private myDetails: any = {};
    private subscriptions: Array<any> = [];

    /**
     * Constructor
     *
     * @param {NgRedux<any>} ngRedux
     * @param {ChangeDetectorRef} changeDetectorRef
     * @param {AlertsService} alertsService
     * @param {ActivatedRoute} route
     * @param {Router} router
     * @param {NumberConverterService} _numberConverterService
     * @param {FormBuilder} _fb
     * @param {MemberSocketService} memberSocketService
     * @param {OfiReportsService} ofiReportsService
     */
    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private route: ActivatedRoute,
        private router: Router,
        private _numberConverterService: NumberConverterService,
        private _fb: FormBuilder,
        private memberSocketService: MemberSocketService,
        private ofiReportsService: OfiReportsService
    ) {
        // Reset holders' list and holder detail object
        OfiReportsService.setRequestedAmHoldersList(false, this.ngRedux);
        OfiReportsService.setRequestedHolderDetail(false, this.ngRedux);

        //
        this.shareTabTitle = '';
        this.createSearchListForm();
        this.createSearchInShareForm();
        this.setInitialTabs();
    }

    ngOnInit() {
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));
        this.subscriptions.push(this.myDetailOb.subscribe((myDetails) => this.getUserDetails(myDetails)));
        this.subscriptions.push(this.requestedOfiAmHoldersObj.subscribe((requested) => this.getAmHoldersRequested(requested)));
        this.subscriptions.push(this.OfiAmHoldersListObj.subscribe((list) => this.getAmHoldersListFromRedux(list)));

        this.subscriptions.push(this.route.params.subscribe(params => {
            this.shareID = Number(params['tabid']);

            if (typeof this.shareID !== 'undefined' && this.shareID > 0) {
                const share = this.holdersList.find((item) => item.shareId === this.shareID);

                if (share && typeof share !== 'undefined' && share !== undefined && share !== null) {
                    this.tabsControl[0].active = false;
                    this.shareTabTitle = `${share.shareName} - ${share.shareIsin}`;

                    if (this.tabsControl.length > 1) {
                        this.tabsControl.splice(1, this.tabsControl.length - 1);
                    }

                    this.tabsControl.push(
                        {
                            'title': {
                                'icon': 'fa-sitemap',
                                'text': 'Share view',
                            },
                            'active': true,
                            shareData: share,
                        }
                    );
                }
            } else {
                if (this.tabsControl.length > 1) {
                    this.tabsControl.splice(1, this.tabsControl.length - 1);
                }

                this.tabsControl[0].active = true;
                this.searchListForm.get('search').patchValue(null, {emitEvent: false});
            }
        }));

        this.subscriptions.push(this.searchListForm.valueChanges.subscribe((form) => this.requestSearch(form)));
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        this.changeDetectorRef.detach();

        this.subscriptions.map((subscription: Subscription) => {
            return subscription.unsubscribe();
        });
    }

    /**
     * Get the selected language set by the authenticated user from redux
     *
     * @param requested
     */
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

    /**
     * Get the authenticated user's details
     *
     * @param userDetails
     */
    getUserDetails(userDetails) {
        this.myDetails = userDetails;
    }

    /**
     * Run the process for requesting the list of holders
     *
     * @param requested
     */
    getAmHoldersRequested(requested): void {
        if (!requested) {
            OfiReportsService.defaultRequestAmHoldersList(this.ofiReportsService, this.ngRedux);
        }
    }

    /**
     * Get the actual list of holders from redux
     *
     * @param holderList
     */
    getAmHoldersListFromRedux(holderList) {
        if (holderList) {
            this.holdersList = holderList.toJS() || [];

            this.dataListForSearch = this.holdersList.filter(it => !it.isFund).map((holder) => {
                return {
                    id: holder.shareId,
                    text: holder.fundName + ' - ' + holder.shareName + ' (' + holder.shareIsin + ')',
                };
            });

            this.changeDetectorRef.markForCheck();
        }
    }

    /**
     * Get detail of holders for a given share id
     *
     * @param holderDetail
     */
    getHolderDetailData(holderDetail) {
        if (holderDetail) {
            this.holderDetail = holderDetail.toJS() || [];
            this.changeDetectorRef.markForCheck();
        }
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
                        'text': 'All shares'
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
        console.clear();

        // Reset the flag for getting holder detail
        // OfiReportsService.setRequestedHolderDetail(false, this.ngRedux);

        if (
            this.searchListForm.get('search').value &&
            this.searchListForm.get('search').value[0] &&
            this.searchListForm.get('search').value[0].id
        ) {
            const shareId = this.searchListForm.get('search').value[0].id;

            const payload = {
                shareId,
                selectedFilter: 1
            };

            OfiReportsService.defaultRequestHolderDetail(this.ofiReportsService, this.ngRedux, payload);

            this.buildLink(shareId);
        } else {
            this.buildLink('0');
        }
    }

    buildLink(id) {
        this.router.navigateByUrl(`reports/holders-list/${id}`);
    }

    refresh(state: ClrDatagridStateInterface) {
        let filters: { [prop: string]: any[] } = {};

        if (state.filters) {
            for (const filter of state.filters) {
                const {property, value} = <{ property: string, value: string }>filter;
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

    /**
     * Export the global list of holders to CSV
     */
    handleHoldersExportButtonClick(): void {
        const paramUrl = `file?token=${this.memberSocketService.token}&userId=${this.myDetails.userId}&method=exportAssetManagerHolders`;
        const url = this.generateExportURL(paramUrl, false);

        window.open(url, '_blank');
    }

    private generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` : `http://${window.location.hostname}:9788/${url}`;
    }

    // showCurrency(order) {
    //     const obj = this.currencyList.find(o => o.id === order.currency);
    //     if (obj !== undefined) {
    //         return obj.text;
    //     } else {
    //         return 'Not found!';
    //     }
    // }

    // /**
    //  * Show Success Message
    //  * ------------------
    //  * Shows an success popup.
    //  *
    //  * @param  {message} string - the string to be shown in the message.
    //  * @return {void}
    //  */
    // showSuccess(message) {
    //     /* Show the message. */
    //     this.alertsService.create('success', `
    //           <table class="table grid">
    //               <tbody>
    //                   <tr>
    //                       <td class="text-center text-success">${message}</td>
    //                   </tr>
    //               </tbody>
    //           </table>
    //       `);
    // }
    //
    // /**
    //  * ===============
    //  * Alert Functions
    //  * ===============
    //  */
    //
    // /**
    //  * Num Pad
    //  *
    //  * @param num
    //  * @returns {string}
    //  */
    // private numPad(num) {
    //     return num < 10 ? '0' + num : num;
    // }
    //
    // /**
    //  * Show Error Message
    //  * ------------------
    //  * Shows an error popup.
    //  *
    //  * @param  {message} string - the string to be shown in the message.
    //  * @return {void}
    //  */
    // private showError(message) {
    //     /* Show the error. */
    //     this.alertsService.create('error', `
    //           <table class="table grid">
    //               <tbody>
    //                   <tr>
    //                       <td class="text-center text-danger">${message}</td>
    //                   </tr>
    //               </tbody>
    //           </table>
    //       `);
    // }
    //
    // /**
    //  * Show Warning Message
    //  * ------------------
    //  * Shows a warning popup.
    //  *
    //  * @param  {message} string - the string to be shown in the message.
    //  * @return {void}
    //  */
    // private showWarning(message) {
    //     /* Show the error. */
    //     this.alertsService.create('warning', `
    //           <table class="table grid">
    //               <tbody>
    //                   <tr>
    //                       <td class="text-center text-warning">${message}</td>
    //                   </tr>
    //               </tbody>
    //           </table>
    //       `);
    // }
}
