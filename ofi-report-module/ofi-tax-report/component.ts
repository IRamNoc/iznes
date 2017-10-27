import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-ofi-tax-report',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiTaxReportComponent implements OnInit {
    tabsControl: Array<any>;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    assetBalances: Array<any>;

    constructor() {
    }

    ngOnInit() {

        /**
         * Default tabs.
         */
        this.tabsControl = [
            {
                title: {
                    icon: 'fa-search',
                    text: 'Search',
                    colorClass: ''
                },
                active: true
            }
        ];

        this.assetBalances = [
            {
                fundName: 'fund 1',
                balance: 1000,
                disposalGainLoss: 100,
                unrealisedGainLoss: 1000
            },
            {
                fundName: 'fund 2',
                balance: 2000,
                disposalGainLoss: 4100,
                unrealisedGainLoss: 81000
            }
        ];
    }
}

