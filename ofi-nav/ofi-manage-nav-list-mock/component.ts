import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';

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

    // mock data
    mockDataGridItems: any[];

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

    private getGridDataItem(num: number): any {
        return {
            share: `Mock Share ${num}`,
            ISIN: `100000${num}`,
            NAV: Math.random(),
            navCurrency: 'GBP',
            navDate: moment().format('DD-MM-YY'),
            navPubDate: moment().format('DD-MM-YY'),
            status: 'Estimated'
        }
    }
    
    addNav(): void {
        console.log('Go to add nav page');
    }

    navigateToShare(): void {
        this.router.navigateByUrl('product-module/net-asset-value-view-mock');
    }

    ngOnDestroy() {}

}