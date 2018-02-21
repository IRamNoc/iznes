import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
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

@Component({
    selector: 'app-nav-fund-view',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiNavFundView implements OnInit, OnDestroy {
    
    navFund: model.NavInfoModel;
    navFundHistory: any;

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

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'requested']) navFundRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'navFundView']) navFundOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundHistory', 'requested']) navFundHistoryRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundHistory', 'navFundHistory']) navFundHistoryOb: Observable<any>;

    constructor(private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiCorpActionService: OfiCorpActionService,
        private ofiNavService: OfiNavService,
        private popupService: OfiManageNavPopupService) { 

        this.initDatePeriodItems();
        this.initNavHistoryForm();
        this.initSubscriptions();
    }
        
    ngOnInit() {
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
    }

    private initNavHistoryForm(): void {
        this.navHistoryForm = new FormGroup({
            navDateFrom: new FormControl(moment().add(-1, 'weeks').add(-1, 'days').format('YYYY-MM-DD')),
            navDateTo: new FormControl(moment().add(-1, 'days').format('YYYY-MM-DD')),
            datePeriod: new FormControl([this.datePeriodItems[0]])
        });

        this.dateFromConfig.max = moment().add(-1, 'days');
        this.dateToConfig.max = moment().add(-1, 'days');
        
        this.navHistoryForm.controls.navDateFrom.valueChanges.subscribe(() => {
            this.usingDatePeriodToSearch = false;
        });
        
        this.navHistoryForm.controls.navDateTo.valueChanges.subscribe(() => {
            this.usingDatePeriodToSearch = false;
        });
        
        this.navHistoryForm.controls.datePeriod.valueChanges.subscribe(() => {
            this.usingDatePeriodToSearch = true;
        });

        this.navHistoryForm.valueChanges.subscribe(() => {
            this.clearRequestedHistory();
        });
    }

    private initDatePeriodItems(): void {
        this.datePeriodItems = [{
            id: this.generateDatePeriod(-30, 'days', -1, 'days'),
            text: 'Last 30 days'
        }, {
            id: this.generateDatePeriod(-3, 'months', -1, 'days'),
            text: 'Last 3 months'
        }, {
            id: this.generateDatePeriod(-6, 'months', -1, 'days'),
            text: 'Last 6 months'
        }, {
            id: this.generateDatePeriod(-9, 'months', -1, 'days'),
            text: 'Last 9 months'
        }, {
            id: this.generateDatePeriod(-12, 'months', -1, 'days'),
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
        if(requested) return;

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

        if(this.navFund) this.redux.dispatch(setRequestedNavFundView());

        this.changeDetectorRef.markForCheck();
    }


    /**
     * request the nav history for fund
     * @param requested boolean
     * @return void
     */
    private requestNavFundHistory(requested: boolean): void {
        if(requested || !this.navFund) return;

        let navDateFrom;
        let navDateTo;

        if(this.usingDatePeriodToSearch) {
            const dateArr = this.navHistoryForm.value.datePeriod[0].id.split('|');
            navDateFrom = dateArr[0];
            navDateTo = dateArr[1];
        } else {
            navDateFrom = `${this.navHistoryForm.value.navDateFrom} 00:00:00`;
            navDateTo = `${this.navHistoryForm.value.navDateTo} 00:00:00`;
        }

        const requestData = {
            shareId: this.navFund.shareId,
            navDateFrom: navDateFrom,
            navDateTo: navDateTo
        }

        OfiNavService.defaultRequestNavHistory(this.ofiNavService, this.redux, requestData);

        this.redux.dispatch(ofiSetCurrentNavFundHistoryRequest(requestData));
    }

    /**
     * update the nav history for fund
     * @param navFundHistory NavFundHistoryItem
     * @return void
     */
    private updateNavFundHistory(navFundHistory: any): void {
        this.navFundHistory = navFundHistory;

        if(this.navFundHistory) this.redux.dispatch(setRequestedNavFundHistory());

        this.changeDetectorRef.markForCheck();
    }


    getCurrency(currency: string): string {
        let currencyIcon;

        switch (currency) {
            case 'GBP':
                currencyIcon = '£';                
                break;
            case 'EUR':
                currencyIcon = '€';
                break;
            case 'USD':
                currencyIcon = '$';
                break;
            default:
                currencyIcon = 'N/A';
                break;
        }
        
        return currencyIcon;
    }

    getFilteredByDateText(): string {
        let navDateFrom: string;
        let navDateTo: string;

        if(this.usingDatePeriodToSearch) {
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
    
    editNav(nav: model.NavInfoModel): void {
        const navObj: model.NavInfoModel = nav;
        navObj.fundShareName = this.navFund.fundShareName;
        navObj.isin = this.navFund.isin;
        navObj.status = this.navFund.status;

        this.popupService.open(navObj, model.NavPopupMode.EDIT);
    }

    cancelNav(nav: model.NavInfoModel): void {
        const navObj: model.NavInfoModel = nav;
        navObj.fundShareName = this.navFund.fundShareName;
        navObj.isin = this.navFund.isin;
        navObj.shareId = this.navFund.shareId;
        navObj.status = this.navFund.status;

        this.popupService.open(navObj, model.NavPopupMode.DELETE);
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