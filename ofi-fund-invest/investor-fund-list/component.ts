// Vendor
import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import _ from 'lodash';

// Internal
import {
    MemberService,
} from '@setl/core-req-services';
import {OfiFundInvestService} from '../../ofi-req-services/ofi-fund-invest/service';
import {Subscription} from 'rxjs/Subscription';
import {NumberConverterService, immutableHelper} from '@setl/utils';


@Component({
    selector: 'app-investor-fund-list',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiInvestorFundListComponent implements OnInit, OnDestroy {
    tabsControl: Array<any>;

    fundListObj: any;

    fundList: Array<any>;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];


    // List of redux observable.
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) requestedOfiInvestorFundListOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) fundShareAccessListOb;

    constructor(private _ngRedux: NgRedux<any>,
                private _memberService: MemberService,
                private _changeDetectorRef: ChangeDetectorRef,
                private _numberConverterService: NumberConverterService,
                private _ofiFundInvestService: OfiFundInvestService) {
        /**
         * Default tabs.
         */
        this.tabsControl = [
            {
                title: {
                    icon: 'fa-search',
                    text: 'Search'
                },
                fundShareId: -1,
                fundShareData: {},
                actionType: '',
                active: true
            }
        ];

        this.subscriptionsArray.push(this.requestedOfiInvestorFundListOb.subscribe(
            (requested) => this.requestMyFundAccess(requested)));
        this.subscriptionsArray.push(this.fundShareAccessListOb.subscribe(
            (fundShareAccessList) => this.updateFundList(fundShareAccessList)));

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
     * @return void
     */
    requestMyFundAccess(requested): void {
        if (!requested) {
            OfiFundInvestService.defaultRequestFunAccessMy(this._ofiFundInvestService, this._ngRedux);
        }
    }

    /**
     * Update fund list
     * @param fundList
     */
    updateFundList(fundList): void {
        this.fundListObj = fundList;

        const fundListImu = fromJS(fundList);

        this.fundList = fundListImu.reduce((result, item) => {

            result.push({
                id: item.get('shareId', 0),
                assetManager: item.getIn(['managementCompany'], ''),
                isin: item.getIn(['metaData', 'isin'], ''),
                fundName: item.getIn(['shareName'], ''),
                nav: this._numberConverterService.toFrontEnd(item.getIn(['price'], 0)),
                currency: item.getIn(['metaData', 'portfolioCurrency', '0', 'text'], ''),
                mainClass: item.getIn(['metaData', 'assetClass', '0', 'text'], ''),
                subClass: item.getIn(['metaData', 'subAssetClass', '0', 'text'], ''),
                geographic: item.getIn(['metaData', 'geographicalArea', '0', 'text'], '')
            });

            return result;
        }, []);

        this.tabsControl = immutableHelper.copy(this.tabsControl);

        this._changeDetectorRef.markForCheck();
    }


    setTabActive(index: number): void {

        const tabControlImu = fromJS(this.tabsControl);

        const newTabControlImu = tabControlImu.map((item, thisIndex) => {
            return item.set('active', thisIndex === index);
        });

        this.tabsControl = newTabControlImu.toJS();

    }

    /**
     * Handle subscribe button is click in the list of funds.
     * @param index
     */
    handleSubscribe(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if ((this.tabsControl[i].fundShareId === this.fundList[index].id) && (this.tabsControl[i]['actionType'] === 'subscribe')) {
                this.setTabActive(i);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const fundShareId = _.get(this.fundList, [index, 'id'], 0);
        const fundShareData = _.get(this.fundListObj, [fundShareId], {});
        const fundShareName = _.get(fundShareData, ['shareName'], '');

        this.tabsControl.push({
            title: {
                icon: 'fa-sign-in',
                text: fundShareName,
                colorClass: 'text-primary'
            },
            fundShareId: fundShareId,
            fundShareData: fundShareData,
            actionType: 'subscribe',
            active: false
        });

        // Activate the new tab.
        this.setTabActive(this.tabsControl.length - 1);
    }

    /**
     * Handle redeem button is click in the list of funds.
     * @param index
     */
    handleRedeem(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if ((this.tabsControl[i].fundShareId === this.fundList[index].id) && (this.tabsControl[i]['actionType'] === 'redeem')) {
                this.setTabActive(i);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const fundShareId = _.get(this.fundList, [index, 'id'], 0);
        const fundShareData = _.get(this.fundListObj, [fundShareId], {});
        const fundShareName = _.get(fundShareData, ['shareName'], '');

        this.tabsControl.push({
            title: {
                icon: 'fa-sign-out',
                text: fundShareName,
                colorClass: 'text-success'
            },
            fundShareId: fundShareId,
            fundShareData: fundShareData,
            actionType: 'redeem',
            active: false
        })
        ;

        // Activate the new tab.
        this.setTabActive(this.tabsControl.length - 1);
    }

    /**
     * Handle fund view is click in the list of funds.
     * @param index
     */
    handleView(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if ((this.tabsControl[i].fundShareId === this.fundList[index].id) && (this.tabsControl[i]['actionType'] === 'view')) {
                this.setTabActive(i);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const fundShareId = _.get(this.fundList, [index, 'id'], 0);
        const fundShareData = _.get(this.fundListObj, [fundShareId], {});
        const fundShareName = _.get(fundShareData, ['shareName'], '');

        this.tabsControl.push({
            title: {
                icon: 'fa-eye',
                text: fundShareName,
                colorClass: 'text-primary'
            },
            fundShareId: fundShareId,
            fundShareData: fundShareData,
            actionType: 'view',
            active: false
        })
        ;

        // Activate the new tab.
        this.setTabActive(this.tabsControl.length - 1);
    }

    /**
     * Handle close tab click.
     *
     * @param {index} number - the tab index to close.
     *
     * @return {void}
     */
    closeTab(index: number): void {
        if (!index && index !== 0) {
            return;
        }

        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        // Reset Tabs.
        this.setTabActive(0);

        return;
    }
}
