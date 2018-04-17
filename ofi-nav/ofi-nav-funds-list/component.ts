import {Component, OnInit, OnDestroy, ChangeDetectorRef, Inject} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment';
import * as _ from 'lodash';

import * as model from '../OfiNav';
import {OfiManageNavPopupService} from '../ofi-manage-nav-popup/service';

import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';
import {
    ofiSetCurrentNavFundsListRequest,
    clearRequestedNavFundsList,
    getOfiNavFundsListCurrentRequest,
    ofiSetCurrentNavFundViewRequest,
    clearRequestedNavFundView,
    getOfiNavFundViewCurrentRequest
} from '../../ofi-store/ofi-product/nav';
import {CurrencyValue} from '../../ofi-product/fund-share/fundShareValue';
import {CurrencyEnum} from '../../ofi-product/fund-share/FundShareEnum';
import {NumberConverterService, MoneyValuePipe, APP_CONFIG, AppConfig} from '@setl/utils';

@Component({
    selector: 'app-nav-manage-list',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiNavFundsList implements OnInit, OnDestroy {

    shareListItems: any[];
    navListItems: model.NavModel[];
    socketToken: string;
    userId: number;

    searchForm: FormGroup;
    dateTypes: any[];
    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null
    };

    navPopupMode: model.NavPopupMode = model.NavPopupMode.ADD;

    appConfig: AppConfig;

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundsList', 'requested']) navRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundsList', 'navFundsList']) navListOb: Observable<any>;
    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail', 'userId']) userOb;

    constructor(private router: Router,
                private redux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private ofiCorpActionService: OfiCorpActionService,
                private ofiNavService: OfiNavService,
                private numberConverterService: NumberConverterService,
                private moneyPipe: MoneyValuePipe,
                private popupService: OfiManageNavPopupService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;

    }

    ngOnInit() {
        this.initDataTypes();
        this.initSearchForm();
        this.initSubscriptions();
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.navRequestedOb.subscribe(requested => {
            this.requestNavList(requested);
        }));
        this.subscriptionsArray.push(this.navListOb.subscribe(navList => {
            this.updateNavList(navList);
        }));
        this.subscriptionsArray.push(this.tokenOb.subscribe(token => {
            this.socketToken = token;
        }));
        this.subscriptionsArray.push(this.userOb.subscribe(userId => {
            this.userId = userId;
        }));
    }

    private initSearchForm(): void {
        this.searchForm = new FormGroup({
            shareName: new FormControl(''),
            dateType: new FormControl([this.dateTypes[0]]),
            date: new FormControl(moment().format('YYYY-MM-DD'))
        });

        this.subscriptionsArray.push(this.searchForm.valueChanges.debounceTime(1000).subscribe(() => {
            this.clearRequestedList();
        }));
    }

    /**
     * request the nav list
     * @param requested boolean
     * @return void
     */
    private requestNavList(requested: boolean): void {
        if (requested) return;

        this.changeDetectorRef.detectChanges();

        const requestData = this.getRequestNavListData();

        OfiNavService.defaultRequestNavList(this.ofiNavService, this.redux, requestData);

        this.redux.dispatch(ofiSetCurrentNavFundsListRequest(requestData));
    }

    private getRequestNavListData(): any {
        return {
            fundName: this.searchForm.value.shareName,
            navDateField: this.searchForm.value.dateType[0].id,
            navDate: `${this.searchForm.value.date} 00:00:00`
        }
    }

    /**
     * update the nav list
     * @param navList NavList
     * @return void
     */
    private updateNavList(navList: model.NavModel[]): void {
        this.navListItems = this.processNavList(navList);
        this.changeDetectorRef.markForCheck();
    }

    private processNavList(navList: model.NavModel[]): model.NavModel[] {
        const uniques = _.uniqBy(navList, (e) => {
            return e.fundShareName;
        });

        _.forEach(uniques, (item: model.NavModel) => {
            if(item.navValidated) {
                item.nav = item.navValidated;
            } else if(item.navTechnical) {
                item.nav = item.navTechnical;
            } else {
                item.nav = item.navEstimated;
            }
        });

        return uniques;
    }

    private navToFrontEndString(nav: number): string {
        return this.moneyPipe.transform(this.numberConverterService.toFrontEnd(nav));
    }

    private initDataTypes(): void {
        this.dateTypes = [{
            id: 'navDate',
            text: 'NAV Date'
        }, {
            id: 'navPubDate',
            text: 'NAV Published Date'
        }];
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

    getNextValuationClass(nextValuationDate: string): string {
        const fromNow = moment(nextValuationDate).diff(moment());
        const duration = moment.duration(fromNow);
        const timeBetween = duration.asDays();

        if (timeBetween > 1 && timeBetween < 2) {
            return 'time-orange';
        } else if (timeBetween > 0 && timeBetween < 1) {
            return 'time-red';
        } else {
            return '';
        }
    }

    isNavNull(nav: number): boolean {
        return nav === null;
    }

    addNav(share: model.NavInfoModel): void {
        this.popupService.open(share, model.NavPopupMode.ADD_EXISTING);
    }

    navigateToShare(shareId: number): void {
        const navFundViewRequest: any = getOfiNavFundsListCurrentRequest(this.redux.getState());
        navFundViewRequest.navDate = moment().format('YYYY-MM-DD 00:00:00');
        navFundViewRequest.shareId = shareId;

        this.redux.dispatch(ofiSetCurrentNavFundViewRequest(navFundViewRequest));

        this.router.navigateByUrl(`product-module/nav-fund-view`);
    }

    exportCSV(): void {
        const requestData = this.getRequestNavListData();

        const url = this.generateExportURL(`file?token=${this.socketToken}&userId=${this.userId}&method=exportNavFundShares&shareId=null&fundName=${encodeURIComponent(requestData.fundName)}&navDateField=${requestData.navDateField}&navDate=${encodeURIComponent(requestData.navDate)}`, this.appConfig.production);

        window.open(url, '_blank');
    }

    private generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` :
            `http://${window.location.hostname}:9788/${url}`;
    }

    clearRequestedList(): void {
        this.redux.dispatch(clearRequestedNavFundsList());
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
