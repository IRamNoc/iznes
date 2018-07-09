// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgRedux, select } from '@angular-redux/store';
/* Alert service. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
/* Clarity */
import { ClrDatagridStateInterface } from '@clr/angular';
/* Utils. */
import { immutableHelper, NumberConverterService, FileDownloader } from '@setl/utils';
/* services */
import { MemberSocketService } from '@setl/websocket-service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { Subscription } from 'rxjs/Subscription';
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
    searchListForm: FormGroup;
    searchInShareForm: FormGroup;

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
    shareID = 0;

    /* expandable div */

    /* Ui Lists. */
    holderFilters: Array<SelectedItem> = [
        { id: 1, text: 'All' },
        { id: 2, text: 'Top 10 holders' },
        { id: 3, text: 'Top 20 holders' },
        { id: 4, text: 'Top 50 holders' },
        { id: 5, text: 'Top 100 holders' },
    ];

    shareTabTitle: string;
    dataListForSearch: Array<any> = [];
    holdersList: Array<any> = [];
    holderDetailData: any;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['ofi', 'ofiReports', 'amHolders', 'requested']) requestedOfiAmHoldersObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'amHoldersList']) OfiAmHoldersListObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'holderDetailRequested']) requestedHolderDetailObs;
    @select(['ofi', 'ofiReports', 'amHolders', 'shareHolderDetail']) shareHolderDetailObs;

    /* Private Properties. */
    private myDetails: any = {};
    private subscriptions: Array<any> = [];
    private appConfig: any = {};

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
     * @param {FileDownloader} _fileDownloader
     * @param {OfiReportsService} ofiReportsService
     */
    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private _numberConverterService: NumberConverterService,
                private _fb: FormBuilder,
                private memberSocketService: MemberSocketService,
                private ofiReportsService: OfiReportsService,
                private _fileDownloader: FileDownloader,
                public _translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;
        this.shareTabTitle = '';
        this.createSearchListForm();
        this.createSearchInShareForm();
        this.setInitialTabs();
    }

    ngOnInit() {
        this.searchInShareForm.get('top').patchValue([this.holderFilters[0]], { emitEvent: false });

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
                this.searchListForm.get('search').patchValue(null, { emitEvent: false });
                this.searchInShareForm.get('top').patchValue([this.holderFilters[0]], { emitEvent: false });
            }
        }));

        this.subscriptions.push(this.searchListForm.valueChanges.subscribe((form) => this.requestSearch(form)));
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
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
     * @param data
     */
    getHolderDetail(data) {

        console.log(data);

        if (data) {
            this.holderDetailData = data.holders.toJS() || [];
        }

        console.log(this.holderDetailData);

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
            top: [[this.holderFilters[0]]],
            dateUsed: [''],
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
        // Reset the flag for getting holder detail
        OfiReportsService.setRequestedHolderDetail(false, this.ngRedux);

        if (
            this.searchListForm.get('search').value &&
            this.searchListForm.get('search').value[0] &&
            this.searchListForm.get('search').value[0].id
        ) {
            const shareId = this.searchListForm.get('search').value[0].id;
            this.openShareId(shareId);

        } else {
            this.buildLink('0');
        }
    }

    getShareNameByShareId(shareId): string {

        let selectedShareName: string;

        try {
            selectedShareName = this.dataListForSearch.filter((item) => Number(item.id) === Number(shareId))[0].text;
        } catch (e) {
            selectedShareName = '';
        }

        return selectedShareName;
    }

    handleClickShare(data) {
        if (!data.isFund && data.shareId) {
            this.openShareId(data.shareId);
        }
    }

    openShareId(shareId) {
        this.holderDetailData = [];
        const payload = {
            shareId,
            selectedFilter: this.holderFilters[0].id
        };

        const selectedShareName = this.getShareNameByShareId(shareId);

        this.searchListForm.get('search').patchValue([{ id: shareId, text: selectedShareName }], { emitEvent: false });

        OfiReportsService.setRequestedHolderDetail(true, this.ngRedux);

        OfiReportsService.defaultRequestHolderDetail(this.ofiReportsService, this.ngRedux, payload);

        this.buildLink(shareId);

        this.subscriptions.push(this.shareHolderDetailObs.subscribe((data) => this.getHolderDetail(data)));
    }

    buildLink(id) {
        this.router.navigateByUrl(`reports/holders-list/${id}`);
    }

    refresh(state: ClrDatagridStateInterface) {
        // TODO: think to check with the backend team that server-data driven will be possible
        let filters: { [prop: string]: any[] } = {};

        if (state.filters) {
            for (const filter of state.filters) {
                const { property, value } = <{ property: string, value: string }>filter;
                filters[property] = [value];
            }
        }

        this.changeDetectorRef.markForCheck();
    }

    handleHolderFilterSelect(selectedFilterId) {
        const payload = {
            shareId: this.searchListForm.get('search').value[0].id,
            selectedFilter: selectedFilterId
        };

        // Reset holder detail requested flag
        OfiReportsService.setRequestedHolderDetail(true, this.ngRedux);

        // Fetch the holders with the newest selected filter
        OfiReportsService.defaultRequestHolderDetail(this.ofiReportsService, this.ngRedux, payload);

        // Retrieve holder detail's data
        this.subscriptions.push(this.shareHolderDetailObs.subscribe((data) => this.getHolderDetail(data)));
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Export the global list of holders to CSV
     */
    handleHoldersExportButtonClick(): void {

        this._fileDownloader.downLoaderFile({
            method: 'exportAssetManagerHolders',
            token: this.memberSocketService.token,
            userId: this.myDetails.userId
        });
    }

    /**
     * Export the holder detail page to CSV
     */
    handleHolderDetailExportButtonClick(): void {
        const shareId = this.searchListForm.get('search').value[0].id;
        const selectedFilter = this.searchInShareForm.get('top').value[0].id;
        const shareIsin = this.holdersList.find((item) => item.shareId === this.shareID).shareIsin;

        this._fileDownloader.downLoaderFile({
            method: 'exportShareHolderDetail',
            token: this.memberSocketService.token,
            shareId,
            shareIsin,
            userId: this.myDetails.userId,
            selectedFilter: selectedFilter,
        });
    }

    private generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` : `http://${window.location.hostname}:9788/${url}`;
    }
}
