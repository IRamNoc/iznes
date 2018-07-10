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

    searchForm: FormGroup;
    filtersForm: FormGroup;
    searchSharesForm: FormGroup;
    filtersSharesForm: FormGroup;

    showModal = false;
    exportType = '';
    isFundLevel = true;

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

    /* Ui Lists. */
    holderFilters: Array<SelectedItem> = [
        { id: 1, text: 'All' },
        { id: 2, text: 'Top 10 holders' },
        { id: 3, text: 'Top 20 holders' },
        { id: 4, text: 'Top 50 holders' },
        { id: 5, text: 'Top 100 holders' },
    ];

    /* datas */

    fundsNbHolders = 0;
    fundsAUM = 0;
    fundsCCY = 'EUR';

    sharesNbUnits = 0;
    sharesLatestNAV = 0;

    fundList = [];
    fundsData = [];
    sharesData = [];

    /* Private Properties. */
    private myDetails: any = {};
    private subscriptions: Array<any> = [];
    private appConfig: any = {};

    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;

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
                @Inject(APP_CONFIG) appConfig: AppConfig
    ) {
        this.appConfig = appConfig;

        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));
        this.subscriptions.push(this.myDetailOb.subscribe((myDetails) => this.getUserDetails(myDetails)));

        this.searchForm = this._fb.group({
            search: [
                '',
            ],
        });
        this.filtersForm = this._fb.group({
            topholders: [
                '',
            ],
            settlementDate: [
                '',
            ],
        });

        this.setInitialTabs();
    }

    ngOnInit() {
        this.isFundLevel = (this.router.url.indexOf('/funds/') !== -1) ? true : false;
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
                        'text': 'Funds Level'
                    },
                    'link': '/reports/holders-list/funds/',
                    'id': 0,
                    'type': 'funds',
                    'data': this.fundsData,
                    'active': (this.router.url.indexOf('/funds/') !== -1) ? true : false,
                },
                {
                    'title': {
                        'icon': 'fa fa-th-list',
                        'text': 'Shares Level'
                    },
                    'link': '/reports/holders-list/shares/',
                    'id': 0,
                    'type': 'shares',
                    'data': this.sharesData,
                    'active': (this.router.url.indexOf('/shares/') !== -1) ? true : false,
                }
            ];
            return true;
        }

        // this.tabsControl = openedTabs;
    }

    exportButton(type) {
        this.exportType = (type === '') ? '' : 'all';
        this.showModal = true;
    }

    exportFile(type) {
        console.log('Export on fundLevel: ' + this.isFundLevel);
        console.log('Export type: ' + type);
        this.showModal = false;
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
