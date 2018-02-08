import {Component, OnInit, OnDestroy} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-nav-manage-view',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiManageNavView implements OnInit, OnDestroy {
    
    currentDate: string = moment().format('DD-MM-YY');

    // mock data
    mockDataGridItems: any[];
    exportOptions: any[];

    constructor() {}

    ngOnInit() {
        this.generateMockData();
    }

    // mock data
    private generateMockData(): void {
        this.mockDataGridItems = [];

        for(let i = 1; i < 11; i++) {
            this.mockDataGridItems.push(this.getGridDataItem(i));
        }

        this.exportOptions = [{
            id: 'csv',
            text: 'CSV'
        }];
    }

    private getGridDataItem(num: number): any {
        return {
            share: `Mock Share 1`,
            ISIN: `1000001`,
            NAV: Math.random(),
            navCurrency: 'GBP',
            navDate: moment().add(-num, 'day').format('DD-MM-YY'),
            navPubDate: moment().add(-num, 'day').format('DD-MM-YY'),
            status: 'Estimated'
        }
    }

    ngOnDestroy() {}

}