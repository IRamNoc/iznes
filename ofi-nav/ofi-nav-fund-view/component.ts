import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import * as moment from 'moment';

import * as model from '../OfiNav';
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

    navObj: model.NavInfoModel = null;
    navPopupMode: model.NavPopupMode = model.NavPopupMode.EDIT;

    navHistoryForm: FormGroup;
    
    currentDate: string = moment().format('YYYY-MM-DD');
    dateFromConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null, // TODO,
    }
    dateToConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null, // TODO,
    }
    datePeriodItems: any;


    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'requested']) navFundRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'navFundView']) navFundOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundHistory', 'requested']) navFundHistoryRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundHistory', 'navFundHistory']) navFundHistoryOb: Observable<any>;

    constructor(private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiCorpActionService: OfiCorpActionService,
        private ofiNavService: OfiNavService) { 

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
            // datePeriod: new FormControl([this.datePeriodItems[0]])
        });

        this.dateFromConfig.max = moment().add(-1, 'days');
        this.dateToConfig.max = moment().add(-1, 'days');

        this.navHistoryForm.valueChanges.subscribe(() => {
            this.clearRequestedHistory();
        });
    }

    private initDatePeriodItems(): void {
        this.datePeriodItems = [{
            id: this.generateDatePeriod(-4, 'days', -1, 'days'),
            text: 'Last 3 days'
        }, {
            id: this.generateDatePeriod(-8, 'days', -1, 'days'),
            text: 'Last 7 days'
        }, {
            id: this.generateDatePeriod(-15, 'days', -1, 'days'),
            text: 'Last 14 days'
        }, {
            id: this.generateDatePeriod(-31, 'days', -1, 'days'),
            text: 'Last 30 days'
        }, {
            id: this.generateDatePeriod(-61, 'days', -1, 'days'),
            text: 'Last 60 days'
        }]
    }

    private generateDatePeriod(fromInt: number, fromStr: string, toInt: number, toStr: string): string {
        return `${moment().add(fromInt as any, fromStr).format('YYYY-MM-DD 00:00:00')}|${moment().add(toInt as any, toStr).format('YYYY-MM-DD 00:00:00')}`;
    }

    /**
     * request the nav fund
     * @param requested boolean
     * @return void
     */
    private requestNavFund(requested: boolean): void {
        console.log('XXX-requestNavFund', requested);
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
        console.log('XXX-updateNavFund', navFund);
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
        console.log('XXX-requestNavFundHistory', requested);
        if(requested || !this.navFund) return;

        const requestData = {
            shareId: this.navFund.shareId,
            navDateFrom: `${this.navHistoryForm.value.navDateFrom} 00:00:00`,
            navDateTo: `${this.navHistoryForm.value.navDateTo} 00:00:00`
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
        console.log('XXX-updateNavFundHistory', navFundHistory);
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

    isNavNull(nav: number): boolean {
        return nav == null;
    }

    addNav(): void {
        this.navPopupMode = model.NavPopupMode.ADD;
        this.navFund.lastValue = this.navFund.nav;
        
        const newnavObj = Object.create(this.navFund);
        this.navObj = Object.assign(newnavObj, this.navFund);
    }
    
    editNav(nav: model.NavModel): void {
        this.navPopupMode = model.NavPopupMode.EDIT;
        nav.lastValue = this.navFund.nav;

        const newnavObj = Object.create(nav);
        this.navObj = Object.assign(newnavObj, this.navFund)
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