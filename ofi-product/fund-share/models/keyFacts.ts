import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/core-dynamic-forms';
import * as E from '../FundShareEnum';

export class ShareKeyFactsMandatory extends DynamicFormsValidator {
    fundShareName: FormItem = {
        type: FormItemType.text,
        label: 'Full Share Name',
        required: true
    }
    isin: FormItem = {
        type: FormItemType.text,
        label: 'ISIN',
        required: true
    }
    shareClassCode: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Code',
        required: true,
        listItems: [
            { id: E.ClassCodeEnum.ClassA, text: 'Class A' },
            { id: E.ClassCodeEnum.ClassC, text: 'Class C' },
            { id: E.ClassCodeEnum.ClassD, text: 'Class D' },
            { id: E.ClassCodeEnum.ClassR, text: 'Class R' },
            { id: E.ClassCodeEnum.ClassI, text: 'Class I' }
        ]
    }
    shareClassCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Currency',
        required: true,
        listItems: [
            { id: E.CurrencyEnum.EUR, text: 'EUR' },
            { id: E.CurrencyEnum.GBP, text: 'GBP' },
            { id: E.CurrencyEnum.USD, text: 'USD' }
        ]
    }
    subscriptionStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Subscription Period Start Date',
        required: true,
        style: [FormItemStyle.BreakOnAfter]
    }
    launchDate: FormItem = {
        type: FormItemType.date,
        label: 'Share Class Launch Date',
        required: true
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
        ]
    }
    aumClass: FormItem = {
        type: FormItemType.number,
        label: 'AuM Share Class',
        required: true
    }
    aumClassDate: FormItem = {
        type: FormItemType.date,
        label: 'AuM Share Class Date',
        required: true
    }
    nosClass: FormItem = {
        type: FormItemType.number,
        label: 'NoS Share Class',
        required: true
    }
    nosClassDate: FormItem = {
        type: FormItemType.date,
        label: 'NoS Share Class Date',
        required: true
    }
    valuationNAV: FormItem = {
        type: FormItemType.number,
        label: 'Valuation NAV',
        required: true
    }
    valuationNAVDate: FormItem = {
        type: FormItemType.date,
        label: 'Valuation NAV Date',
        required: true
    }
    status: FormItem = {
        type: FormItemType.list,
        label: 'Share Status',
        required: true,
        listItems: [
            { id: E.StatusEnum.Master, text: 'Master' },
            { id: E.StatusEnum.Feeder, text: 'Feeder' },
            { id: E.StatusEnum.NA, text: 'N/A' }
        ]
    }
    // conditional - status
    master: FormItem = {
        type: FormItemType.text,
        label: 'Master',
        required: true,
        hidden: () => {
            const val = (this.status.value() as any);
            return (val == undefined) || val.id !== E.StatusEnum.Master;
        }
    }
    feeder: FormItem = {
        type: FormItemType.text,
        label: 'Feeder',
        required: true,
        hidden: () => {
            const val = (this.status.value() as any);
            return (val == undefined) || val.id !== E.StatusEnum.Feeder;
        }
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
        style: [FormItemStyle.BreakOnBefore]
    }
    historicOrForwardPricing: FormItem = {
        type: FormItemType.list,
        label: 'Historic or Forward Pricing',
        required: true,
        listItems: [
            { id: E.PricingTypeEnum.Historic, text: 'Historic' },
            { id: E.PricingTypeEnum.Forward, text: 'Forward' }
        ]
    }
    hasCoupon: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Coupon',
        required: true,
        style: [FormItemStyle.SingleRow]
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
            return this.hasCoupon.value() !== true;
        }
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
            return this.hasCoupon.value() !== true;
        }
    }
}

export class ShareKeyFactsOptional {
    cusip: FormItem = {
        type: FormItemType.text,
        label: 'CUSIP',
        required: false
    }
    valor: FormItem = {
        type: FormItemType.number,
        label: 'Valor',
        required: false
    }
    wkn: FormItem = {
        type: FormItemType.text,
        label: 'WKN',
        required: false
    }
    bloombergCode: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code',
        required: false
    }
    sedol: FormItem = {
        type: FormItemType.text,
        label: 'SEDOL',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    dormantStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Dormant Start Date',
        required: false
    }
    dormantEndDate: FormItem = {
        type: FormItemType.date,
        label: 'Dormant End Date',
        required: false
    }
    liquidationStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Liquidation Start Date',
        required: false
    }
    terminationDate: FormItem = {
        type: FormItemType.date,
        label: 'Share Class Termination Date',
        required: false
    }
    // conditional - classTerminationDate
    terminationDateExplanation: FormItem = {
        type: FormItemType.text,
        label: 'Share Class Termination Date Explanation',
        required: false,
        hidden: () => {
            return (this.terminationDate.value() as string).length === 0;
        }
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
        ]
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
        ]
    }
    srri: FormItem = {
        type: FormItemType.number,
        label: 'SRRI (Synthetic Risk and Reward Indicator)',
        required: false
    }
    sri: FormItem = {
        type: FormItemType.number,
        label: 'SRI (Synthetic Risk Indicator)',
        required: false
    }
    navHedge: FormItem = {
        type: FormItemType.list,
        label: 'Share Class NAV Hedge',
        required: false,
        listItems: [
            { id: E.NavHedgeEnum.No, text: 'No' },
            { id: E.NavHedgeEnum.YesNav, text: 'Yes, 100% NAV Hedge' },
            { id: E.NavHedgeEnum.YesResidual, text: 'Yes, residual hedge' }
        ]
    }
    distributionPolicy: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Distribution Policy',
        required: false,
        listItems: [
            { id: E.DistributionPolicyEnum.Accumulating, text: 'Accumulating' },
            { id: E.DistributionPolicyEnum.Distributing, text: 'Distributing' },
            { id: E.DistributionPolicyEnum.Both, text: 'Accumulating & distributing' }
        ]
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
        ]
    }
    isClassUCITSEligible: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Share Class Eligible For UCITS',
        required: false
    }
    isRDRCompliant: FormItem = {
        type: FormItemType.boolean,
        label: 'Is RDR Compliant',
        required: false
    }
    isRestrictedToSeparateFeeArrangement: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Restricted To Separate Fee Arrangement',
        required: false
    }
    hasForcedRedemption: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Forced Redemption',
        required: false
    }
    isETF: FormItem = {
        type: FormItemType.boolean,
        label: 'Is ETF',
        required: false
    }
    indexName: FormItem = {
        type: FormItemType.text,
        label: 'Index Name',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        }
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
        }
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
        }
    }
    bloombergUnderlyingIndexCode: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code Of Underlying Index',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        }
    }
    reutersUnderlyingIndexCode: FormItem = {
        type: FormItemType.text,
        label: 'Reuters Code Of Underlying Index',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        }
    }
    denominationBase: FormItem = {
        type: FormItemType.number,
        label: 'Denomination Base',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            return this.isETF.value() !== true;
        }
    }
    isETC: FormItem = {
        type: FormItemType.boolean,
        label: 'Is ETC',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        }
    }
    isShort: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Short',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        }
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
        }
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
        }
    }
    hasPRIIPDataDelivery: FormItem = {
        type: FormItemType.boolean,
        label: 'Has PRIIP Data Delivery',
        required: false
    }
    hasUCITSDataDelivery: FormItem = {
        type: FormItemType.boolean,
        label: 'Has UCITS Data Delivery',
        required: false
    }
    ucitsKiidUrl: FormItem = {
        type: FormItemType.text,
        label: 'UCITS KIID URL',
        required: false
    }
}