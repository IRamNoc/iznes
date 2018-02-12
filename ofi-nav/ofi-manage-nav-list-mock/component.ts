import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';

import * as model from '../OfiManageNav';

@Component({
    selector: 'app-nav-manage-list',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiManageNavList implements OnInit, OnDestroy {
    
    dateTypes: any[];
    searchDate: Date;
    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null // TODO
    };

    navPopupMode: model.NavPopupMode = model.NavPopupMode.ADD;
    addNavShare: model.NavModel = null;

    // mock data
    mockDataGridItems: model.NavInfoModel[];

    constructor(private router: Router) {}

    ngOnInit() {
        this.initDataTypes();
        this.generateMockData();
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

    // mock data
    private generateMockData(): void {
        this.mockDataGridItems = [];

        for(let i = 1; i < 11; i++) {
            this.mockDataGridItems.push(this.getGridDataItem(i));
        }
    }

    private getGridDataItem(num: number): model.NavInfoModel {
        return {
            name: `Mock Share ${num}`,
            ISIN: parseInt(`100000${num}`),
            value: 0,
            lastValue: Math.random(),
            currency: 'GBP',
            date: moment().format('DD-MM-YY'),
            pubDate: moment().format('DD-MM-YY'),
            status: 'Estimated'
        }
    }
    
    addNav(share: model.NavInfoModel): void {
        this.addNavShare = share;
    }

    navigateToShare(): void {
        this.router.navigateByUrl('product-module/net-asset-value-view-mock');
    }

    ngOnDestroy() {}

}