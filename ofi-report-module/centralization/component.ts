import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import {MemberSocketService} from '@setl/websocket-service';

import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Unsubscribe} from 'redux';
import {fromJS} from 'immutable';
import {ConfirmationService, immutableHelper, SagaHelper, commonHelper} from '@setl/utils';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import * as math from 'mathjs';
import {ActivatedRoute, Params, Router} from '@angular/router';

/* Clarity */
import {ClrDatagridStateInterface} from '@clr/angular';

import * as _ from 'lodash';

/* services */
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';

/* store */
import {ofiCentralizationReportsActions} from '@ofi/ofi-main/ofi-store';

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

    searchForm: FormGroup;

    private myDetails: any = {};
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;
    unsubscribe = new Subject();

    dataListForSearch: Array<any> = [];

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'requested']) requestedOfiCentralizationReportsObj;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'centralizationReportsList']) OfiCentralizationReportsListObj;

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private route: ActivatedRoute,
        private router: Router,
        private _fb: FormBuilder,
        private ofiReportsService: OfiReportsService,
        private alerts: AlertsService,
        private _confirmationService: ConfirmationService,
    ) {
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
            return 'Not found!';
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
        console.log('onClickExportCentralizationReport');
    }

    onClickViewCorrespondingOrders(id) {
        console.log('onClickViewCorrespondingOrders');
    }

    onClickViewCentralizationHistory(id) {
        console.log('onClickViewCentralizationHistory');
    }

    onClickDownloadCorrespondingOrders(id) {
        console.log('onClickDownloadCorrespondingOrders');
    }

    onClickDownloadCentralizationHistory(id) {
        this.buildLink(id);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
