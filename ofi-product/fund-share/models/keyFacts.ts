import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareKeyFactsMandatory extends DynamicFormsValidator {
    fundShareName: FormItem = {
        type: FormItemType.text,
        label: 'Full Share Name',
        required: true,
        mltag: 'txt_fundshare_name'
    }
    isin: FormItem = {
        type: FormItemType.text,
        label: 'ISIN',
        required: true,
        mltag: 'txt_fundshare_isin'
    }
    shareClassCode: FormItem = {
        type: FormItemType.text,
        label: 'Share Class Code',
        required: true,
        mltag: 'txt_fundshare_classcode'        
    }
    shareClassCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Currency',
        required: true,
        listItems: [
            { id: E.CurrencyEnum.EUR, text: 'EUR' },
            { id: E.CurrencyEnum.GBP, text: 'GBP' },
            { id: E.CurrencyEnum.USD, text: 'USD' }
        ],
        mltag: 'txt_fundshare_classcurrency'
    }
    subscriptionStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Subscription Period Start Date',
        required: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_substartdate'
    }
    launchDate: FormItem = {
        type: FormItemType.date,
        label: 'Share Class Launch Date',
        required: true,
        mltag: 'txt_fundshare_launchdate'
    }
    shareClassInvestmentStatus: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Investment Status',
        required: true,
        listItems: [
            { id: E.InvestmentStatusEnum.Open, text: 'Open' },
            { id: E.InvestmentStatusEnum.SoftClosed, text: 'Soft closed' },
            { id: E.InvestmentStatusEnum.HardClosed, text: 'Hard Closed' },
            { id: E.InvestmentStatusEnum.ClosedRedemption, text: 'Closed for redemption' },
            { id: E.InvestmentStatusEnum.ClosedSubscriptionRedemption, text: 'Closed for subscription and redemption' }
        ],
        mltag: 'txt_fundshare_classinveststatus'
    }
    status: FormItem = {
        type: FormItemType.list,
        label: 'Share Status',
        required: true,
        listItems: [
            { id: E.StatusEnum.Master, text: 'Master' },
            { id: E.StatusEnum.Feeder, text: 'Feeder' },
            { id: E.StatusEnum.NA, text: 'N/A' }
        ],
        mltag: 'txt_fundshare_status'
    }
    // conditional - status
    feeder: FormItem = {
        type: FormItemType.list,
        label: 'Feeder',
        required: true,
        hidden: () => {
            const val = (this.status.value() as any);
            return (val == undefined || !val[0]) || val[0].id !== E.StatusEnum.Feeder;
        },
        listItems: [],
        mltag: 'txt_fundshare_feeder'
    }
    portfolioCurrencyHedge: FormItem = {
        type: FormItemType.list,
        label: 'Share Currency Hedge',
        required: true,
        listItems: [
            { id: E.CurrencyHedgeEnum.NoHedge, text: 'No Hedge' },
            { id: E.CurrencyHedgeEnum.FullPortfolioHedge, text: 'Full Portfolio Hedge' },
            { id: E.CurrencyHedgeEnum.CurrencyOverlay, text: 'Currency overlay' },
            { id: E.CurrencyHedgeEnum.PartialHedge, text: 'Partial Hedge' }
        ],
        style: [FormItemStyle.BreakOnBefore],
        mltag: 'txt_fundshare_portfoliohedge'
    }
    valuationFrequency: FormItem = {
        type: FormItemType.list,
        label: 'Valuation Frequency',
        required: true,
        listItems: [
            { id: E.ValuationFrequencyEnum.Daily, text: 'Daily' },
            { id: E.ValuationFrequencyEnum.TwiceAWeek, text: 'Twice a week' },
            { id: E.ValuationFrequencyEnum.Weekly, text: 'Weekly' },
            { id: E.ValuationFrequencyEnum.TwiceAMonth, text: 'Twice a month' },
            { id: E.ValuationFrequencyEnum.Monthly, text: 'Monthly' },
            { id: E.ValuationFrequencyEnum.Quarterly, text: 'Quarterly' },
            { id: E.ValuationFrequencyEnum.TwiceAYear, text: 'Twice a Year' },
            { id: E.ValuationFrequencyEnum.Annually, text: 'Annually' },
            { id: E.ValuationFrequencyEnum.AtLeastAnnualy, text: 'At least Annualy' },
            { id: E.ValuationFrequencyEnum.Other, text: 'Other' }
        ],
        style: [FormItemStyle.BreakOnBefore],
        mltag: 'txt_fundshare_valuationfreq'
    }
    historicOrForwardPricing: FormItem = {
        type: FormItemType.list,
        label: 'Historic or Forward Pricing',
        required: true,
        listItems: [
            { id: E.PricingTypeEnum.Historic, text: 'Historic' },
            { id: E.PricingTypeEnum.Forward, text: 'Forward' }
        ],
        mltag: 'txt_fundshare_historforpricing'
    }
    hasCoupon: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Coupon',
        required: true,
        style: [FormItemStyle.SingleRow],
        mltag: 'txt_fundshare_hascoupon'
    }
    // conditional - hasCoupon
    couponType: FormItem = {
        type: FormItemType.list,
        label: 'Coupon type',
        required: true,
        listItems: [
            { id: E.CouponTypeEnum.Interest, text: 'Interest' },
            { id: E.CouponTypeEnum.CapitalGain, text: 'Capital gain' },
            { id: E.CouponTypeEnum.InterestCapitalGain, text: 'Interest & Capital gain' }
        ],
        hidden: () => {
            return this.hasCoupon.value() === false;
        },
        mltag: 'txt_fundshare_coupontype'
    }
    freqOfDistributionDeclaration: FormItem = {
        type: FormItemType.list,
        label: 'Frequency Of Distribution Declaration',
        required: true,
        listItems: [
            { id: E.FrequencyOfDistributionDeclarationEnum.Daily, text: 'Daily' },
            { id: E.FrequencyOfDistributionDeclarationEnum.TwiceAWeek, text: 'Twice a week' },
            { id: E.FrequencyOfDistributionDeclarationEnum.Weekly, text: 'Weekly' },
            { id: E.FrequencyOfDistributionDeclarationEnum.TwiceAMonth, text: 'Twice a month' },
            { id: E.FrequencyOfDistributionDeclarationEnum.Monthly, text: 'Monthly' },
            { id: E.FrequencyOfDistributionDeclarationEnum.Quartely, text: 'Quartely' },
            { id: E.FrequencyOfDistributionDeclarationEnum.TwiceAYear, text: 'Twice a year' },
            { id: E.FrequencyOfDistributionDeclarationEnum.Annually, text: 'Annually' }
        ],
        hidden: () => {
            return this.hasCoupon.value() === false;
        },
        mltag: 'txt_fundshare_freqdistdeclare'
    }
}

export class ShareKeyFactsOptional {
    cusip: FormItem = {
        type: FormItemType.text,
        label: 'CUSIP',
        required: false,
        mltag: 'txt_fundshare_cusip'
    }
    valor: FormItem = {
        type: FormItemType.number,
        label: 'Valor',
        required: false,
        mltag: 'txt_fundshare_valor'
    }
    wkn: FormItem = {
        type: FormItemType.text,
        label: 'WKN',
        required: false,
        mltag: 'txt_fundshare_wkn'
    }
    bloombergCode: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code',
        required: false,
        mltag: 'txt_fundshare_bloombergcode'
    }
    sedol: FormItem = {
        type: FormItemType.text,
        label: 'SEDOL',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_sedol'
    }
    dormantStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Dormant Start Date',
        required: false,
        mltag: 'txt_fundshare_dormantstartdate'
    }
    dormantEndDate: FormItem = {
        type: FormItemType.date,
        label: 'Dormant End Date',
        required: false,
        mltag: 'txt_fundshare_dormantenddate'
    }
    liquidationStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Liquidation Start Date',
        required: false,
        mltag: 'txt_fundshare_liqstartdate'
    }
    terminationDate: FormItem = {
        type: FormItemType.date,
        label: 'Share Class Termination Date',
        required: false,
        mltag: 'txt_fundshare_terminationdate'
    }
    // conditional - classTerminationDate
    terminationDateExplanation: FormItem = {
        type: FormItemType.text,
        label: 'Share Class Termination Date Explanation',
        required: false,
        hidden: () => {
            return (this.terminationDate.value() as string).length === 0;
        },
        mltag: 'txt_fundshare_termdateexplain'
    }
    assetClass: FormItem = {
        type: FormItemType.list,
        label: 'Asset Class',
        required: false,
        listItems: [
            { id: E.AssetClassEnum.Alternatives, text: 'Alternatives' },
            { id: E.AssetClassEnum.Bonds, text: 'Bonds' },
            { id: E.AssetClassEnum.Commodities, text: 'Commodities' },
            { id: E.AssetClassEnum.Convertibles, text: 'Convertibles' },
            { id: E.AssetClassEnum.Diversified, text: 'Diversified' },
            { id: E.AssetClassEnum.Equities, text: 'Equities' },
            { id: E.AssetClassEnum.MoneyMarket, text: 'Money Market' },
            { id: E.AssetClassEnum.Options, text: 'Options' },
            { id: E.AssetClassEnum.PrivateEquity, text: 'Private Equity' },
            { id: E.AssetClassEnum.RealEstate, text: 'Real Estate' }
        ],
        mltag: 'txt_fundshare_assetclass'
    }
    geographicalArea: FormItem = {
        type: FormItemType.list,
        label: 'Geographical Area',
        required: false,
        listItems: [
            { id: E.GeographicalAreaEnum.Asia, text: 'Asia' },
            { id: E.GeographicalAreaEnum.AsiaExJapan, text: 'Asia Ex Japan' },
            { id: E.GeographicalAreaEnum.AsiaPacificExJapan, text: 'Asia Pacific Ex Japan' },
            { id: E.GeographicalAreaEnum.AsiaEM, text: 'Asia EM' },
            { id: E.GeographicalAreaEnum.Europe, text: 'Europe' },
            { id: E.GeographicalAreaEnum.EuropeExUK, text: 'Europe Ex UK' },
            { id: E.GeographicalAreaEnum.EuropeEM, text: 'Europe EM' },
            { id: E.GeographicalAreaEnum.EuropeEuro, text: 'Europe Euro' },
            { id: E.GeographicalAreaEnum.Global, text: 'Global' },
            { id: E.GeographicalAreaEnum.GlobalEM, text: 'Global EM' },
            { id: E.GeographicalAreaEnum.LatinAmericaEM, text: 'Latin America EM' },
            { id: E.GeographicalAreaEnum.MiddleEastAfricaEM, text: 'Middle East & Africa EM' },
            { id: E.GeographicalAreaEnum.UnitedKingdom, text: 'United Kingdom' },
            { id: E.GeographicalAreaEnum.USA, text: 'USA' }
        ],
        mltag: 'txt_fundshare_geoarea'
    }
    srri: FormItem = {
        type: FormItemType.number,
        label: 'SRRI (Synthetic Risk and Reward Indicator)',
        required: false,
        mltag: 'txt_fundshare_srri'
    }
    sri: FormItem = {
        type: FormItemType.number,
        label: 'SRI (Synthetic Risk Indicator)',
        required: false,
        mltag: 'txt_fundshare_sri'
    }
    navHedge: FormItem = {
        type: FormItemType.list,
        label: 'Share Class NAV Hedge',
        required: false,
        listItems: [
            { id: E.NavHedgeEnum.No, text: 'No' },
            { id: E.NavHedgeEnum.YesNav, text: 'Yes, 100% NAV Hedge' },
            { id: E.NavHedgeEnum.YesResidual, text: 'Yes, residual hedge' }
        ],
        mltag: 'txt_fundshare_navhedge'
    }
    distributionPolicy: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Distribution Policy',
        required: false,
        listItems: [
            { id: E.DistributionPolicyEnum.Accumulating, text: 'Accumulating' },
            { id: E.DistributionPolicyEnum.Distributing, text: 'Distributing' },
            { id: E.DistributionPolicyEnum.Both, text: 'Accumulating & distributing' }
        ],
        mltag: 'txt_fundshare_distpolicy'
    }
    lifecycle: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Lifecycle',
        required: false,
        listItems: [
            { id: E.LifecycleEnum.Projected, text: 'Projected' },
            { id: E.LifecycleEnum.ToBeLaunched, text: 'To be launched' },
            { id: E.LifecycleEnum.OfferingPeriod, text: 'Offering period' },
            { id: E.LifecycleEnum.Active, text: 'Active' },
            { id: E.LifecycleEnum.Dormant, text: 'Dormant' },
            { id: E.LifecycleEnum.InLiquidation, text: 'In liquidation' },
            { id: E.LifecycleEnum.Terminated, text: 'Terminated' }
        ],
        mltag: 'txt_fundshare_lifecycle'
    }
    isClassUCITSEligible: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Share Class Eligible For UCITS',
        required: false,
        mltag: 'txt_fundshare_isclassucitseligible'
    }
    isRDRCompliant: FormItem = {
        type: FormItemType.boolean,
        label: 'Is RDR Compliant',
        required: false,
        mltag: 'txt_fundshare_isrdrcompliant'
    }
    isRestrictedToSeparateFeeArrangement: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Restricted To Separate Fee Arrangement',
        required: false,
        mltag: 'txt_fundshare_restricttosepfeearrange'
    }
    hasForcedRedemption: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Forced Redemption',
        required: false,
        mltag: 'txt_fundshare_hasforcedred'
    }
    isETF: FormItem = {
        type: FormItemType.boolean,
        label: 'Is ETF',
        required: false,
        mltag: 'txt_fundshare_isetf'
    }
    indexName: FormItem = {
        type: FormItemType.text,
        label: 'Index Name',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_indexname'
    }
    indexCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Index Currency',
        required: false,
        listItems: [
            { id: E.CurrencyEnum.EUR, text: 'EUR' },
            { id: E.CurrencyEnum.GBP, text: 'GBP' },
            { id: E.CurrencyEnum.USD, text: 'USD' }
        ],
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_indexcurrency'
    }
    indexType: FormItem = {
        type: FormItemType.list,
        label: 'Index Type',
        required: false,
        listItems: [
            { id: E.IndexTypeEnum.Price, text: 'Price' },
            { id: E.IndexTypeEnum.Performance, text: 'Performance' },
            { id: E.IndexTypeEnum.PerformanceNetDividends, text: 'Perfomance net dividends' },
            { id: E.IndexTypeEnum.PerformanceGrossDividends, text: 'Performance gross dividends' }
        ],
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_indextype'
    }
    bloombergUnderlyingIndexCode: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code Of Underlying Index',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_bloomunderlyingindex'
    }
    reutersUnderlyingIndexCode: FormItem = {
        type: FormItemType.text,
        label: 'Reuters Code Of Underlying Index',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_reutersunderlyingindex'
    }
    denominationBase: FormItem = {
        type: FormItemType.number,
        label: 'Denomination Base',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_denombase'
    }
    isETC: FormItem = {
        type: FormItemType.boolean,
        label: 'Is ETC',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_isetc'
    }
    isShort: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Short',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_isshort'
    }
    replicationMethodologyFirstLevel: FormItem = {
        type: FormItemType.list,
        label: 'Replication Methodology First Level',
        required: false,
        listItems: [
            { id: E.ReplicationFirstLevelEnum.Physical, text: 'Physical' },
            { id: E.ReplicationFirstLevelEnum.Synthetical, text: 'Synthetical' },
            { id: E.ReplicationFirstLevelEnum.Others, text: 'Others' }
        ],
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_replicatemethodologyfirst'
    }
    replicationMethodologySecondLevel: FormItem = {
        type: FormItemType.list,
        label: 'Replication Methodology Second Level',
        required: false,
        listItems: [
            { id: E.ReplicationSecondLevelEnum.Full, text: 'Full' },
            { id: E.ReplicationSecondLevelEnum.Optimized, text: 'Optimized (equities) – Sampled (bonds)' },
            { id: E.ReplicationSecondLevelEnum.PhysicalBacked, text: 'Physical backed' },
            { id: E.ReplicationSecondLevelEnum.UnfundedSwap, text: 'Unfunded swap' },
            { id: E.ReplicationSecondLevelEnum.FundedSwap, text: 'Funded swap' },
            { id: E.ReplicationSecondLevelEnum.Combination, text: 'Combination unfunded and funded swap' },
            { id: E.ReplicationSecondLevelEnum.Futures, text: 'Futures' }
        ],
        hidden: () => {
            return this.isETF.value() !== true;
        },
        mltag: 'txt_fundshare_replicatemethodologysecond'
    }
    hasPRIIPDataDelivery: FormItem = {
        type: FormItemType.boolean,
        label: 'Has PRIIP Data Delivery',
        required: false,
        mltag: 'txt_fundshare_haspriipdate'
    }
    hasUCITSDataDelivery: FormItem = {
        type: FormItemType.boolean,
        label: 'Has UCITS Data Delivery',
        required: false,
        mltag: 'txt_fundshare_hasucitsdelivery'
    }
    ucitsKiidUrl: FormItem = {
        type: FormItemType.text,
        label: 'UCITS KIID URL',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_ucitskiidurl'
    }
    internalReference: FormItem = {
        type: FormItemType.text,
        label: 'Internal Reference',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_internalref'
    }
    additionalComments: FormItem = {
        type: FormItemType.textarea,
        label: 'Additional Comments',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_additionalcomments'
    }
}