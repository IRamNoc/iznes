import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import * as moment from 'moment';

import * as model from '../OfiNav';
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';
import {
    ofiSetCurrentNavFundViewRequest,
    getOfiNavFundViewCurrentRequest
} from '../../ofi-store/ofi-product/nav/nav-fund-view';
import { clearRequestedNavFundView } from '../../ofi-store/ofi-product/nav/nav-fund-view/actions';

@Component({
    selector: 'app-nav-fund-view',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiNavFundView implements OnInit, OnDestroy {
    
    navFund: model.NavInfoModel;

    currentDate: string = moment().format('DD-MM-YY');
    searchDateFrom = moment().add(-1, 'weeks');
    searchDateTo = moment().add(-1, 'days');

    navPopupMode: model.NavPopupMode = model.NavPopupMode.EDIT;
    navObj: model.NavInfoModel = null;

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'requested']) navFundRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'navFundView']) navFundOb: Observable<any>;

    constructor(private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiCorpActionService: OfiCorpActionService,
        private ofiNavService: OfiNavService) { 

        this.initSubscriptions();
    }

    ngOnInit() {
        this.redux.dispatch(clearRequestedNavFundView());
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.navFundRequestedOb.subscribe(requested => {
            this.requestNavFund(requested);
        }));
        this.subscriptionsArray.push(this.navFundOb.subscribe(navFund => {
            this.updateNavFund(navFund);
        }));
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
        this.changeDetectorRef.markForCheck();
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

    ngOnDestroy() {}

}