import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
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
    ofiSetCurrentNavFundsListRequest,
    clearRequestedNavFundsList,
    getOfiNavFundsListCurrentRequest,
    ofiSetCurrentNavFundViewRequest,
    clearRequestedNavFundView,
    getOfiNavFundViewCurrentRequest
} from '../../ofi-store/ofi-product/nav';

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
        private popupService: OfiManageNavPopupService) {
        
        
    }
        
    ngOnInit() {
        this.initDataTypes();
        this.initSearchForm();
        this.initSubscriptions();
        this.clearRequestedList();
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

        this.subscriptionsArray.push(this.searchForm.valueChanges.subscribe(() => {
            this.clearRequestedList();
        }));
    }

    /**
     * request the nav list
     * @param requested boolean
     * @return void
     */
    private requestNavList(requested: boolean): void {
        if(requested) return;

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
        this.navListItems = navList;
        this.changeDetectorRef.markForCheck();
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
        return nav === null;
    }
    
    addNav(share: model.NavInfoModel): void {
        this.popupService.open(share, model.NavPopupMode.ADD);
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
        
        const url = this.generateExportURL(`file?token=${this.socketToken}&userId=${this.userId}&method=exportNavFundShares&shareId=null&fundName=${encodeURIComponent(requestData.fundName)}&navDateField=${requestData.navDateField}&navDate=${encodeURIComponent(requestData.navDate)}`, false);
        
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