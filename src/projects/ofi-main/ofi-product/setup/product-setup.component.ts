import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription, Subject } from 'rxjs';
import { fromJS } from 'immutable';
import * as _ from 'lodash';
import {
	OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { OfiPortfolioMangerService } from '../../ofi-req-services/ofi-portfolio-manager/service';
import * as FundShareModels from '@ofi/ofi-main/ofi-product/fund-share/models';
import { MultilingualService } from '@setl/multilingual';
import {
	TradeCyclePeriodEnum,
} from '@ofi/ofi-main/ofi-product/fund-share/FundShareEnum';

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
	shareListPermitted = [];
	shareListNotPermitted = [];
	fundCurrencyItems = [];
	investorsFundsList = []; 
	investorsFundsShareAccess = [];
	interfundsAuthorization = {};
	panelDefs = [];
	columns = {};

	fundAdministratorItems = {};
	fundCustodianBankItems = {};

	unsubscribe = new Subject<boolean>();
	subscriptions: Array<Subscription> = [];

	@select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListObs;
	@select([
		'ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList',
	]) managementCompanyAccessListObs;
	@select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) requestedShareListObs;
	@select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;

	constructor(private ngRedux: NgRedux<any>,
		private ofiManagementCompanyService: OfiManagementCompanyService,
		private ofiFundService: OfiFundService,
		private ofiFundShareService: OfiFundShareService,
		private changeDetectorRef: ChangeDetectorRef,
		public translate: MultilingualService,
		private ofiPortfolioMangerService: OfiPortfolioMangerService,
		@Inject('product-config') productConfig,
	) {
		this.fundAdministratorItems = productConfig.fundItems.fundAdministratorItems;
		this.fundCustodianBankItems = productConfig.fundItems.custodianBankItems;
	}

	async ngOnInit() {
		this.initColumns();
		this.initPanelDefs();

		this.ofiFundService.getFundList();
		this.ofiManagementCompanyService.getManagementCompanyList();

		// request portfolio managers list using promises
		const reponsePmList = await this.ofiPortfolioMangerService.requestPortfolioManagerListDashboard();
		const pmList = _.get(reponsePmList, '[1].Data', []);
		this.getInvestorsFundsList(pmList);

		this.subscriptions.push(this.fundListObs.subscribe(funds => this.getFundList(funds)));
		this.subscriptions.push(this.managementCompanyAccessListObs
			.subscribe(managementCompanyList => this.getManagementCompanyListFromRedux(managementCompanyList)));
		this.subscriptions.push(this.requestedShareListObs.subscribe(requested => this.requestShareList(requested)));
		this.subscriptions.push(this.shareListObs.subscribe(async shares => {
			// request all investors fund access using promises
			const responseInvestorsFundsShareAccess = await this.ofiFundShareService.requestAllInvestorsFundAccess();
			this.investorsFundsShareAccess = _.get(responseInvestorsFundsShareAccess, '[1].Data', []);
			if (!Object.keys(shares).length) return;
			this.getShareList(shares);
		}));
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
	 * Populate the investors funds list
	 *
	 * @param {object} investorsfunds
	 * @return {void}
	 */
	getInvestorsFundsList(investorsfunds): void {
		const investorFund = [];

		if ((investorsfunds !== undefined) && Object.keys(investorsfunds).length > 0) {
			Object.keys(investorsfunds).map((key) => {
				const investorfund = investorsfunds[key];
				const alreadyExist = _.findIndex(investorFund, { 'pmID': investorfund.pmID });

				const fundAdministrator = _.find(this.fundAdministratorItems, { id: investorfund.fundAdministrator }).text;
				const fundCustodianBank = _.find(this.fundCustodianBankItems, { id: investorfund.fundCustodianBank }).text;

				if (alreadyExist != -1) {
					return investorFund[alreadyExist].data.push({
						fundAdministrator,
						fundCustodianBank,
						fundName: investorfund.fundName,
						walletID: investorfund.walletID,
						investorName: investorfund.investorName,
						portfolioName: investorfund.portfolioName,
						subportfolioBIC: investorfund.subportfolioBIC,
						subportfolioEntityReceivingPaymentInstructions: "N/A",
						subportfolioEntityReceivingPositionCertificates: "N/A",
						subportfolioEntityReceivingTransactionNotices: "N/A",
						subportfolioEtablishmentName: investorfund.subportfolioEtablishmentName,
						subportfolioHashIdentifierCode: investorfund.subportfolioHashIdentifierCode,
						subportfolioIBAN: investorfund.subportfolioIBAN,
						subportfolioName: investorfund.subportfolioName,
						subportfolioSecurityAccount: investorfund.subportfolioSecurityAccount,
					});
				}

				return investorFund.push({
					emailAddress: investorfund.emailAddress,
					firstName: investorfund.firstName,
					lastName: investorfund.lastName,
					type: investorfund.type,
					pmID: investorfund.pmID,
					data: [{
						fundAdministrator,
						fundCustodianBank,
						fundName: investorfund.fundName,
						investorName: investorfund.investorName,
						portfolioName: investorfund.portfolioName,
						subportfolioBIC: investorfund.subportfolioBIC,
						subportfolioEntityReceivingPaymentInstructions: "N/A",
						subportfolioEntityReceivingPositionCertificates: "N/A",
						subportfolioEntityReceivingTransactionNotices: "N/A",
						subportfolioEtablishmentName: investorfund.subportfolioEtablishmentName,
						subportfolioHashIdentifierCode: investorfund.subportfolioHashIdentifierCode,
						subportfolioIBAN: investorfund.subportfolioIBAN,
						subportfolioName: investorfund.subportfolioName,
						subportfolioSecurityAccount: investorfund.subportfolioSecurityAccount,
						walletID: investorfund.walletID,
					}],
				});
			});

			this.investorsFundsList = investorFund;

			_.forEach(this.investorsFundsList, (investor) => {
				this.panelDefs[2].children.push({
					title: `${investor.emailAddress} - ${investor.firstName} ${investor.lastName} - ${investor.type}`,
					isSubtitle: true,
					colored: true,
					columns: [
						this.columns['investorName'],
						this.columns['investorFundName'],
						this.columns['investorPortfolioName'],
						this.columns['investorSubportfolioName'],
						this.columns['investorSubportfolioAddress'],
						this.columns['investorFundCustodianBank'],
						this.columns['investorSubportfolioBank'],
						this.columns['investorSubportfolioBIC'],
						this.columns['investorSubportfolioIBAN'],
						this.columns['investorSubportfolioSecurityAccount'],
						this.columns['investorSubportfolioEntityReceivingPaymentInstructions'],
						this.columns['investorSubportfolioEntityReceivingPositionCertificates'],
						this.columns['investorSubportfolioEntityReceivingTransactionNotices'],
						this.columns['investorFundAdministrator'],
					],
					open: true,
					data: investor.data,
					count: investor.data.length,
				})
			})

			this.panelDefs[2].count = this.investorsFundsList.length;
			this.changeDetectorRef.markForCheck();
		}
	}

	/**
	 * Populate the Share list
	 *
	 * @param {object} shares
	 * @return {void}
	 */
	getShareList(shares): void {
		const shareListPermitted = [];
		const shareListNotPermitted = [];

		if ((shares !== undefined) && Object.keys(shares).length > 0) {
			Object.keys(shares).map((key) => {
				if (Number(shares[key].draft) === 0) {
					const share = shares[key];
					const keyFactsStatus = new FundShareModels.ShareKeyFactsStatus();
					const status = _.find(keyFactsStatus.shareClassInvestmentStatus.listItems, (item) => {
						return item.id === share.shareClassInvestmentStatus;
					}).text;

					if (Number(share.draft) === 0) {
						const custodianBank = _.find(this.fundCustodianBankItems, { id: this.fundList.find(p => p.fundID === Number(share.fundID)).custodianBankID }).text;
						const isPermitted = _.find(this.investorsFundsShareAccess, { shareID: share.fundShareID });
						
						if (isPermitted) {
							shareListPermitted.push({
								fundID: share.fundID,
								fundName: share.fundName,
								fundShareID: share.fundShareID,
								iban: share.iban,
								isin: share.isin,
								fundShareName: share.fundShareName,
								custodianBank,
								tradingAccount: this.fundList.find(p => p.fundID === Number(share.fundID)).tradingAccount,
								subscriptionTradeCyclePeriod: TradeCyclePeriodEnum[share.subscriptionTradeCyclePeriod],
								navPeriodForSubscription: share.navPeriodForSubscription === 0 ? 'D' : share.navPeriodForSubscription > 0 ? `D+${share.navPeriodForSubscription}` : `D${share.navPeriodForSubscription}`,
								subscriptionCutOffTime: share.subscriptionCutOffTime,
								subscriptionCutOffTimeZone: share.subscriptionCutOffTimeZone,
								subscriptionSettlementPeriod: share.subscriptionSettlementPeriod === 0 ? 'D' : share.subscriptionSettlementPeriod > 0 ? `D+${share.subscriptionSettlementPeriod}` : `D${share.subscriptionSettlementPeriod}`,
								subscriptionEnableNonWorkingDay: !share.subscriptionEnableNonWorkingDay ? this.translate.translate("No") : this.translate.translate("Yes"),
								redemptionTradeCyclePeriod: TradeCyclePeriodEnum[share.redemptionTradeCyclePeriod],
								navPeriodForRedemption: share.navPeriodForRedemption === 0 ? 'D' : share.navPeriodForRedemption > 0 ? `D+${share.navPeriodForRedemption}` : `D${share.navPeriodForRedemption}`,
								redemptionCutOffTime: share.redemptionCutOffTime,
								redemptionCutOffTimeZone: share.redemptionCutOffTimeZone,
								redemptionSettlementPeriod: share.redemptionSettlementPeriod === 0 ? 'D' : share.redemptionSettlementPeriod > 0 ? `D+${share.redemptionSettlementPeriod}` : `D${share.redemptionSettlementPeriod}`,
								redemptionEnableNonWorkingDay: !share.redemptionEnableNonWorkingDay ? this.translate.translate("No") : this.translate.translate("Yes"),
								shareClassInvestmentStatus: status,
							});
						} else {
							shareListNotPermitted.push({
								fundID: share.fundID,
								fundName: share.fundName,
								fundShareID: share.fundShareID,
								iban: share.iban,
								isin: share.isin,
								fundShareName: share.fundShareName,
								custodianBank,
								tradingAccount: this.fundList.find(p => p.fundID === Number(share.fundID)).tradingAccount,
								subscriptionTradeCyclePeriod: TradeCyclePeriodEnum[share.subscriptionTradeCyclePeriod],
								navPeriodForSubscription: share.navPeriodForSubscription === 0 ? 'D' : share.navPeriodForSubscription > 0 ? `D+${share.navPeriodForSubscription}` : `D${share.navPeriodForSubscription}`,
								subscriptionCutOffTime: share.subscriptionCutOffTime,
								subscriptionCutOffTimeZone: share.subscriptionCutOffTimeZone,
								subscriptionSettlementPeriod: share.subscriptionSettlementPeriod === 0 ? 'D' : share.subscriptionSettlementPeriod > 0 ? `D+${share.subscriptionSettlementPeriod}` : `D${share.subscriptionSettlementPeriod}`,
								subscriptionEnableNonWorkingDay: !share.subscriptionEnableNonWorkingDay ? this.translate.translate("No") : this.translate.translate("Yes"),
								redemptionTradeCyclePeriod: TradeCyclePeriodEnum[share.redemptionTradeCyclePeriod],
								navPeriodForRedemption: share.navPeriodForRedemption === 0 ? 'D' : share.navPeriodForRedemption > 0 ? `D+${share.navPeriodForRedemption}` : `D${share.navPeriodForRedemption}`,
								redemptionCutOffTime: share.redemptionCutOffTime,
								redemptionCutOffTimeZone: share.redemptionCutOffTimeZone,
								redemptionSettlementPeriod: share.redemptionSettlementPeriod === 0 ? 'D' : share.redemptionSettlementPeriod > 0 ? `D+${share.redemptionSettlementPeriod}` : `D${share.redemptionSettlementPeriod}`,
								redemptionEnableNonWorkingDay: !share.redemptionEnableNonWorkingDay ? this.translate.translate("No") : this.translate.translate("Yes"),
								shareClassInvestmentStatus: status,
							});
						}
					}
				}
			});
		}

		this.shareListPermitted = shareListPermitted;
		this.shareListNotPermitted = shareListNotPermitted;

		this.shareList = [ ...this.shareListPermitted, ...this.shareListNotPermitted];

		this.panelDefs[0].data = this.shareListPermitted;
		this.panelDefs[0].count = this.shareListPermitted.length;

		this.panelDefs[1].data = this.shareListNotPermitted;
		this.panelDefs[1].count = this.shareListNotPermitted.length;
		this.populateInterFundsTable();
		this.changeDetectorRef.markForCheck();
	}

	/**
	 * Populate inter funds table
	 * 
	 */
	async populateInterFundsTable() {

		console.log(this.investorsFundsShareAccess);
		console.log(this.investorsFundsList);

		const funds = [{ label: 'Fund Shares', dataSource: 'fundShare' }, ..._.map(this.fundList, (fund) => this.generateFundsColumn(fund.fundName))];

		const shares = _.map(this.shareList, (share) => {
			return { fundShare: share.fundShareName }
		});


		this.panelDefs[3].data = shares;
		this.panelDefs[3].columns = funds;
		this.panelDefs[3].count = shares.length;
		this.changeDetectorRef.markForCheck();
	}

	generateFundsColumn(fundName) {
		return {
			label: fundName,
			dataSource: fundName,
			sortable: true,
		}
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
					fundList.push({
						fundID: fund.fundID,
						fundName: fund.fundName,
						tradingAccount: fund.tradingAccount,
						custodianBankID: fund.custodianBankID,
					});

				}
			});
		}

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
				label: this.translate.translate(`Funds's IBAN dedicated to IZNES`),
				dataSource: 'iban',
				sortable: true,
			},
			tradingAccount: {
				label: this.translate.translate(`Fund's securities account dedicated to IZNES`),
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

			investorName: {
				label: this.translate.translate('Investor'),
				dataSource: 'investorName',
				sortable: true,
			},
			investorFundName: {
				label: this.translate.translate('Fund Name'),
				dataSource: 'fundName',
				sortable: true,
			},
			investorPortfolioName: {
				label: this.translate.translate('Portfolio Name'),
				dataSource: 'portfolioName',
				sortable: true,
			},
			investorSubportfolioName: {
				label: this.translate.translate('Sub-portfolio Name'),
				dataSource: 'subportfolioName',
				sortable: true,
			},
			investorSubportfolioAddress: {
				label: this.translate.translate('Sub-portfolio Address'),
				dataSource: 'subportfolioHashIdentifierCode',
				sortable: true,
			},
			investorFundCustodianBank: {
				label: this.translate.translate('Fund Custodian Bank'),
				dataSource: 'fundCustodianBank',
				sortable: true,
			},
			investorSubportfolioBank: {
				label: this.translate.translate('Sub-portfolio Bank'),
				dataSource: 'subportfolioEtablishmentName',
				sortable: true,
			},
			investorSubportfolioBIC: {
				label: this.translate.translate('BIC'),
				dataSource: 'subportfolioBIC',
				sortable: true,
			},
			investorSubportfolioIBAN: {
				label: this.translate.translate('Main IBAN'),
				dataSource: 'subportfolioIBAN',
				sortable: true,
			},
			investorSubportfolioSecurityAccount: {
				label: this.translate.translate('AIC securities account'),
				dataSource: 'subportfolioSecurityAccount',
				sortable: true,
			},
			investorSubportfolioEntityReceivingPaymentInstructions: {
				label: this.translate.translate('Subscription payment instructions'),
				dataSource: 'subportfolioEntityReceivingPaymentInstructions',
				sortable: true,
			},
			investorSubportfolioEntityReceivingPositionCertificates: {
				label: this.translate.translate('Position Certificates'),
				dataSource: 'subportfolioEntityReceivingPositionCertificates',
				sortable: true,
			},
			investorSubportfolioEntityReceivingTransactionNotices: {
				label: this.translate.translate('Transaction Notices'),
				dataSource: 'subportfolioEntityReceivingTransactionNotices',
				sortable: true,
			},
			investorFundAdministrator: {
				label: this.translate.translate('Fund Administrator'),
				dataSource: 'fundAdministrator',
				sortable: true,
			},
			hasAccess: {
				label: this.translate.translate('Has Access'),
				dataSource: 'hasAccess',
				sortable: true,
			}
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
				title: 'Authorized IZNES shares',
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
				data: this.shareListPermitted,
				count: this.shareListPermitted.length,
			},
			{
				title: 'IZNES shares pending allocation',
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
				data: this.shareListNotPermitted,
				count: this.shareListNotPermitted.length,
			},
			{
				title: 'Investor Funds authorized in IZNES',
				children: [],
				open: true,
			},
			{
				title: 'Interfunds authorisations',
				open: true,
			}
		];
	}
}
