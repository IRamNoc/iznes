import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable, Subscription, combineLatest as observableCombineLatest } from 'rxjs';
import { fromJS } from 'immutable';
import * as _ from 'lodash';
import {
	OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import * as FundShareModels from '@ofi/ofi-main/ofi-product/fund-share/models';
import { MultilingualService } from '@setl/multilingual';

@Component({
	selector: 'app-product-setup',
	templateUrl: './product-setup.component.html',
	styleUrls: ['./product-setup.component.scss']
})
export class ProductSetupComponent implements OnInit, OnDestroy {

	amManagementCompany = '';
	amManagementCompanyBic = '';
	managementCompanyList = [];
	fundList = [];
	shareList = [];
	fundCurrencyItems = [];
	filteredShareList = [];
	panelDefs = [];
	columns = {};

	subscriptions: Array<Subscription> = [];

	@select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListObs;
	@select([
		'ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList',
	]) managementCompanyAccessListObs;
	@select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) requestedShareListObs;
	@select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;
	@select(['ofi', 'ofiKyc', 'clientReferential', 'requested']) requestedOb;
    @select(['ofi', 'ofiKyc', 'clientReferential', 'clientReferential']) readonly clientReferentialOb: Observable<any[]>;

	constructor(private ngRedux: NgRedux<any>,
		private ofiManagementCompanyService: OfiManagementCompanyService,
		private ofiFundService: OfiFundService,
		private ofiFundShareService: OfiFundShareService,
		private changeDetectorRef: ChangeDetectorRef,
		public translate: MultilingualService,
	) {
		this.ofiFundService.getFundList();
		this.ofiManagementCompanyService.getManagementCompanyList();
	}

	async ngOnInit() {
		this.initColumns();
		this.initPanelDefs();

		this.subscriptions.push(this.fundListObs.subscribe(funds => this.getFundList(funds)));
		this.subscriptions.push(this.managementCompanyAccessListObs
			.subscribe(managementCompanyList => this.getManagementCompanyListFromRedux(managementCompanyList)));
		this.subscriptions.push(this.requestedShareListObs.subscribe(requested => this.requestShareList(requested)));
		this.subscriptions.push(this.shareListObs.subscribe(shares => this.getShareList(shares)));
		this.changeDetectorRef.detectChanges();
	}

	ngOnDestroy(): void {
		/* Detach the change detector on destroy. */
		this.changeDetectorRef.detach();

		this.subscriptions.forEach((subscription: Subscription) => {
			subscription.unsubscribe();
		});
	}

	/**
	 * Get management company informations for Asset Managers
	 *
	 * @param {object} managementCompanyList
	 * @return {void}
	 */
	getManagementCompanyListFromRedux(managementCompanyList) {
		// if no mangement company no need to run this code
		if (Object.keys(managementCompanyList).length === 0) {
			return;
		}

		const managementCompanyListImu = fromJS(managementCompanyList);
		this.managementCompanyList = managementCompanyListImu.reduce(
			(result, item) => {
				result.push({
					companyName: item.get('companyName', ''),
					bic: item.get('bic', '')
				});
				return result;
			},
			[],
		);

		this.amManagementCompany = this.managementCompanyList[0].companyName;
		this.amManagementCompanyBic = this.managementCompanyList[0].bic;
		this.changeDetectorRef.markForCheck();
	}

	/**
	 * Request the Share list
	 *
	 * @return {void}
	 */
	requestShareList(requested): void {
		if (!requested) {
			OfiFundShareService.defaultRequestIznesShareList(this.ofiFundShareService, this.ngRedux);
		}
	}

	/**
	 * Populate the Share list
	 *
	 * @param {object} shares
	 * @return {void}
	 */
	getShareList(shares): void {
		const shareList = [];

		if ((shares !== undefined) && Object.keys(shares).length > 0) {
			Object.keys(shares).map((key) => {
				if (Number(shares[key].draft) === 0) {
					const share = shares[key];
					const keyFactsStatus = new FundShareModels.ShareKeyFactsStatus();
					const status = _.find(keyFactsStatus.shareClassInvestmentStatus.listItems, (item) => {
						return item.id === share.shareClassInvestmentStatus;
					}).text;

					console.log(status);

					const shareCurrency = this.fundCurrencyItems.find(p => p.id === share.shareClassCurrency);

					if (Number(share.draft) === 0) {

						shareList.push({
							fundID: share.fundID,
							fundShareID: share.fundShareID,
							iban: share.iban,
							isin: share.isin,
							fundShareName: share.fundShareName,
							custodianBank: this.fundList.find(p => p.fundID === Number(share.fundID)).custodianBankID,
							tradingAccount: this.fundList.find(p => p.fundID === Number(share.fundID)).tradingAccount,
							subscriptionTradeCyclePeriod: share.subscriptionTradeCyclePeriod,
							navPeriodForSubscription: share.navPeriodForSubscription,
							subscriptionCutOffTime: share.subscriptionCutOffTime,
							subscriptionCutOffTimeZone: share.subscriptionCutOffTimeZone,
							subscriptionSettlementPeriod: share.subscriptionSettlementPeriod,
							subscriptionEnableNonWorkingDay: share.subscriptionEnableNonWorkingDay,
							redemptionTradeCyclePeriod: share.redemptionTradeCyclePeriod,
							navPeriodForRedemption: share.navPeriodForRedemption,
							redemptionCutOffTime: share.redemptionCutOffTime,
							redemptionCutOffTimeZone: share.redemptionCutOffTimeZone,
							redemptionSettlementPeriod: share.redemptionSettlementPeriod,
							redemptionEnableNonWorkingDay: share.redemptionEnableNonWorkingDay,
							shareClassInvestmentStatus: share.shareClassInvestmentStatus, // actif ou non
						});
					}
				}
			});
		}

		this.shareList = shareList;
		this.filteredShareList = this.shareList;

		this.panelDefs[0].data = this.filteredShareList;
		this.panelDefs[0].count = this.filteredShareList.length;
		this.changeDetectorRef.markForCheck();
	}


	/**
	 * Populate the Fund list
	 *
	 * @param {object} funds
	 * @return {void}
	 */
	getFundList(funds: any): void {
		const fundList = [];

		if (_.values(funds).length > 0) {
			_.values(funds).map((fund) => {
				if (Number(fund.draft) === 0) {

					/*
					const domicile = _.find(this.countryItems, { id: fund.domicile }) || { text: '' };
					const lawStatus = _.find(this.legalFormItems, { id: fund.legalForm }) || { text: '' };
					const fundCurrency = this.fundCurrencyItems.find(p => p.id === Number(fund.fundCurrency));
					*/

					fundList.push({
						fundID: fund.fundID,
						fundName: fund.fundName,
						tradingAccount: fund.tradingAccount,
						custodianBankID: fund.custodianBankID,
					});

				}
			});
		}

		// this.panelDefs[1].data = this.fundList;
		// this.panelDefs[1].count = this.fundList.length;
		this.fundList = fundList;
		this.changeDetectorRef.markForCheck();
	}

	/**
	 * Get the currencies list
	 *
	 * @param {object} data - the raw data to convert
	 * @return {void}
	 */
	getCurrencyList(data): void {
		if (data) {
			this.fundCurrencyItems = data.toJS();
		}
	}

	/**
	 * Intialise datagrid columns
	 *
	 * @return {void}
	 */
	initColumns(): void {
		this.columns = {
			isin: {
				label: this.translate.translate('ISIN'),
				dataSource: 'isin',
				sortable: true,
			},
			fundShareName: {
				label: this.translate.translate('Fund Share'),
				dataSource: 'fundShareName',
				sortable: true,
			},
			custodianBank: {
				label: this.translate.translate('Custodian Bank'),
				dataSource: 'custodianBank',
				sortable: true,
			},
			iban: {
				label: this.translate.translate('IBAN'),
				dataSource: 'iban',
				sortable: true,
			},
			tradingAccount: {
				label: this.translate.translate(`Funds's IBAN dedicated to IZNES`),
				dataSource: 'tradingAccount',
				sortable: true,
			},
			subscriptionTradeCyclePeriod: {
				label: this.translate.translate('Subscription Trade Cycle Period'),
				dataSource: 'subscriptionTradeCyclePeriod',
				sortable: true,
			},
			navPeriodForSubscription: {
				label: this.translate.translate('Subscription NAV Date'),
				dataSource: 'navPeriodForSubscription',
				sortable: true,
			},
			subscriptionCutOffTime: {
				label: this.translate.translate('Subscription Cut-off Time'),
				dataSource: 'subscriptionCutOffTime',
				sortable: true,
			},
			subscriptionCutOffTimeZone: {
				label: this.translate.translate('Subscription Time Zone For Cut-off'),
				dataSource: 'subscriptionCutOffTimeZone',
				sortable: true,
			},
			subscriptionSettlementPeriod: {
				label: this.translate.translate('Subscription Settlement Date'),
				dataSource: 'subscriptionSettlementPeriod',
				sortable: true,
			},
			subscriptionEnableNonWorkingDay: {
				label: this.translate.translate('Subscription Enable NAV dates outside working days'),
				dataSource: 'subscriptionEnableNonWorkingDay',
				sortable: true,
			},
			redemptionTradeCyclePeriod: {
				label: this.translate.translate('Redemption Trade Cycle Period'),
				dataSource: 'redemptionTradeCyclePeriod',
				sortable: true,
			},
			navPeriodForRedemption: {
				label: this.translate.translate('Redemption NAV Date'),
				dataSource: 'navPeriodForRedemption',
				sortable: true,
			},
			redemptionCutOffTime: {
				label: this.translate.translate('Redemption Cut-off Time'),
				dataSource: 'redemptionCutOffTime',
				sortable: true,
			},
			redemptionCutOffTimeZone: {
				label: this.translate.translate('Redemption Time Zone For Cut-off'),
				dataSource: 'redemptionCutOffTimeZone',
				sortable: true,
			},
			redemptionSettlementPeriod: {
				label: this.translate.translate('Redemption Settlement Date'),
				dataSource: 'redemptionSettlementPeriod',
				sortable: true,
			},
			redemptionEnableNonWorkingDay: {
				label: this.translate.translate('Redemption Enable NAV dates outside working days'),
				dataSource: 'redemptionEnableNonWorkingDay',
				sortable: true,
			},
		};
	}

	/**
	 * Define panels and their datagrid columns
	 *
	 * @return {void}
	 */
	initPanelDefs(): void {
		this.panelDefs = [
			{
				title: 'Permitted shares for placing orders',
				columns: [
					this.columns['isin'],
					this.columns['fundShareName'],
					this.columns['custodianBank'],
					this.columns['iban'],
					this.columns['tradingAccount'],
					this.columns['subscriptionTradeCyclePeriod'],
					this.columns['navPeriodForSubscription'],
					this.columns['subscriptionCutOffTime'],
					this.columns['subscriptionCutOffTimeZone'],
					this.columns['subscriptionSettlementPeriod'],
					this.columns['subscriptionEnableNonWorkingDay'],
					this.columns['redemptionTradeCyclePeriod'],
					this.columns['navPeriodForRedemption'],
					this.columns['redemptionCutOffTime'],
					this.columns['redemptionCutOffTimeZone'],
					this.columns['redemptionSettlementPeriod'],
					this.columns['redemptionEnableNonWorkingDay'],
				],
				open: true,
				data: this.shareList,
				count: this.shareList.length,
			},
			{
				title: 'Not permitted shares for placing orders',
				columns: [
					this.columns['isin'],
					this.columns['fundShareName'],
					this.columns['custodianBank'],
					this.columns['iban'],
					this.columns['tradingAccount'],
					this.columns['subscriptionTradeCyclePeriod'],
					this.columns['navPeriodForSubscription'],
					this.columns['subscriptionCutOffTime'],
					this.columns['subscriptionCutOffTimeZone'],
					this.columns['subscriptionSettlementPeriod'],
					this.columns['subscriptionEnableNonWorkingDay'],
					this.columns['redemptionTradeCyclePeriod'],
					this.columns['navPeriodForRedemption'],
					this.columns['redemptionCutOffTime'],
					this.columns['redemptionCutOffTimeZone'],
					this.columns['redemptionSettlementPeriod'],
					this.columns['redemptionEnableNonWorkingDay'],
				],
				open: true,
				data: this.shareList,
				count: this.shareList.length,
			},
		];
	}
}
