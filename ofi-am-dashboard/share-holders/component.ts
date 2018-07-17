// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// redux
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import * as _ from 'lodash';
import * as SagaHelper from '@setl/utils/sagaHelper';

/* Alert service. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';

/* Clarity */
import { ClrDatagridStateInterface } from '@clr/angular';

/* Utils. */
import { immutableHelper, NumberConverterService, FileDownloader } from '@setl/utils';

/* services */
import { MemberSocketService } from '@setl/websocket-service';
import { OfiAmDashboardService } from '../../ofi-req-services/ofi-am-dashboard/service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';

import { Subscription } from 'rxjs';
import { APP_CONFIG, AppConfig } from "@setl/utils/index";
import { MultilingualService } from '@setl/multilingual';

/* Types. */
interface SelectedItem {
    id: number;
    text: string;
}

/* Decorator. */
@Component({
    selector: 'am-share-holders',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ShareHoldersComponent implements OnInit, OnDestroy {

    // list forms
    listSearchForm: FormGroup;

    // funds forms
    searchForm: FormGroup;
    filtersForm: FormGroup;

    // share forms
    searchSharesForm: FormGroup;
    filtersSharesForm: FormGroup;

    // ng-select selected
    selectedFundId = 0;
    selectedShareId = 0;
    selectedTopHolders = 0;

    // modal data
    showModal = false;
    exportType = '';

    isListLevel = true;
    isFundLevel = false;
    isShareLevel = false;

    /* Datagrid server driven */
    total: number;
    itemPerPage = 10;
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
    tabTitle = '';

    /* Ui Lists. */
    holderFilters: Array<SelectedItem> = [
        { id: 0, text: 'All' },
        { id: 10, text: 'Top 10 holders' },
        { id: 20, text: 'Top 20 holders' },
        { id: 50, text: 'Top 50 holders' },
        { id: 100, text: 'Top 100 holders' },
    ];

    /* datas */

    fundsNbHolders = 0;
    fundsAUM = 0;
    fundsCCY = 'EUR';
    fundSettlementDate = '';

    sharesNbHolders = 0;
    sharesNbUnits = 0;
    sharesLatestNAV = 0;
    shareSettlementDate = '';
    sharesAUM = 0;
    sharesCCY = '';


    allList: any = [];
    fundList: any = [];
    sharesList: any = [];
    fundsData: any = [];
    sharesData: any = [];
    holdersFundData: any = [];
    holdersShareData: any = [];

    gotDataToExport = false;

    /* Private Properties. */
    private myDetails: any = {};
    private subscriptions: Array<any> = [];
    private appConfig: any = {};

    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;

    // fund select list
    @select(['ofi', 'ofiAmDashboard', 'shareHolders', 'fundsByUserRequested']) fundsByUserRequestedOb;
    @select(['ofi', 'ofiAmDashboard', 'shareHolders', 'fundsByUserList']) fundsByUserListOb;

    // fund details
    // @select(['ofi', 'ofiAmDashboard', 'shareHolders', 'fundWithHoldersRequested']) fundWithHoldersRequestedOb;
    @select(['ofi', 'ofiAmDashboard', 'shareHolders', 'fundWithHoldersList']) fundWithHoldersListOb;

    // shares select list
    @select(['ofi', 'ofiReports', 'amHolders', 'requested']) requestedOfiAmHoldersObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'amHoldersList']) OfiAmHoldersListObj;

    // shares details
    @select(['ofi', 'ofiReports', 'amHolders', 'shareHolderDetail']) shareHolderDetailObs;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private _numberConverterService: NumberConverterService,
                private _fb: FormBuilder,
                private memberSocketService: MemberSocketService,
                private ofiReportsService: OfiReportsService,
                private ofiAmDashboardService: OfiAmDashboardService,
                private _fileDownloader: FileDownloader,
                public _translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig
    ) {
        this.appConfig = appConfig;

        this.isListLevel = (this.router.url.indexOf('/holders-list/list') !== -1) ? true : false;
        this.isFundLevel = (this.router.url.indexOf('/funds/') !== -1) ? true : false;
        this.isShareLevel = (this.router.url.indexOf('/shares/') !== -1) ? true : false;

        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));
        this.subscriptions.push(this.myDetailOb.subscribe((myDetails) => this.getUserDetails(myDetails)));

        this.listSearchForm = this._fb.group({
            searchFunds: [
                '',
            ],
            searchShares: [
                '',
            ],
        });

        this.searchForm = this._fb.group({
            search: [
                '',
            ],
        });

        this.filtersForm = this._fb.group({
            topholders: [
                '',
            ],
        });

        // all list
        this.subscriptions.push(this.requestedOfiAmHoldersObj.subscribe((requested) => this.getAmHoldersRequested(requested)));
        this.subscriptions.push(this.OfiAmHoldersListObj.subscribe((list) => this.getAmHoldersListFromRedux(list)));

        // fund select
        this.subscriptions.push(this.fundsByUserRequestedOb.subscribe((requested) => this.fundsByUserRequested(requested)));
        this.subscriptions.push(this.fundsByUserListOb.subscribe((list) => this.fundsByUserList(list)));

        // fund list
        // this.subscriptions.push(this.fundWithHoldersRequestedOb.subscribe((requested) => this.fundWithHoldersRequested(requested)));
        this.subscriptions.push(this.fundWithHoldersListOb.subscribe((list) => this.fundWithHoldersList(list)));

        // valueChange
        this.subscriptions.push(this.listSearchForm.valueChanges.subscribe((form) => this.requestSearch(form)));
        this.subscriptions.push(this.searchForm.valueChanges.subscribe((form) => this.requestSearch(form)));
        this.subscriptions.push(this.filtersForm.valueChanges.subscribe((form) => this.requestSearch(form)));

        this.setInitialTabs();

        this.subscriptions.push(this.route.params.subscribe(params => {
            const tabId = Number(params['tabid']);
            if (typeof tabId !== 'undefined' && tabId > 0) {
                // reset tabs
                this.tabsControl = [
                    {
                        'title': {
                            'icon': 'fa fa-th-list',
                            'text': 'List'
                        },
                        'link': '/reports/holders-list/',
                        'id': 0,
                        'type': 'list',
                        'active': this.isListLevel,
                    },
                ];

                if (this.isFundLevel) {
                    this.selectedFundId = tabId;

                    this.fundWithHoldersRequested(false);

                    this.tabsControl.push({
                        'title': {
                            'icon': 'fa fa-th-list',
                            'text': 'Funds Level'
                        },
                        'link': '/reports/holders-list/funds/',
                        'type': 'funds',
                        'id': this.selectedFundId,
                        'active': this.isFundLevel,
                    });

                    let obj = this.fundList.find(o => o.id === this.selectedFundId);
                    if (obj && obj !== undefined) {
                        this.searchForm.get('search').patchValue([obj], { emitEvent: false });
                    }
                }
                if (this.isShareLevel) {
                    this.selectedShareId = tabId;

                    OfiReportsService.defaultRequestHolderDetail(this.ofiReportsService, this.ngRedux, {
                        shareId: this.selectedShareId,
                        selectedFilter: this.holderFilters[0].id,
                    });

                    this.subscriptions.push(this.shareHolderDetailObs.subscribe((data) => this.getHolderDetail(data)));

                    this.tabsControl.push({
                            'title': {
                                'icon': 'fa fa-th-list',
                                'text': 'Shares Level'
                            },
                            'link': '/reports/holders-list/shares/',
                            'type': 'shares',
                            'id': this.selectedShareId,
                            'active': this.isShareLevel,
                        });

                    let obj = this.sharesList.find(o => o.id === this.selectedShareId);
                    if (obj && obj !== undefined) {
                        this.searchForm.get('search').patchValue([obj], { emitEvent: false });
                    }

                    if (this.allList.length > 0 && this.isShareLevel && this.selectedShareId > 0) {
                        const share = this.allList.find((item) => item.shareId === this.selectedShareId);

                        this.tabTitle = `${share.shareName} - ${share.shareIsin}`;
                    }
                }
            }
        }));
    }

    ngOnInit() {
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

    getUserDetails(userDetails) {
        this.myDetails = userDetails;
    }

    fundsByUserRequested(requested): void {
        if (!requested) {
            OfiAmDashboardService.defaultRequestGetUserManagementCompanyFunds(this.ofiAmDashboardService, this.ngRedux);
        }
    }

    fundsByUserList(list) {
        const listImu = fromJS(list);
        this.fundList = listImu.reduce((result, item) => {
            let lei = (typeof item.lei !== 'undefined') ? ' (' + item.lei + ')' : '';
            result.push({
                id: item.fundId,
                text: item.fundName + lei,
            });
            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    fundWithHoldersRequested(requested): void {
        if (!requested) {
            let payload: any = {
                fundId: this.selectedFundId,
            };
            if (this.selectedTopHolders !== 0) {
                payload.selectedFilter = this.selectedTopHolders;
            }
            OfiAmDashboardService.defaultRequestGetFundWithHolders(this.ofiAmDashboardService, this.ngRedux, payload);
        }
    }

    fundWithHoldersList(list) {
        const listImu = fromJS(list);
        this.fundsData = [];
        this.fundsData = listImu.reduce((result, item) => {
            result.push({
                fundId: item.get('fundId'),
                fundName: item.get('fundName'),
                fundAum: item.get('fundAum'),
                fundHolderNumber: item.get('fundHolderNumber'),
                lastSettlementDate: item.get('lastSettlementDate'),
                fundCurrency: item.get('fundCurrency'),
                holders: item.get('holders'),
            });
            return result;
        }, []);

        this.fundsNbHolders = 0;
        this.fundsAUM = 0;
        this.fundsCCY = 'EUR';
        this.fundSettlementDate = '';

        if (list.length > 0) {
            let lei = (typeof this.fundsData[0].fundLei !== 'undefined') ? ' - ' + this.fundsData[0].fundLei : '';
            this.tabTitle = `${this.fundsData[0].fundName}${lei}`;
            this.gotDataToExport = true;

            this.fundSettlementDate = this.fundsData[0].lastSettlementDate;
            this.fundsNbHolders = this.fundsData[0].fundHolderNumber;
            this.fundsAUM = this.fundsData[0].fundAum;
            this.fundsCCY = this.fundsData[0].fundCurrency;

            this.holdersFundData = [];
            this.holdersFundData = this.fundsData[0].holders.reduce((result, item) => {
                result.push({
                    ranking: item.get('ranking'),
                    portfolio: item.get('portfolio'),
                    investorName: item.get('investorName'),
                    quantity: item.get('quantity'),
                    amount: item.get('amount'),
                    shareRatio: item.get('shareRatio'),
                    fundRatio: item.get('fundRatio'),
                });
                return result;
            }, []);
        }

        this.changeDetectorRef.markForCheck();
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
            this.allList = holderList.toJS() || [];

            this.sharesList = this.allList.filter(it => !it.isFund).map((holder) => {
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
     * @param data
     */
    getHolderDetail(data) {
        if (data) {
            this.holdersShareData = data.holders.toJS() || [];
            this.sharesNbHolders = data.holderNumber;
            this.sharesAUM = data.aum;
            this.sharesNbUnits = data.unitNumber;
            this.sharesLatestNAV = data.nav;
            this.sharesCCY = data.currency;
            this.shareSettlementDate = data.lastSettlementDate;
        }
        this.changeDetectorRef.markForCheck();
    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = [];
        // const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['ofi', 'ofiOrders', 'manageOrders', 'openedTabs']);

        if (openedTabs.length === 0) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    'title': {
                        'icon': 'fa fa-th-list',
                        'text': 'List'
                    },
                    'link': '/reports/holders-list/',
                    'id': 0,
                    'type': 'list',
                    'active': this.isListLevel,
                },
            ];
            return true;
        }

        // this.tabsControl = openedTabs;
    }

    handleClickShare(data) {
        if (data.isFund) {
            if (data.fundId && data.fundId > 0) {
                this.router.navigateByUrl('/reports/holders-list/funds/' + data.fundId);
            }
        } else {
            if (data.shareId && data.shareId > 0) {
                this.router.navigateByUrl('/reports/holders-list/shares/' + data.shareId);
            }
        }
    }

    requestSearch(form) {
        if (this.isListLevel) {
            this.selectedFundId = (this.listSearchForm.controls['searchFunds'].value.length > 0) ? this.listSearchForm.controls['searchFunds'].value[0].id : 0;
            this.selectedShareId = (this.listSearchForm.controls['searchShares'].value.length > 0) ? this.listSearchForm.controls['searchShares'].value[0].id : 0;
            if (this.selectedFundId > 0) {
                this.router.navigateByUrl('/reports/holders-list/funds/' + this.selectedFundId);
            }
            if (this.selectedShareId > 0) {
                this.router.navigateByUrl('/reports/holders-list/shares/' + this.selectedShareId);
            }
        }

        if (this.isFundLevel) {
            let oldSelectedFundId = this.selectedFundId;
            this.selectedFundId = (this.searchForm.controls['search'].value.length > 0) ? this.searchForm.controls['search'].value[0].id : 0;
            this.selectedTopHolders = (this.filtersForm.controls['topholders'].value.length > 0) ? this.filtersForm.controls['topholders'].value[0].id : 0;
            if (this.selectedFundId > 0) {
                if (oldSelectedFundId !== this.selectedFundId) {
                    this.router.navigateByUrl('/reports/holders-list/funds/' + this.selectedFundId);
                } else {
                    // same fund call with filters
                    this.fundWithHoldersRequested(false);
                }
            } else {
                this.fundsData = [];
                this.holdersFundData = [];
                this.fundsNbHolders = 0;
                this.fundsAUM = 0;
                this.fundsCCY = 'EUR';
                this.fundSettlementDate = '';
                this.gotDataToExport = false;
                this.router.navigateByUrl('/reports/holders-list/list');
            }
        }

        if (this.isShareLevel) {
            let oldSelectedShareId = this.selectedShareId;
            this.selectedShareId = (this.searchForm.controls['search'].value.length > 0) ? this.searchForm.controls['search'].value[0].id : 0;
            this.selectedTopHolders = (this.filtersForm.controls['topholders'].value.length > 0) ? this.filtersForm.controls['topholders'].value[0].id : 0;
            if (this.selectedShareId > 0) {
                if (oldSelectedShareId !== this.selectedShareId) {
                    this.router.navigateByUrl('/reports/holders-list/shares/' + this.selectedShareId);
                } else {
                    // same share call with filters
                    OfiReportsService.defaultRequestHolderDetail(this.ofiReportsService, this.ngRedux, {
                        shareId: this.selectedShareId,
                        selectedFilter: this.selectedTopHolders,
                    });
                }
            } else {
                this.sharesNbHolders = 0;
                this.sharesNbUnits = 0;
                this.sharesLatestNAV = 0;
                this.shareSettlementDate = '';
                this.sharesAUM = 0;
                this.sharesCCY = '';
                this.gotDataToExport = false;
                this.router.navigateByUrl('/reports/holders-list/list');
            }
        }
    }

    exportFile(type, isSpecific) {
        if (type === 'funds' && isSpecific === 0) {
            // all fund
            this._fileDownloader.downLoaderFile({
                method: 'exportRecordKeepingFunds',
                token: this.memberSocketService.token,
                userId: this.myDetails.userId,
            });
        }

        if (type === 'funds' && isSpecific === 1) {
            // specific fund
            this._fileDownloader.downLoaderFile({
                method: 'exportRecordKeepingFund',
                token: this.memberSocketService.token,
                userId: this.myDetails.userId,
                fundId: this.selectedFundId,
                selectedFilter: this.selectedTopHolders,
            });
        }

        if (type === 'shares' && isSpecific === 0) {
            // all shares
            this._fileDownloader.downLoaderFile({
                method: 'exportRecordKeepingShares',
                token: this.memberSocketService.token,
                userId: this.myDetails.userId,
            });
        }

        if (type === 'shares' && isSpecific === 1) {
            // specific share
            this._fileDownloader.downLoaderFile({
                method: 'exportRecordKeepingShare',
                token: this.memberSocketService.token,
                userId: this.myDetails.userId,
                shareId: this.selectedShareId,
                selectedFilter: this.selectedTopHolders,
            });
        }
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
