import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {MemberSocketService} from '@setl/websocket-service';

import {NgRedux, select} from '@angular-redux/store';
import {Unsubscribe} from 'redux';
import {fromJS} from 'immutable';
/* Utils. */
import {ConfirmationService, NumberConverterService} from '@setl/utils';
/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import {ActivatedRoute, Router} from '@angular/router';
/* Clarity */
/* services */
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';
/* store */
import {ofiManageOrderActions} from '@ofi/ofi-main/ofi-store';
import {APP_CONFIG, AppConfig} from "@setl/utils/index";

/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentralizationReportComponent implements OnInit, OnDestroy {

    unknownValue = '???';

    centralizationReportsList: Array<any> = [];

    // Locale
    language = 'en';

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

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

    searchForm: FormGroup;

    private myDetails: any = {};
    private appConfig: any = {};
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;
    unsubscribe = new Subject();

    dataListForSearch: Array<any> = [];

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'requested']) requestedOfiCentralizationReportsObj;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'centralizationReportsList']) OfiCentralizationReportsListObj;

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
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;
        this.createsearchForm();

        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
        });

        this.subscriptions.push(this.requestedOfiCentralizationReportsObj.subscribe((requested) => this.getCentralizationReportsRequested(requested)));
        this.subscriptions.push(this.OfiCentralizationReportsListObj.subscribe((list) => this.getCentralizationReportsListFromRedux(list)));
    }

    public ngOnInit() {
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
                cutoffDate: item.get('cutoffDate'),
                fundShareID: item.get('fundShareID'),
                fundShareName: item.get('fundShareName'),
                isin: item.get('isin'),
                latestNav: (item.get('latestNav') === null) ? 0 : item.get('latestNav'),
                latestNavBackup: (item.get('latestNavBackup') === null) ? 0 : item.get('latestNavBackup'),
                navDate: item.get('navDate'),
                navDateBackup: item.get('navDateBackup'),
                redAmount: (item.get('redAmount') === null) ? 0 : item.get('redAmount'),
                redQuantity: (item.get('redQuantity') === null) ? 0 : item.get('redQuantity'),
                settlementDate: item.get('settlementDate'),
                shareClassCurrency: item.get('shareClassCurrency'),
                subAmount: (item.get('subAmount') === null) ? 0 : item.get('subAmount'),
                subQuantity: (item.get('subQuantity') === null) ? 0 : item.get('subQuantity'),
            });

            return result;
        }, []);

        for (const report of this.centralizationReportsList) {
            this.dataListForSearch.push({
                id: report.fundShareID,
                text: report.fundShareName,
            });
        }

        this.subscriptions.push(this.searchForm.valueChanges.subscribe((form) => this.requestSearch(form)));

        this.changeDetectorRef.markForCheck();
    }

    requestSearch(form) {
        if (this.searchForm.get('search').value && this.searchForm.get('search').value[0] && this.searchForm.get('search').value[0].id) {
            this.buildLink(this.searchForm.get('search').value[0].id);
        }
    }

    buildLink(id) {
        const dest = 'am-reports-section/centralization-history/' + id;
        this.router.navigateByUrl(dest);
    }

    createsearchForm() {
        this.searchForm = this._fb.group({
            search: [
                '',
            ],
        });
    }

    showCurrency(currency) {
        const obj = this.currencyList.find(o => o.id === currency);
        if (obj !== undefined) {
            return obj.text;
        } else {
            return currency;
        }
    }

    calculNetPosition(suba, reda, redq, subq, latestNav) {
        return (isFinite(((suba - reda) / ((redq + subq) * latestNav)) * 100)) ? ((suba - reda) / ((redq + subq) * latestNav)) * 100 : 0;
    }

    convertDate(inputDate) {
        let today: any = new Date(inputDate);
        let dd: any = today.getDate();
        let mm: any = today.getMonth() + 1;
        let yyyy: any = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return yyyy + '/' + mm + '/' + dd;
    }

    onClickExportCentralizationReport(id) {
        const paramUrl = 'file?token=' + this.memberSocketService.token + '&method=getallshareinfocsv&userId=' + this.myDetails.userId;
        const url = this.generateExportURL(paramUrl, this.appConfig.production);
        window.open(url, '_blank');
    }


    onClickViewCentralizationHistory(id) {
        this.buildLink(id);
    }

    onClickViewCorrespondingOrders(id) {
        const obj = this.centralizationReportsList.find(o => o.fundShareID === id);
        if (obj !== undefined) {
            const orderFilters = {
                filters: {
                    isin: obj.isin,
                    shareName: obj.fundShareName,
                    status: 1,
                    orderType: '',
                }
            };

            this.ngRedux.dispatch({type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS, filters: orderFilters});
            this.router.navigateByUrl('manage-orders/list');
        }
    }

    onClickDownloadCorrespondingOrders(id) {
        let paramUrl = 'file?token=' + this.memberSocketService.token + '&method=exportAssetManagerOrders&userId=' + this.myDetails.userId;

        console.log(this.centralizationReportsList, id);

        const obj = this.centralizationReportsList.find(o => o.fundShareID === id);
        if (obj !== undefined) {
            const params = {
                shareName: obj.fundShareName,
                isin: obj.isin,
                status: null,
                orderType: null,
                pageSize: 1000,
                rowOffSet: 0,
                sortByField: 'userEntered',
                sortOrder: 'desc',
                dateSearchField: null,
                fromDate: null,
                toDate: null,
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

    onClickDownloadCentralizationHistory(id) {
        const paramUrl = 'file?token=' + this.memberSocketService.token + '&method=getsingleshareinfocsv&fundShareID=' + id + '&userId=' + this.myDetails.userId;
        const url = this.generateExportURL(paramUrl, this.appConfig.production);
        window.open(url, '_blank');
    }

    generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` :
            `http://${window.location.hostname}:9788/${url}`;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
