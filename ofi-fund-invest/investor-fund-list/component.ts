// Vendor
import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {NgRedux} from '@angular-redux/store';

// Internal
import {MemberService} from '@setl/core-req-services';
import {AlertsService} from '@setl/jaspero-ng2-alerts';

@Component({
    selector: 'app-investor-fund-list',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiInvestorFundListComponent implements OnInit {
    tabsControl: Array<any>;

    fundList: Array<any> = [
        {
            id: 1,
            assetManager: 'Ofi Asset Manager',
            isin: 'FR000970097',
            fundName: 'OFI RS Dynamique CD',
            nav: '102,00',
            currency: 'EUR',
            mainClass: 'Diversified',
            subClass: 'Dynamic',
            geographic: 'EUROPE'
        },
        {
            id: 2,
            assetManager: 'Ofi AM',
            isin: 'ISINOLD',
            fundName: 'New Fund',
            nav: '12,50',
            currency: 'EUR',
            mainClass: 'Convertibles',
            subClass: 'Dynamic',
            geographic: 'EUROPE'
        }
    ];

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private memberService: MemberService,
                private changeDetectorRef: ChangeDetectorRef) {
        /**
         * Default tabs.
         */
        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                memberId: -1,
                active: true
            }
        ];

    }

    ngOnInit() {
    }
}
