import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { fromJS } from 'immutable';
import * as _ from 'lodash';
import { FileDownloader } from '@setl/utils';
import { MemberSocketService } from '@setl/websocket-service';
import { OfiAmDashboardService } from '../../ofi-req-services/ofi-am-dashboard/service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { MultilingualService } from '@setl/multilingual';

interface SelectedItem {
    id: number;
    text: string;
}

@Component({
    selector: 'am-share-holders',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
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
    exportType = '';

    isListLevel = true;
    isFundLevel = false;
    isShareLevel = false;

    /* Datagrid server driven */
    total: number;
    itemPerPage = 10;
    lastPage: number;

    // Locale
    language = 'fr';

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
    };

    /* Tabs Control array */
    tabsControl: Array<any> = [];
    tabTitle = '';

    /* UI Lists. */
    holderFilters: Array<SelectedItem> = [];

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

    loadingDatagrid: boolean = false;
    setLoadingDatagrid: boolean = false;

    /* Private Properties. */
    private myDetails: any = {};
    private subscriptions: Array<any> = [];

    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;

    // fund select list
    @select(['ofi', 'ofiAmDashboard', 'shareHolders', 'fundsByUserRequested']) fundsByUserRequestedOb;
    @select(['ofi', 'ofiAmDashboard', 'shareHolders', 'fundsByUserList']) fundsByUserListOb;

    // fund details
    @select(['ofi', 'ofiAmDashboard', 'shareHolders', 'fundWithHoldersList']) fundWithHoldersListOb;

    // shares select list
    @select(['ofi', 'ofiReports', 'amHolders', 'requested']) requestedOfiAmHoldersObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'amHoldersList']) OfiAmHoldersListObj;

    // shares details
    @select(['ofi', 'ofiReports', 'amHolders', 'shareHolderDetail']) shareHolderDetailObs;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder,
                private memberSocketService: MemberSocketService,
                private ofiReportsService: OfiReportsService,
                private ofiAmDashboardService: OfiAmDashboardService,
                private fileDownloader: FileDownloader,
                private activatedRoute: ActivatedRoute,
                public translate: MultilingualService,
    ) {
        this.loadingDatagrid = false;

        this.isFundLevel = this.router.url.indexOf('/funds/') !== -1;
        this.isShareLevel = this.router.url.indexOf('/shares/') !== -1;
        this.isListLevel = !this.isFundLevel && !this.isShareLevel;

        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => {
            this.getLanguage(requested);
            this.setHolderFilters();
            this.translateTabs();
        }));

        this.subscriptions.push(this.myDetailOb.subscribe(myDetails => this.getUserDetails(myDetails)));

        this.setHolderFilters();

        this.listSearchForm = this.fb.group({
            searchFunds: [
                '',
            ],
            searchShares: [
                '',
            ],
        });

        this.searchForm = this.fb.group({
            search: [
                '',
            ],
        });

        this.filtersForm = this.fb.group({
            topholders: [
                '',
            ],
        });

        // all list
        this.subscriptions.push(this.requestedOfiAmHoldersObj.subscribe(requested => this.getAmHoldersRequested(requested)));
        this.subscriptions.push(this.OfiAmHoldersListObj.subscribe(list => this.getAmHoldersListFromRedux(list)));

        // fund select
        this.subscriptions.push(this.fundsByUserRequestedOb.subscribe(requested => this.fundsByUserRequested(requested)));
        this.subscriptions.push(this.fundsByUserListOb.subscribe(list => this.fundsByUserList(list)));

        // fund list
        this.subscriptions.push(this.fundWithHoldersListOb.subscribe(list => this.fundWithHoldersList(list)));

        // valueChange
        this.subscriptions.push(this.listSearchForm.valueChanges.subscribe(() => this.requestSearch()));
        this.subscriptions.push(this.searchForm.valueChanges.subscribe(() => this.requestSearch()));
        this.subscriptions.push(this.filtersForm.valueChanges.subscribe(() => this.requestSearch()));

        this.setInitialTabs();

        this.subscriptions.push(this.route.params.subscribe((params) => {
            const tabId = Number(params['tabid']);

            if (typeof tabId !== 'undefined' && tabId > 0) {
                // reset tabs
                this.tabsControl = [
                    {
                        title: {
                            icon: 'fa fa-th-list',
                            text: this.translate.translate('List'),
                        },
                        link: '/reports/holders-list',
                        id: 0,
                        type: 'list',
                        active: this.isListLevel,
                    },
                ];

                if (this.isFundLevel) {
                    this.selectedFundId = tabId;

                    this.fundWithHoldersRequested(false);

                    this.tabsControl.push({
                        title: {
                            icon: 'fa fa-th-list',
                            text: this.translate.translate('Funds Level'),
                        },
                        link: '/reports/holders-list/funds',
                        type: 'funds',
                        id: this.selectedFundId,
                        active: this.isFundLevel,
                    });

                    const obj = this.fundList.find(o => o.id === this.selectedFundId);
                    if (obj && obj !== undefined) {
                        this.searchForm.get('search').patchValue([obj], { emitEvent: false });
                    }
                }
                if (this.isShareLevel) {
                    this.selectedShareId = tabId;

                    this.loadingDatagrid = true;

                    OfiReportsService.defaultRequestHolderDetail(this.ofiReportsService, this.ngRedux, {
                        shareId: this.selectedShareId,
                        selectedFilter: this.holderFilters[0].id,
                    });

                    this.subscriptions.push(this.shareHolderDetailObs.subscribe(data => this.getHolderDetail(data)));

                    this.tabsControl.push({
                        title: {
                            icon: 'fa fa-th-list',
                            text: this.translate.translate('Shares Level'),
                        },
                        link: '/reports/holders-list/shares',
                        type: 'shares',
                        id: this.selectedShareId,
                        active: this.isShareLevel,
                    });

                    const obj = this.sharesList.find(o => o.id === this.selectedShareId);
                    if (obj && obj !== undefined) {
                        this.searchForm.get('search').patchValue([obj], { emitEvent: false });
                    }

                    if (this.allList.length > 0 && this.isShareLevel && this.selectedShareId > 0) {
                        const share = this.allList.find(item => item.shareId === this.selectedShareId);

                        this.tabTitle = `${share.shareName} - ${share.shareIsin}`;
                    }
                }
            }
        }));

        // handle showing data grid loading
        this.activatedRoute.url.subscribe((url) => {
            if (url && this.isListLevel) {
                this.setLoadingDatagrid = false;
            } else {
                this.setLoadingDatagrid = true;
            }
        });
    }

    ngOnInit() {
        if (this.setLoadingDatagrid) {
            this.loadingDatagrid = true;
            return;
        }
        this.loadingDatagrid = false;
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
        this.fundList = listImu.reduce(
            (result, item) => {
                const text = item.fundLei !== '' ? `${item.fundName} (${item.fundLei})` : item.fundName;

                result.push({
                    id: item.fundId,
                    text,
                });
                return result;
            },
            [],
        );

        this.changeDetectorRef.markForCheck();
    }

    fundWithHoldersRequested(requested): void {
        if (!requested) {
            const payload: any = {
                fundId: this.selectedFundId,
            };
            if (this.selectedTopHolders !== 0) {
                payload.selectedFilter = this.selectedTopHolders;
            }

            OfiAmDashboardService.defaultRequestGetFundWithHolders(this.ofiAmDashboardService, this.ngRedux, payload);
        }
    }

    fundWithHoldersList(list) {
        this.fundsNbHolders = 0;
        this.fundsAUM = 0;
        this.fundsCCY = 'EUR';
        this.fundSettlementDate = '';
        this.holdersFundData = [];

        if (list.length > 0) {
            if (!!list[0].Message) {
                const id = this.fundList.findIndex((r) => r.id == this.selectedFundId);
                this.tabTitle = (id > -1 ? this.fundList[id].text : '');
            } else {
                const listImu = fromJS(list);
                this.fundsData = [];
                this.fundsData = listImu.reduce(
                    (result, item) => {
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
                    },
                    [],
                );

                const lei = (typeof this.fundsData[0].fundLei !== 'undefined') ? ' - ' + this.fundsData[0].fundLei : '';
                this.tabTitle = `${this.fundsData[0].fundName}${lei}`;

                this.fundSettlementDate = this.fundsData[0].lastSettlementDate;
                this.fundsNbHolders = this.fundsData[0].fundHolderNumber;
                this.fundsAUM = this.fundsData[0].fundAum;
                this.fundsCCY = this.fundsData[0].fundCurrency;

                this.holdersFundData = this.fundsData[0].holders.reduce(
                    (result, item) => {
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
                    },
                    [],
                );
            }
        }

        this.changeDetectorRef.markForCheck();
        this.loadingDatagrid = false;
    }

    /**
     * Run the process for requesting the list of holders
     *
     * @param requested
     */
    getAmHoldersRequested(requested): void {
        if (!requested) {
            this.loadingDatagrid = true;
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

            this.sharesList = this.allList.filter(it => it.shareId !== 0).map((holder) => {
                return {
                    id: holder.shareId,
                    text: holder.fundName + ' - ' + holder.shareName + ' (' + holder.shareIsin + ')',
                };
            });
        }
        this.changeDetectorRef.markForCheck();
        this.loadingDatagrid = false;
    }

    /**
     * Get detail of holders for a given share id
     *
     * @param res
     */
    getHolderDetail(res) {
        if (res && res.size > 0) {
            const data = res.toJS();

            this.holdersShareData = data.holders;
            this.sharesNbHolders = data.holderNumber;
            this.sharesAUM = data.aum;
            this.sharesNbUnits = data.unitNumber;
            this.sharesLatestNAV = data.nav;
            this.sharesCCY = data.currency;
            this.shareSettlementDate = data.lastSettlementDate;
        }

        this.changeDetectorRef.markForCheck();
        this.loadingDatagrid = false;
    }

    setHolderFilters() {
        this.holderFilters = this.translate.translate([
            { id: 0, text: 'All' },
            { id: 10, text: 'Top 10 holders' },
            { id: 20, text: 'Top 20 holders' },
            { id: 50, text: 'Top 50 holders' },
            { id: 100, text: 'Top 100 holders' },
        ]);
    }

    translateTabs() {
        this.tabsControl.forEach((tab) => {
            switch (tab.type) {
                case 'shares':
                    tab.title.text = this.translate.translate('Shares Level');
                    break;
                case 'funds':
                    tab.title.text = this.translate.translate('Funds Level');
                    break;
                case 'list':
                    tab.title.text = this.translate.translate('List');
                    break;
                default:
                    break;
            }
        });
    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = [];

        if (openedTabs.length === 0) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    title: {
                        icon: 'fa fa-th-list',
                        text: this.translate.translate('List'),
                    },
                    link: '/reports/holders-list',
                    id: 0,
                    type: 'list',
                    active: this.isListLevel,
                },
            ];

            return true;
        }
    }

    handleClickShare(data) {
        const isFund = data.shareId === 0;
        const route = isFund ? `/reports/holders-list/funds/${data.fundId}` : `/reports/holders-list/shares/${data.shareId}`;
        this.router.navigateByUrl(route);
    }

    requestSearch() {
        this.loadingDatagrid = true;

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
            const oldSelectedFundId = this.selectedFundId;
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
                this.router.navigateByUrl('/reports/holders-list');
            }
        }

        if (this.isShareLevel) {
            const oldSelectedShareId = this.selectedShareId;
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
                this.router.navigateByUrl('/reports/holders-list');
            }
        }
    }

    exportFile(type, isSpecific) {
        if (type === 'funds' && isSpecific === 0) {
            // all fund
            this.fileDownloader.downLoaderFile({
                method: 'exportRecordKeepingFunds',
                token: this.memberSocketService.token,
                userId: this.myDetails.userId,
            });
        }

        if (type === 'funds' && isSpecific === 1) {
            // specific fund
            this.fileDownloader.downLoaderFile({
                method: 'exportRecordKeepingFund',
                token: this.memberSocketService.token,
                userId: this.myDetails.userId,
                fundId: this.selectedFundId,
                selectedFilter: this.selectedTopHolders,
            });
        }

        if (type === 'shares' && isSpecific === 0) {
            // all shares
            this.fileDownloader.downLoaderFile({
                method: 'exportRecordKeepingShares',
                token: this.memberSocketService.token,
                userId: this.myDetails.userId,
            });
        }

        if (type === 'shares' && isSpecific === 1) {
            // specific share
            this.fileDownloader.downLoaderFile({
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
