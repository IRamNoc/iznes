import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import * as moment from 'moment';

import * as model from '../OfiManageNav';

@Component({
    selector: 'app-nav-manage-view',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiManageNavView implements OnInit, OnDestroy {
    
    share: model.ShareModel = null;
    nav: model.NavModel = null;
    currentDate: string = moment().format('DD-MM-YY');

    searchDateFrom = moment().add(-10, 'days');
    searchDateTo = moment().add(-1, 'days');

    navPopupMode: model.NavPopupMode = model.NavPopupMode.EDIT;
    navObj: model.NavInfoModel = null;

    // mock data
    mockDataGridItems: any[];
    mockDatePeriodItems: any[];
    exportOptions: any[];

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.generateMockData();
    }

    // mock data
    private generateMockData(): void {
        this.share = {
            name: "Mock Share 1",
            ISIN: 1000001,
            ASM: 'Assets & Son.'
        }

        this.nav = {
            value: 0.324234234324,
            currency: 'GBP',
            date: moment().format('DD-MM-YY'),
            pubDate: moment().format('DD-MM-YY'),
            status: 'Estimated',
            aum: 1000,
            units: 500
        }

        this.mockDataGridItems = [];

        for(let i = 1; i < 11; i++) {
            this.mockDataGridItems.push(this.getGridDataItem(i));
        }

        this.mockDatePeriodItems = [{
            id: '3',
            text: 'last 3 days'
        }, {
            id: '7',
            text: 'last 7 days'
        }, {
            id: '14',
            text: 'last 14 days'
        }, {
            id: '30',
            text: 'last 30 days'
        }, {
            id: '60',
            text: 'last 60 days'
        }]

        this.exportOptions = [{
            id: 'csv',
            text: 'CSV'
        }];
    }

    private getGridDataItem(num: number): model.NavModel {
        return {
            value: Math.random(),
            currency: 'GBP',
            date: moment().add(-num, 'day').format('DD-MM-YY'),
            pubDate: moment().add(-num, 'day').format('DD-MM-YY'),
            status: 'Estimated'
        }
    }

    addNav(): void {
        this.navPopupMode = model.NavPopupMode.ADD;
        this.nav.lastValue = this.nav.value;
        
        const newnavObj = Object.create(this.nav);
        this.navObj = Object.assign(newnavObj, this.share);
    }
    
    editNav(nav: model.NavModel): void {
        this.navPopupMode = model.NavPopupMode.EDIT;
        nav.lastValue = this.nav.value;

        const newnavObj = Object.create(nav);
        this.navObj = Object.assign(newnavObj, this.share)
    }

    ngOnDestroy() {}

}