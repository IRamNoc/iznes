import {Component, OnInit, OnDestroy, ChangeDetectorRef, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';

import * as model from '../OfiNav';
import {OfiManageNavPopupService} from '../ofi-manage-nav-popup/service';

import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';
import {
    ofiSetCurrentNavFundViewRequest,
    getOfiNavFundViewCurrentRequest,
    clearRequestedNavFundView,
    setRequestedNavFundView,
    ofiSetCurrentNavFundHistoryRequest,
    getOfiNavFundHistoryCurrentRequest,
    clearRequestedNavFundHistory,
    setRequestedNavFundHistory
} from '../../ofi-store/ofi-product/nav';
import {CurrencyValue} from '../../ofi-product/fund-share/fundShareValue';
import {CurrencyEnum} from '../../ofi-product/fund-share/FundShareEnum';
import {NumberConverterService, MoneyValuePipe, immutableHelper, APP_CONFIG, AppConfig, FileDownloader} from '@setl/utils';
import {MultilingualService} from '@setl/multilingual';

@Component({
    selector: 'app-nav-fund-view',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
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
        locale: null
    }
    dateToConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null
    }
    datePeriodItems: any;
    usingDatePeriodToSearch: boolean = false;

    appConfig: AppConfig;

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'requested']) navFundRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'navFundView']) navFundOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundHistory', 'requested']) navFundHistoryRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundHistory', 'navFundHistory']) navFundHistoryOb: Observable<any>;
    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail', 'userId']) userOb;

    constructor(private redux: NgRedux<any>,
                private router: Router,
                private changeDetectorRef: ChangeDetectorRef,
                private ofiCorpActionService: OfiCorpActionService,
                private ofiNavService: OfiNavService,
                private numberConverterService: NumberConverterService,
                private moneyPipe: MoneyValuePipe,
                private popupService: OfiManageNavPopupService,
                private _fileDownloader: FileDownloader,
                public _translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;

    }

    ngOnInit() {
        this.initDatePeriodItems();
        this.initNavHistoryForm();
        this.initSubscriptions();

        this.redux.dispatch(clearRequestedNavFundView());
    }

    private initSubscriptions(): void {
        // fund view
        this.subscriptionsArray.push(this.navFundRequestedOb.subscribe(requested => {
            this.requestNavFund(requested);
        }));
        this.subscriptionsArray.push(this.navFundOb.subscribe(navFund => {
            this.updateNavFund(navFund);
        }));
        this.subscriptionsArray.push(this.tokenOb.subscribe(token => {
            this.socketToken = token;
        }));
        this.subscriptionsArray.push(this.userOb.subscribe(userId => {
            this.userId = userId;
        }));
    }

    private initNavHistoryForm(): void {
        this.navHistoryForm = new FormGroup({
            navDateFrom: new FormControl(moment().add(-1, 'weeks').add(-1, 'days').format('YYYY-MM-DD')),
            // comment out and default search up to "today"
            // navDateTo: new FormControl(moment().add(-1, 'days').format('YYYY-MM-DD')),
            navDateTo: new FormControl(moment().add(0, 'days').format('YYYY-MM-DD')),
            datePeriod: new FormControl([])
        });

        this.dateFromConfig.max = moment();
        this.dateToConfig.min = moment();

        this.subscriptionsArray.push(this.navHistoryForm.controls.navDateFrom.valueChanges.subscribe(() => {
            this.usingDatePeriodToSearch = false;
            this.navHistoryForm.controls.datePeriod.setValue([]);
        }));

        this.subscriptionsArray.push(this.navHistoryForm.controls.navDateTo.valueChanges.subscribe(() => {
            this.usingDatePeriodToSearch = false;
            this.navHistoryForm.controls.datePeriod.setValue([]);
        }));

        this.subscriptionsArray.push(this.navHistoryForm.controls.datePeriod.valueChanges.subscribe((val: any[]) => {
            if(!val[0]) return;

            this.usingDatePeriodToSearch = true;

            const dateArr = val[0].id.split('|');
            const navDateFrom = moment(dateArr[0]).format('YYYY-MM-DD');
            const navDateTo = moment(dateArr[1]).format('YYYY-MM-DD');

            this.navHistoryForm.controls.navDateFrom.patchValue(navDateFrom);
            this.navHistoryForm.controls.navDateTo.patchValue(navDateTo);
        }));

        this.subscriptionsArray.push(this.navHistoryForm.valueChanges.subscribe(() => {
            this.clearRequestedHistory();
        }));
    }

    private initDatePeriodItems(): void {
        this.datePeriodItems = [{
            id: this.generateDatePeriod(-30, 'days', 0, 'days'),
            text: 'Last 30 days'
        }, {
            id: this.generateDatePeriod(-3, 'months', 0, 'days'),
            text: 'Last 3 months'
        }, {
            id: this.generateDatePeriod(-6, 'months', 0, 'days'),
            text: 'Last 6 months'
        }, {
            id: this.generateDatePeriod(-9, 'months', 0, 'days'),
            text: 'Last 9 months'
        }, {
            id: this.generateDatePeriod(-12, 'months', 0, 'days'),
            text: 'Last 12 months'
        }, {
            id: this.generateYearToDatePeriod(),
            text: 'Year to date'
        }, {
            id: this.generateBeginningOfTimePeriod(),
            text: 'Since the beginning'
        }]
    }

    private generateDatePeriod(fromInt: number, fromStr: string, toInt: number, toStr: string): string {
        return `${moment().add(fromInt as any, fromStr).add(-1, 'days').format('YYYY-MM-DD 00:00:00')}|${moment().add(toInt as any, toStr).format('YYYY-MM-DD 00:00:00')}`;
    }

    private generateYearToDatePeriod(): string {
        return `${moment().startOf('year').format('YYYY-MM-DD 00:00:00')}|${moment().add(-1, 'days').format('YYYY-MM-DD 00:00:00')}`;
    }

    private generateBeginningOfTimePeriod(): string {
        return `${moment('1970-01-01 00:00:00').format('YYYY-MM-DD 00:00:00')}|${moment().add(-1, 'days').format('YYYY-MM-DD 00:00:00')}`;
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
            navDateFrom: navDateFrom,
            navDateTo: navDateTo
        }
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

    private navToFrontEndString(nav: number): string {
        return this.moneyPipe.transform(this.numberConverterService.toFrontEnd(nav));
    }


    getCurrencySymbol(currency: number): string {
        let currencyIcon;

        switch (currency) {
            case CurrencyEnum.GBP:
                currencyIcon = '£';
                break;
            case CurrencyEnum.EUR:
                currencyIcon = '€';
                break;
            case CurrencyEnum.USD:
                currencyIcon = '$';
                break;
            default:
                currencyIcon = 'N/A';
                break;
        }

        return currencyIcon;
    }

    getCurrencyString(currency: number): string {
        let currencyString;

        switch (currency) {
            case CurrencyEnum.GBP:
                currencyString = 'GBP';
                break;
            case CurrencyEnum.EUR:
                currencyString = 'EUR';
                break;
            case CurrencyEnum.USD:
                currencyString = 'USD';
                break;
            default:
                currencyString = 'N/A';
                break;
        }

        return currencyString;
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

        return `${moment(navDateFrom).format('YYYY-MM-DD')} > ${moment(navDateTo).format('YYYY-MM-DD')}`
    }

    isNavNull(nav: number): boolean {
        return nav === null;
    }

    addNav(): void {
        this.popupService.open(this.navFund, model.NavPopupMode.ADD);
    }

    goToAuditTrail(): void {
        this.router.navigateByUrl(`product-module/nav-fund-view/${this.navFund.shareId}/audit`);
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

        this._fileDownloader.downLoaderFile({
            method: 'exportNavFundHistory',
            token: this.socketToken,
            shareId: requestData.shareId,
            navDateFrom: requestData.navDateFrom,
            navDateTo: requestData.navDateTo,
            userId: this.userId,
        });
    }

    private generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` :
            `http://${window.location.hostname}:9788/${url}`;
    }

    private clearRequestedHistory(): void {
        this.redux.dispatch(clearRequestedNavFundHistory());
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
