import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';

import * as model from '../OfiNav';

import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';
import {
    ofiSetCurrentNavFundsListRequest,
    clearRequestedNavFundsList,
    getOfiNavFundsListCurrentRequest
} from '../../ofi-store/ofi-product/nav';

@Component({
    selector: 'app-nav-manage-list',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiNavFundsList implements OnInit, OnDestroy {

    shareListItems: any[];
    navListItems: any[];
    
    searchForm: FormGroup;
    dateTypes: any[];
    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null // TODO
    };

    navPopupMode: model.NavPopupMode = model.NavPopupMode.ADD;
    addNavShare: model.NavModel = null;

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundsList', 'requested']) navRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundsList', 'navFundsList']) navListOb: Observable<any>;

    constructor(private router: Router,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiCorpActionService: OfiCorpActionService,
        private ofiNavService: OfiNavService) {
        
        this.initSubscriptions();
        this.initDataTypes();
        this.initSearchForm();
        this.clearRequestedList();
    }
        
    ngOnInit() { }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.navRequestedOb.subscribe(requested => {
            this.requestNavList(requested);
        }));
        this.subscriptionsArray.push(this.navListOb.subscribe(navList => {
            this.updateNavList(navList);
        }));
    }

    private initSearchForm(): void {
        this.searchForm = new FormGroup({
            shareName: new FormControl(''),
            dateType: new FormControl([this.dateTypes[0]]),
            date: new FormControl('')
        });

        this.searchForm.valueChanges.subscribe(() => {
            this.clearRequestedList();
        });
    }

    /**
     * request the nav list
     * @param requested boolean
     * @return void
     */
    private requestNavList(requested: boolean): void {
        if(requested) return;

        const requestData = {
            fundName: this.searchForm.value.shareName,
            navDateField: this.searchForm.value.dateType[0].id,
            navDate: this.searchForm.value.date
        }

        OfiNavService.defaultRequestNav(this.ofiNavService, this.redux, requestData);
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
    
    addNav(share: model.NavInfoModel): void {
        this.addNavShare = share;
    }

    navigateToShare(shareId: number): void {
        this.router.navigateByUrl(`product-module/net-asset-value/${shareId}`);
    }

    clearRequestedList(): void {
        this.redux.dispatch(clearRequestedNavFundsList());
    }

    ngOnDestroy() {}

}