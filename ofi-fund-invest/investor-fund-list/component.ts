// Vendor
import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import * as _ from 'lodash';

// Internal
import {
    MemberService,
} from '@setl/core-req-services';
import {OfiFundInvestService} from '../../ofi-req-services/ofi-fund-invest/service';
import {Subscription} from 'rxjs/Subscription';
import {NumberConverterService, immutableHelper} from '@setl/utils';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {ofiListOfFundsComponentActions} from '@ofi/ofi-main/ofi-store';
import {isInRootDir} from "@angular/compiler-cli/src/transformers/util";


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

    connectedWalletId: number;

    // production or not
    production: boolean;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];


    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) requestedOfiInvestorFundListOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) fundShareAccessListOb;
    @select(['user', 'siteSettings', 'production']) productionOb;

    constructor(private _ngRedux: NgRedux<any>,
                private _memberService: MemberService,
                private _changeDetectorRef: ChangeDetectorRef,
                private _numberConverterService: NumberConverterService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _ofiFundInvestService: OfiFundInvestService) {
    }

    ngOnInit() {

        this.setInitialTabs();

        this.subscriptionsArray.push(this.productionOb.subscribe(production => this.production = production));
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
            OfiFundInvestService.resetRequested(this._ngRedux).then(() => {this.requestMyFundAccess(false);});
        }));
        this.subscriptionsArray.push(this.requestedOfiInvestorFundListOb.subscribe(
            (requested) => this.requestMyFundAccess(requested)));
        this.subscriptionsArray.push(this.fundShareAccessListOb.subscribe(
            (fundShareAccessList) => this.updateFundList(fundShareAccessList)));

        this.subscriptionsArray.push(this._route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'tabid', 0);
            this.setTabActive(tabId);
        }));

    }

    setInitialTabs() {

        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this._ngRedux.getState(), ['ofi', 'ofiFundInvest', 'ofiListOfFundsComponent', 'openedTabs']);

        if (_.isEmpty(openedTabs)) {
            /**
             * Default tabs.
             */
            this.tabsControl = [
                {
                    title: {
                        icon: 'fa fa-th-list',
                        text: 'Shares Available'
                    },
                    fundShareId: -1,
                    fundShareData: {},
                    actionType: '',
                    active: true
                }
            ];
            return true;
        }

        this.tabsControl = openedTabs;
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }

        this._ngRedux.dispatch(ofiListOfFundsComponentActions.setAllTabs(this.tabsControl));
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestMyFundAccess(requested): void {
        if (!requested) {
            OfiFundInvestService.defaultRequestFunAccessMy(this._ofiFundInvestService, this._ngRedux, this.connectedWalletId);
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
                isin: item.getIn(['metaData', 'isin'], ''),
                shareName: item.getIn(['metaData', 'shareName'], ''),
                assetClass: item.getIn(['metaData', 'assetClass'], ''),
                assetManager: item.getIn(['managementCompany'], ''),
                srri: item.getIn(['metaData', 'srri'], ''),
                sri: item.getIn(['metaData', 'fundSri'], ''),
                currency: item.getIn(['metaData', 'shareCurrency'], ''),
                nav: this._numberConverterService.toFrontEnd(item.getIn(['price'], 0)),
                subscriptionDate: item.getIn(['metaData', 'subscriptionCutOff'], ''),
                redemptionDate: item.getIn(['metaData', 'redemptionCutOff'], '')
            });
            return result;
        }, []);

        this.tabsControl = immutableHelper.copy(this.tabsControl);

        this._changeDetectorRef.markForCheck();
    }


    setTabActive(index: number): void {

        const tabControlImu = fromJS(this.tabsControl);

        const newTabControlImu = tabControlImu.map((item, thisIndex) => {
            return item.set('active', thisIndex === Number(index));
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
                this._router.navigateByUrl(`/list-of-funds/${i}`);

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
                colorClass: 'text-green-title'
            },
            fundShareId: fundShareId,
            fundShareData: fundShareData,
            actionType: 'subscribe',
            active: false,
            formData: {}
        });

        // Activate the new tab.
        this._router.navigateByUrl(`/list-of-funds/${this.tabsControl.length - 1}`);
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
                this._router.navigateByUrl(`/list-of-funds/${i}`);

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
                colorClass: 'text-red-title'
            },
            fundShareId: fundShareId,
            fundShareData: fundShareData,
            actionType: 'redeem',
            active: false,
            formData: {}
        })
        ;

        // Activate the new tab.
        this._router.navigateByUrl(`/list-of-funds/${this.tabsControl.length - 1}`);
    }

    /**
     * Handle buy/sell button is click in the list of funds.
     * @param index
     */
    handleBuySell(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if ((this.tabsControl[i].fundShareId === this.fundList[index].id) && (this.tabsControl[i]['actionType'] === 'buysell')) {
                this._router.navigateByUrl(`/list-of-funds/${i}`);

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
                colorClass: 'text-yellow-title'
            },
            fundShareId: fundShareId,
            fundShareData: fundShareData,
            actionType: 'buysell',
            active: false,
            formData: {}
        })
        ;

        // Activate the new tab.
        this._router.navigateByUrl(`/list-of-funds/${this.tabsControl.length - 1}`);
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
                this._router.navigateByUrl(`/list-of-funds/${i}`);

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
        });

        // Activate the new tab.
        this._router.navigateByUrl(`/list-of-funds/${this.tabsControl.length - 1}`);
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
        this._router.navigateByUrl('/list-of-funds/0');

        return;
    }

    updateFormData(tabId: number, formValue: any): void {
        if (this.tabsControl[tabId] != null) {
            this.tabsControl[tabId].formData = formValue;
        }
    }
}
