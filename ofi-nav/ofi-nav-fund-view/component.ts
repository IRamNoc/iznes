import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgRedux, select } from '@angular-redux/store';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import * as model from '../OfiNav';
import { OfiManageNavPopupService } from '../ofi-manage-nav-popup/service';
import { OfiCorpActionService } from '../../ofi-req-services/ofi-corp-actions/service';
import { OfiNavService } from '../../ofi-req-services/ofi-product/nav/service';
import {
    clearRequestedNavFundHistory,
    clearRequestedNavFundView,
    getOfiNavFundViewCurrentRequest,
    ofiSetCurrentNavFundHistoryRequest,
    setRequestedNavFundHistory,
    setRequestedNavFundView,
} from '../../ofi-store/ofi-product/nav';
import {
    APP_CONFIG,
    AppConfig,
    FileDownloader,
    immutableHelper,
    MoneyValuePipe,
    NumberConverterService,
} from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';
import { AlertsService } from '@setl/jaspero-ng2-alerts/src/alerts.service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';

const ADMIN_USER_URL = '/net-asset-value';

@Component({
    selector: 'app-nav-fund-view',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
})
export class OfiNavFundView implements OnInit, OnDestroy {
    navFund: model.NavInfoModel;
    navFundHistory: any;
    socketToken: string;
    userId: number;

    navHistoryForm: FormGroup;

    currentDate: string = moment().format('YYYY-MM-DD');
    dateFromConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null,
    };
    dateToConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null,
    };
    datePeriodItems: any;
    usingDatePeriodToSearch: boolean = false;
    navToChangeTriggeredByDatePeriod: boolean = false;
    navFromChangeTriggeredByDatePeriod: boolean = false;

    appConfig: AppConfig;
    isNavUploadModalDisplayed: boolean;
    navCsvFile: any;
    hasResult: boolean;
    currencyList: any[];

    get isIznesAdmin():boolean {
        return this.router.url.startsWith(ADMIN_USER_URL);
    }

    @ViewChild('detailNavCsvFile')
    detailNavCsvFile: any;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'requested']) navFundRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'navFundView']) navFundOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundHistory', 'requested']) navFundHistoryRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundHistory', 'navFundHistory']) navFundHistoryOb: Observable<any>;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;
    @select(['user', 'authentication', 'token']) tokenOb;
    private subscriptionsArray: Subscription[] = [];

    constructor(
        private redux: NgRedux<any>,
                private router: Router,
                private changeDetectorRef: ChangeDetectorRef,
                private ofiCorpActionService: OfiCorpActionService,
                private ofiNavService: OfiNavService,
                private numberConverterService: NumberConverterService,
                private moneyPipe: MoneyValuePipe,
                private popupService: OfiManageNavPopupService,
                private alertService: AlertsService,
                private ofiCurrenciesService: OfiCurrenciesService,
                private fileDownloader: FileDownloader,
                public translate: MultilingualService,
                private location: Location,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                ) {
        this.appConfig = appConfig;
        this.isNavUploadModalDisplayed = false;
        this.navCsvFile = null;
        this.hasResult = true;
        this.ofiCurrenciesService.getCurrencyList();
    }

    ngOnInit() {
        this.initDatePeriodItems();
        this.initNavHistoryForm();
        this.initSubscriptions();

        this.redux.dispatch(clearRequestedNavFundView());
    }

    /**
     * Get the list of currencies from redux
     *
     * @param {Object[]} data
     * @memberof OfiNavFundView
     */
    getCurrencyList(data) {
        if (data) {
            this.currencyList = data.toJS();
        }
    }

    /**
     * Get the currency symbol
     *
     * @param {number} currencyId
     * @returns {string}
     * @memberof OfiNavFundView
     */
    getCurrencySymbol(currencyId: number): string {
        return model.CurrencySymbols[this.getCurrencyString(currencyId)];
    }

    /**
     * Get the label of the currency (3 characters)
     *
     * @param {number} currencyId
     * @returns {string}
     * @memberof OfiNavFundView
     */
    getCurrencyString(currencyId: number): string {
        try {
            return this.currencyList.find(v => v.id === currencyId).text || 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }

    getFilteredByDateText(): string {
        let navDateFrom: string;
        let navDateTo: string;

        if (this.usingDatePeriodToSearch) {
            const dateArr = this.navHistoryForm.value.datePeriod[0].id.split('|');
            navDateFrom = dateArr[0];
            navDateTo = dateArr[1];
        } else {
            navDateFrom = this.navHistoryForm.value.navDateFrom;
            navDateTo = this.navHistoryForm.value.navDateTo;
        }

        return `${moment(navDateFrom).format('YYYY-MM-DD')} > ${moment(navDateTo).format('YYYY-MM-DD')}`;
    }

    isNavNull(nav: number): boolean {
        return nav === null;
    }

    addNav(): void {
        this.popupService.open(this.navFund, model.NavPopupMode.ADD);
    }

    goToAuditTrail(): void {
        this.router.navigateByUrl(`product-module/net-asset-value/fund-view/${this.navFund.shareId}/audit`);
    }

    editNav(nav: model.NavInfoModel): void {
        const navObj: model.NavInfoModel = immutableHelper.copy(nav);
        navObj.fundShareName = this.navFund.fundShareName;
        navObj.isin = this.navFund.isin;
        // navObj.status = this.navFund.status;

        this.popupService.open(navObj, model.NavPopupMode.EDIT);
    }

    cancelNav(nav: model.NavInfoModel): void {
        const navObj: model.NavInfoModel = immutableHelper.copy(nav);
        navObj.fundShareName = this.navFund.fundShareName;
        navObj.isin = this.navFund.isin;
        navObj.shareId = this.navFund.shareId;

        this.popupService.open(navObj, model.NavPopupMode.DELETE);
    }

    exportCSV(): void {
        const requestData = this.getNavRequestData();

        this.fileDownloader.downLoaderFile({
            method: 'exportNavFundHistory',
            token: this.socketToken,
            shareId: requestData.shareId,
            navDateFrom: requestData.navDateFrom,
            navDateTo: requestData.navDateTo,
            userId: this.userId,
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    handleUploadNavSubmitClick() {
        if (this.navCsvFile) {
            const reader = new FileReader();
            reader.readAsText(this.navCsvFile);

            reader.onload = () => {
                const payload = {
                    navData: JSON.stringify(reader.result),
                    shareIsin: this.navFund.isin.toString(),
                };

                this.ofiNavService.uploadNavFile(
                    'detail',
                    payload,
                    this.redux,
                    res => this.handleUploadNavSuccess(res),
                    err => this.handleUploadNavFail(err),
                );

                this.hasResult = false;
            };
        }
    }

    handleUploadNavSuccess(res) {
        this.resetNavUploadModal();

        if (res) {
            const successMessage = res[1].Data[0].Message.replace('{{shareName}}', `for ${this.navFund.fundShareName}`);

            this.alertService.create(
                'success',
                `
                <table class="table grid">
                    <tbody>
                        <tr>
                            <td class="text-center text-success">${this.translate.translate(successMessage)}</td>
                        </tr>
                    </tbody>
                </table>`,
                {},
                this.translate.translate('NAVs Upload - Success'),
            );
        }
    }

    handleUploadNavFail(err) {
        this.resetNavUploadModal();

        if (err) {
            const errorMessage = err[1].Data[0].Message;

            let alertBody = '<table class="table grid"><tbody><tr><td class="text-center text-danger">';
            alertBody += this.translate.translate('NAVs upload for @fundShareName@ has failed for the following reason:', { 'fundShareName': this.navFund.fundShareName });
            alertBody += `</td></tr><tr><td class="text-center text-danger">${this.translate.translate(errorMessage)}</td></tr></tbody></table>`;

            this.alertService.create(
                'error',
                alertBody,
                {},
                this.translate.translate('NAVs Upload - Error'),
            );
        }
    }

    resetNavUploadModal() {
        this.detailNavCsvFile.nativeElement.value = '';
        this.navCsvFile = null;
        this.isNavUploadModalDisplayed = false;
        this.hasResult = true;

        this.changeDetectorRef.markForCheck();
    }

    private initSubscriptions(): void {
        // fund view
        this.subscriptionsArray.push(this.navFundRequestedOb.subscribe((requested) => {
            this.requestNavFund(requested);
        }));
        this.subscriptionsArray.push(this.navFundOb.subscribe((navFund) => {
            this.updateNavFund(navFund);
        }));
        this.subscriptionsArray.push(this.tokenOb.subscribe((token) => {
            this.socketToken = token;
        }));

        this.subscriptionsArray.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));
    }

    private initNavHistoryForm(): void {
        this.navHistoryForm = new FormGroup({
            navDateFrom: new FormControl(moment().add(-1, 'weeks').add(-1, 'days').format('YYYY-MM-DD')),
            // comment out and default search up to "today"
            // navDateTo: new FormControl(moment().add(-1, 'days').format('YYYY-MM-DD')),
            navDateTo: new FormControl(moment().add(0, 'days').format('YYYY-MM-DD')),
            datePeriod: new FormControl([]),
        });

        this.dateFromConfig.max = moment();
        this.dateToConfig.min = moment();

        this.subscriptionsArray.push(this.navHistoryForm.controls.navDateFrom.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
            this.resetDatePeriodOnDateChange('from');
        }));

        this.subscriptionsArray.push(this.navHistoryForm.controls.navDateTo.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
            this.resetDatePeriodOnDateChange('to');
        }));

        this.subscriptionsArray.push(this.navHistoryForm.controls.datePeriod.valueChanges.subscribe((val: any[]) => {
            if (!val[0]) return;

            this.usingDatePeriodToSearch = true;

            const dateArr = val[0].id.split('|');
            const navDateFrom = moment(dateArr[0]).format('YYYY-MM-DD');
            const navDateTo = moment(dateArr[1]).format('YYYY-MM-DD');

            // mark that date period is triggering nav date range change.
            this.navToChangeTriggeredByDatePeriod = true;
            this.navFromChangeTriggeredByDatePeriod = true;

            this.navHistoryForm.controls.navDateFrom.setValue(navDateFrom);
            this.navHistoryForm.controls.navDateTo.setValue(navDateTo);
        }));

        this.subscriptionsArray.push(this.navHistoryForm.valueChanges.subscribe(() => {
            if (this.navHistoryForm.value.navDateFrom.match('([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))') &&
                this.navHistoryForm.value.navDateTo.match('([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))')) {
                this.clearRequestedHistory();
            }
        }));
    }

    private initDatePeriodItems(): void {
        this.datePeriodItems = this.translate.translate([{
            id: this.generateDatePeriod(-30, 'days', 0, 'days'),
            text: 'Last 30 days',
        }, {
            id: this.generateDatePeriod(-3, 'months', 0, 'days'),
            text: 'Last 3 months',
        }, {
            id: this.generateDatePeriod(-6, 'months', 0, 'days'),
            text: 'Last 6 months',
        }, {
            id: this.generateDatePeriod(-9, 'months', 0, 'days'),
            text: 'Last 9 months',
        }, {
            id: this.generateDatePeriod(-12, 'months', 0, 'days'),
            text: 'Last 12 months',
        }, {
            id: this.generateYearToDatePeriod(),
            text: 'Year to date',
        }, {
            id: this.generateBeginningOfTimePeriod(),
            text: 'Since the beginning',
        }]);
    }

    private generateDatePeriod(fromInt: number, fromStr: string, toInt: number, toStr: string): string {
        return `${moment().add(fromInt as any, fromStr).add(-1, 'days').format('YYYY-MM-DD 00:00:00')}|${moment().add(toInt as any, toStr).format('YYYY-MM-DD 00:00:00')}`;
    }

    private generateYearToDatePeriod(): string {
        return `${moment().startOf('year').format('YYYY-MM-DD 00:00:00')}|${moment().format('YYYY-MM-DD 00:00:00')}`;
    }

    private generateBeginningOfTimePeriod(): string {
        return `${moment('1970-01-01 00:00:00').format('YYYY-MM-DD 00:00:00')}|${moment().format('YYYY-MM-DD 00:00:00')}`;
    }

    /**
     * request the nav fund
     * @param requested boolean
     * @return void
     */
    private requestNavFund(requested: boolean): void {
        if (requested) return;

        const requestData = getOfiNavFundViewCurrentRequest(this.redux.getState());

        OfiNavService.defaultRequestNavFund(this.ofiNavService, this.redux, requestData);
    }

    /**
     * update the nav fund
     * @param navList NavList
     * @return void
     */
    private updateNavFund(navFund: model.NavInfoModel[]): void {
        this.navFund = navFund ? navFund[0] : undefined;

        // fund history
        this.subscriptionsArray.push(this.navFundHistoryRequestedOb.subscribe(requested => {
            this.requestNavFundHistory(requested);
        }));
        this.subscriptionsArray.push(this.navFundHistoryOb.subscribe(navFundHistory => {
            this.updateNavFundHistory(navFundHistory);
        }));

        if (this.navFund) this.redux.dispatch(setRequestedNavFundView());

        this.changeDetectorRef.markForCheck();
    }

    /**
     * request the nav history for fund
     * @param requested boolean
     * @return void
     */
    private requestNavFundHistory(requested: boolean): void {
        if (requested || !this.navFund) return;

        const requestData = this.getNavRequestData();

        OfiNavService.defaultRequestNavHistory(this.ofiNavService, this.redux, requestData);

        this.redux.dispatch(ofiSetCurrentNavFundHistoryRequest(requestData));
    }

    private getNavRequestData(): any {
        let navDateFrom;
        let navDateTo;

        if (this.usingDatePeriodToSearch) {
            const dateArr = this.navHistoryForm.value.datePeriod[0].id.split('|');
            navDateFrom = dateArr[0];
            navDateTo = dateArr[1];
        } else {
            navDateFrom = `${this.navHistoryForm.value.navDateFrom} 00:00:00`;
            navDateTo = `${this.navHistoryForm.value.navDateTo} 00:00:00`;
        }

        return {
            shareId: this.navFund.shareId,
            navDateFrom,
            navDateTo,
        };
    }

    /**
     * update the nav history for fund
     * @param navFundHistory NavFundHistoryItem
     * @return void
     */
    private updateNavFundHistory(navFundHistory: any): void {
        this.navFundHistory = navFundHistory;

        if (this.navFundHistory) this.redux.dispatch(setRequestedNavFundHistory());

        this.changeDetectorRef.markForCheck();
    }

    navToFrontEndString(nav: number): string {
        return this.moneyPipe.transform(this.numberConverterService.toFrontEnd(nav));
    }

    private generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` :
            `http://${window.location.hostname}:9788/${url}`;
    }

    navigateBack() {
        this.location.back();
    }

    private clearRequestedHistory(): void {
        this.redux.dispatch(clearRequestedNavFundHistory());
    }

    /**
     * Reset date period drop down, and do other necessary things.
     * @param type: to or from nav date
     */
    private resetDatePeriodOnDateChange(type: string): void {
        // if the change is trigger by date period, do nothing
        if (this.navToChangeTriggeredByDatePeriod === false && this.navFromChangeTriggeredByDatePeriod === false) {
            this.navHistoryForm.controls.datePeriod.setValue([], { emitEvent: false });
        } else {
            if (type === 'to') {
                this.navToChangeTriggeredByDatePeriod = false;
            }

            if (type === 'from') {
                this.navFromChangeTriggeredByDatePeriod = false;
            }
            this.usingDatePeriodToSearch = false;
        }
    }
}
