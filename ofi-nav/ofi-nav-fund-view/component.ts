import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import * as moment from 'moment';

import * as model from '../OfiNav';
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';

@Component({
    selector: 'app-nav-fund-view',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiNavFundView implements OnInit, OnDestroy {
    
    fundNav: model.ShareModel;
    shareId: number;

    nav: model.NavModel = null;

    currentDate: string = moment().format('DD-MM-YY');
    searchDateFrom = moment().add(-10, 'days');
    searchDateTo = moment().add(-1, 'days');

    navPopupMode: model.NavPopupMode = model.NavPopupMode.EDIT;
    navObj: model.NavInfoModel = null;

    // mock
    exportOptions: any[];

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'requested']) navRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundView', 'navFund']) navListOb: Observable<any>;

    constructor(private route: ActivatedRoute,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiCorpActionService: OfiCorpActionService,
        private ofiNavService: OfiNavService) {
        
        route.params.subscribe((params) => {
            this.shareId = parseInt(params.shareId);
        });
    }

    ngOnInit() { }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.navRequestedOb.subscribe(requested => {
            this.requestFundNav(requested);
        }));
        this.subscriptionsArray.push(this.navListOb.subscribe(navList => {
            this.updateNavFund(navList);
        }));
    }

    /**
     * request the nav list
     * @param requested boolean
     * @return void
     */
    private requestFundNav(requested: boolean): void {
        if(requested) return;

        const requestData = {
            shareId: this.shareId,
            fundName: '',
            navDateField: '',
            navDate: moment().format('DD-MM-YY')
        }

        OfiNavService.defaultRequestNav(this.ofiNavService, this.redux, requestData);
    }

    /**
     * update the nav list
     * @param navList NavList
     * @return void
     */
    private updateNavFund(fundNav: model.ShareModel[]): void {
        this.fundNav = fundNav[0];
        this.changeDetectorRef.markForCheck();
    }

    // mock data
    private generateMockData(): void {
        // this.share = {
        //     name: "Mock Share 1",
        //     ISIN: 1000001,
        //     ASM: 'Assets & Son.'
        // }

        // this.nav = {
        //     value: 0.324234234324,
        //     currency: 'GBP',
        //     date: moment().format('DD-MM-YY'),
        //     pubDate: moment().format('DD-MM-YY'),
        //     status: 'Estimated',
        //     aum: 1000,
        //     units: 500
        // }

        // this.mockDataGridItems = [];

        // for(let i = 1; i < 11; i++) {
        //     this.mockDataGridItems.push(this.getGridDataItem(i));
        // }

        // this.mockDatePeriodItems = [{
        //     id: '3',
        //     text: 'last 3 days'
        // }, {
        //     id: '7',
        //     text: 'last 7 days'
        // }, {
        //     id: '14',
        //     text: 'last 14 days'
        // }, {
        //     id: '30',
        //     text: 'last 30 days'
        // }, {
        //     id: '60',
        //     text: 'last 60 days'
        // }]

        this.exportOptions = [{
            id: 'csv',
            text: 'CSV'
        }];
    }

    private getGridDataItem(num: number): model.NavModel {
        // return {
        //     value: Math.random(),
        //     currency: 'GBP',
        //     date: moment().add(-num, 'day').format('DD-MM-YY'),
        //     pubDate: moment().add(-num, 'day').format('DD-MM-YY'),
        //     status: 'Estimated'
        // }
        return
    }

    addNav(): void {
        this.navPopupMode = model.NavPopupMode.ADD;
        this.nav.lastValue = this.nav.value;
        
        const newnavObj = Object.create(this.nav);
        this.navObj = Object.assign(newnavObj, this.fundNav);
    }
    
    editNav(nav: model.NavModel): void {
        this.navPopupMode = model.NavPopupMode.EDIT;
        nav.lastValue = this.nav.value;

        const newnavObj = Object.create(nav);
        this.navObj = Object.assign(newnavObj, this.fundNav)
    }

    ngOnDestroy() {}

}