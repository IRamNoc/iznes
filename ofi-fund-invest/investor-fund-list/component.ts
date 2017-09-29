// Vendor
import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';

// Internal
import {MemberService} from '@setl/core-req-services';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {OfiFundInvestService} from '../../ofi-req-services/ofi-fund-invest/service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-investor-fund-list',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiInvestorFundListComponent implements OnInit, OnDestroy {
    tabsControl: Array<any>;

    fundList: Array<any> = [
        {
            id: 1,
            assetManager: 'Ofi Asset Manager',
            isin: 'FR000970097',
            fundName: 'OFI RS Dynamique CD',
            nav: 10200,
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
            nav: 1250,
            currency: 'EUR',
            mainClass: 'Convertibles',
            subClass: 'Dynamic',
            geographic: 'EUROPE'
        }
    ];

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // List of redux observable.
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) requestedOfiInvestorFundListOb;

    constructor(private _ngRedux: NgRedux<any>,
                private _alertsService: AlertsService,
                private _memberService: MemberService,
                private _changeDetectorRef: ChangeDetectorRef,
                private _ofiFundInvestService: OfiFundInvestService) {
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

        this.subscriptionsArray.push(this.requestedOfiInvestorFundListOb.subscribe((requested) => this.requestMyFundAccess(requested)));

    }

    ngOnInit() {
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     */
    requestMyFundAccess(requested) {
        if (!requested) {
            OfiFundInvestService.defaultRequestFunAccessMy(this._ofiFundInvestService, this._ngRedux);
        }
    }
}
