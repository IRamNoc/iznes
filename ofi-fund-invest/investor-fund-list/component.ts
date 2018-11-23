// Vendor
import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { fromJS } from 'immutable';
import * as _ from 'lodash';
import { combineLatest as observableCombineLatest, Subscription } from 'rxjs';

// Internal
import {
    MemberService,
} from '@setl/core-req-services';
import { OfiFundInvestService } from '../../ofi-req-services/ofi-fund-invest/service';
import { NumberConverterService, immutableHelper } from '@setl/utils';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ofiListOfFundsComponentActions, clearRequestedFundAccessMy } from '@ofi/ofi-main/ofi-store';
import * as FundShareValue from '../../ofi-product/fund-share/fundShareValue';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { CalendarHelper } from '../../ofi-product/fund-share/helper/calendar-helper';
import { OrderType } from '../../ofi-orders/order.model';
import { HoldingByAsset } from '@setl/core-store/wallet/my-wallet-holding';
import { ReportingService } from '@setl/core-balances/reporting.service';
import { SellBuyCalendar } from '../../ofi-product/fund-share/FundShareEnum';
import { setRequestedFundAccessMy } from '../../ofi-store/ofi-fund-invest';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-investor-fund-list',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
})

export class OfiInvestorFundListComponent implements OnInit, OnDestroy {
    @Input() isImported: boolean;
    @Input() linkRoute: string;

    tabsControl: Array<any>;
    fundListObj: any;
    fundList: Array<any>;
    connectedWalletId: number;

    // production or not
    production: boolean;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    allowOrder = true;
    walletBalances: any;

    language = 'en';

    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['user', 'siteSettings', 'language']) readonly requestedLanguage$;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) requestedOfiInvestorFundListOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) fundShareAccessListOb;
    @select(['user', 'siteSettings', 'production']) productionOb;
    @select(['wallet', 'myWalletHolding', 'holdingByAsset']) balancesOb;

    constructor(private ngRedux: NgRedux<any>,
                private memberService: MemberService,
                private changeDetectorRef: ChangeDetectorRef,
                private numberConverterService: NumberConverterService,
                private route: ActivatedRoute,
                private router: Router,
                private alerts: AlertsService,
                private reportingService: ReportingService,
                private ofiFundInvestService: OfiFundInvestService,
                public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        this.setInitialTabs();
        this.changeDetectorRef.detectChanges();

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connected) => {
            this.connectedWalletId = connected;
            this.ngRedux.dispatch(clearRequestedFundAccessMy());
            if (this.connectedWalletId !== 0) {
                this.subscriptionsArray.push(this.requestedOfiInvestorFundListOb.subscribe(
                    requested => this.requestMyFundAccess(requested)));
            }
        }));
        this.subscriptionsArray.push(this.productionOb.subscribe(production => this.production = production));

        const combinedFundShare$ = observableCombineLatest(this.fundShareAccessListOb, this.balancesOb);
        this.subscriptionsArray.push(combinedFundShare$.subscribe(
            ([fundShareAccessList, balances]) => this.updateFundList(fundShareAccessList, balances)));

        this.subscriptionsArray.push(this.route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'tabid', 0);
            this.setTabActive(tabId);
        }));

        this.subscriptionsArray.push(this.balancesOb.subscribe((walletsbalances) => {
            this.walletBalances = walletsbalances[this.connectedWalletId];
            this.changeDetectorRef.markForCheck();
        }));

        this.subscriptionsArray.push(this.requestedLanguage$.subscribe((language) => {
            this.language = language;
            this.setInitialTabs();
        }));
    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['ofi', 'ofiFundInvest', 'ofiListOfFundsComponent', 'openedTabs']);

        if (_.isEmpty(openedTabs)) {
            /**
             * Default tabs.
             */
            this.tabsControl = [
                {
                    title: {
                        icon: 'fa fa-th-list',
                        text: this.translate.translate('Shares Available'),
                    },
                    fundShareId: -1,
                    fundShareData: {},
                    actionType: '',
                    active: true,
                },
            ];
            return true;
        }

        this.tabsControl = openedTabs;

        // Translate title of default tab on init (if openedTabs is not empty) and on language change
        this.tabsControl[0].title.text = this.translate.translate(this.tabsControl[0].title.text);
        this.changeDetectorRef.detectChanges();
    }

    getDisplay() {
        return (this.isImported) ? 'none' : 'block';
    }

    getLinkRoute() {
        return (!!this.linkRoute) ? this.linkRoute : 'list-of-funds/0';
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestMyFundAccess(requested): void {
        if (!requested) {
            OfiFundInvestService.defaultRequestFunAccessMy(this.ofiFundInvestService, this.ngRedux, this.connectedWalletId);
        }
    }

    /**
     * Update fund list
     * @param fundList
     */
    updateFundList(fundList, balances): void {
        this.fundListObj = fundList;

        const fundListImu = fromJS(fundList);

        this.fundList = fundListImu.reduce(
            (result, item) => {
                // get next subscription cutoff.
                const nextSubCutOff = new CalendarHelper(item.toJS()).getNextCutoffDate(OrderType.Subscription);

                // get next redemption cutoff.
                const nextRedCutOff = new CalendarHelper(item.toJS()).getNextCutoffDate(OrderType.Redemption);

                const nav = this.numberConverterService.toFrontEnd(item.get('price', 0));
                const isin = item.get('isin', '');
                const shareName = item.get('fundShareName', '');

                let position = _.get(balances, [this.connectedWalletId, `${isin}|${shareName}`, 'free'], 'N/A');
                let totalPosition = _.get(balances, [this.connectedWalletId, `${isin}|${shareName}`, 'total'], 'N/A');

                if (!isNaN(position)) {
                    position = this.numberConverterService.toFrontEnd(position);
                }

                if (!isNaN(totalPosition)) {
                    totalPosition = this.numberConverterService.toFrontEnd(totalPosition);
                }

                result.push({
                    id: item.get('fundShareID', 0),
                    isin,
                    shareName,
                    assetClass: item.get('shareClassCode', ''),
                    assetManager: item.get('companyName', ''),
                    srri: item.getIn(['keyFactOptionalData', 'srri', 0, 'text'], ''),
                    sri: item.getIn(['keyFactOptionalData', 'sri', 0, 'text'], ''),
                    currency: FundShareValue.CurrencyValue[item.get('shareClassCurrency', '')],
                    nav,
                    nextSubCutOff: nextSubCutOff.format('YYYY-MM-DD HH:mm'),
                    nextRedCutOff: nextRedCutOff.format('YYYY-MM-DD HH:mm'),
                    hasNoNav: Boolean(nav <= 0),
                    position,
                    totalPosition,
                    allowSellBuy: item.get('allowSellBuy', 0),
                });

                return result;
            },
            [],
        );

        this.tabsControl = immutableHelper.copy(this.tabsControl);

        this.changeDetectorRef.markForCheck();
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
     * @param shareId
     */
    handleSubscribe(shareId: number): any {
        if (!this.allowOrder) {
            this.alerts.create('warning', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-warning">${this.translate.translate('Subscription is not available in current version.')}</td>
                    </tr>
                </tbody>
            </table>
        `);
            return false;
        }

        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if ((this.tabsControl[i].fundShareId === shareId) && (this.tabsControl[i]['actionType'] === 'subscribe')) {
                this.router.navigateByUrl(`/list-of-funds/${i}`);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const fundShareData = _.get(this.fundListObj, [shareId], {});
        const fundShareName = _.get(fundShareData, ['fundShareName'], '');

        this.tabsControl.push({
            title: {
                icon: 'fa-sign-in',
                text: fundShareName,
                colorClass: 'text-green-title',
            },
            fundShareId: shareId,
            fundShareData,
            actionType: 'subscribe',
            active: false,
            formData: {},
        });

        // Activate the new tab.
        this.router.navigateByUrl(`/list-of-funds/${this.tabsControl.length - 1}`);
    }

    /**
     * Handle redeem button is click in the list of funds.
     * @param shareId
     */
    handleRedeem(shareId: number): any {
        if (!this.allowOrder) {
            this.alerts.create('warning', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-warning">${this.translate.translate('Redemption is not available in the current version.')}</td>
                    </tr>
                </tbody>
            </table>
        `);
            return false;
        }

        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if ((this.tabsControl[i].fundShareId === shareId) && (this.tabsControl[i]['actionType'] === 'redeem')) {
                this.router.navigateByUrl(`/list-of-funds/${i}`);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const fundShareData = _.get(this.fundListObj, [shareId], {});
        const fundShareName = _.get(fundShareData, ['fundShareName'], '');

        this.tabsControl.push({
            title: {
                icon: 'fa-sign-out',
                text: fundShareName,
                colorClass: 'text-red-title',
            },
            fundShareId: shareId,
            fundShareData,
            actionType: 'redeem',
            active: false,
            formData: {},
        });

        // Activate the new tab.
        this.router.navigateByUrl(`/list-of-funds/${this.tabsControl.length - 1}`);
    }

    /**
     * Handle buy/sell button is click in the list of funds.
     * @param index
     */
    handleBuySell(shareId: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if ((this.tabsControl[i].fundShareId === shareId) && (this.tabsControl[i]['actionType'] === 'sellbuy')) {
                this.router.navigateByUrl(`/list-of-funds/${i}`);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const fundShareData = _.get(this.fundListObj, [shareId], {});
        const fundShareName = _.get(fundShareData, ['fundShareName'], '');

        this.tabsControl.push({
            title: {
                icon: 'fa-circle-o-notch',
                text: fundShareName,
                colorClass: 'text-orange-title',
            },
            fundShareId: shareId,
            fundShareData,
            actionType: 'sellbuy',
            active: false,
            formData: {},
        });

        // Activate the new tab.
        this.router.navigateByUrl(`/list-of-funds/${this.tabsControl.length - 1}`);
    }

    /**
     * Handle fund view is click in the list of funds.
     * @param index
     */
    handleView(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if ((this.tabsControl[i].fundShareId === this.fundList[index].id) && (this.tabsControl[i]['actionType'] === 'view')) {
                this.router.navigateByUrl(`/list-of-funds/${i}`);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const fundShareId = _.get(this.fundList, [index, 'id'], 0);
        const fundShareData = _.get(this.fundListObj, [fundShareId], {});
        const fundShareName = _.get(fundShareData, ['shareName'], '');
        const fundShareIsin = _.get(fundShareData, ['isin'], '');

        this.tabsControl.push({
            title: {
                icon: 'fa-eye',
                text: fundShareName + ' ' + fundShareIsin,
                colorClass: 'text-primary',
            },
            fundShareId,
            fundShareData,
            actionType: 'view',
            active: false,
        });

        // Activate the new tab.
        this.router.navigateByUrl(`/list-of-funds/${this.tabsControl.length - 1}`);
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
        this.router.navigateByUrl('/list-of-funds/0');

        return;
    }

    updateFormData(tabId: number, formValue: any): void {
        if (this.tabsControl[tabId] != null) {
            this.tabsControl[tabId].formData = formValue;
        }
    }

    // Get largest balance in any of the address
    hasShareBalanceInAnyAddress(assetName): boolean {
        const breakDown = _.get(this.walletBalances, [assetName, 'breakdown'], 0);

        for (const balance of breakDown) {
            const free = balance.free;
            if (free > 0) {
                return true;
            }
        }

        return false;
    }

    disableRedeem(assetName): string {
        const hasShare = this.hasShareBalanceInAnyAddress(assetName);
        return hasShare ? null : '';
    }

    /**
     * Check if a is allow to place sell buy order.
     *
     * @param {{allowSellBuy: boolean}} share
     * @return {boolean}
     */
    allowSellBuy(share: { allowSellBuy: number }): boolean {
        return (share.allowSellBuy === 1);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }

        this.ngRedux.dispatch(ofiListOfFundsComponentActions.setAllTabs(this.tabsControl));
    }
}
