import { FormControl, Validators } from '@angular/forms';
import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';
import * as E from '../FundShareEnum';
import {ibanValidator} from "@setl/utils/helper/validators";

export class ShareKeyFactsStatus extends DynamicFormsValidator {
    shareClassInvestmentStatus: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Investment Status',
        required: true,
        listItems: [
            { id: E.InvestmentStatusEnum.Open, text: 'Open' },
            { id: E.InvestmentStatusEnum.SoftClosed, text: 'Soft closed' },
            { id: E.InvestmentStatusEnum.HardClosed, text: 'Hard Closed' },
            { id: E.InvestmentStatusEnum.ClosedRedemption, text: 'Closed for redemption' },
            { id: E.InvestmentStatusEnum.ClosedSubscriptionRedemption, text: 'Closed for subscription and redemption' },
        ],
    };
}

export class ShareKeyFactsMandatory extends DynamicFormsValidator {
    fundShareName: FormItem = {
        type: FormItemType.text,
        label: 'Full Share Name',
        required: true,
    };
    isin: FormItem = {
        type: FormItemType.text,
        label: 'ISIN',
        required: true,
        validator: validateISIN,
    };
    shareClassCode: FormItem = {
        type: FormItemType.text,
        label: 'Share Class Code',
        required: true,
    };
    shareClassCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Currency',
        required: true,
        listItems: [],
    };
    subscriptionStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Subscription Period Start Date',
        required: true,
    };
    iban: FormItem = {
        //find the way to put a placeholder
        type: FormItemType.text,
        label: 'Fund\'s IBAN dedicated to IZNES',
        required: true,
        validator: Validators.compose([
            validateIBAN,
        ]),
    };
    shareLaunchDate: FormItem = {
        type: FormItemType.date,
        label: 'Share Class Launch Date',
        required: true,
    };
    status: FormItem = {
        type: FormItemType.list,
        label: 'Share Status',
        required: true,
        listItems: [
            { id: E.StatusEnum.Master, text: 'Master' },
            { id: E.StatusEnum.Feeder, text: 'Feeder' },
            { id: E.StatusEnum.NA, text: 'N/A' },
        ],
    };
    // conditional - status
    feeder: FormItem = {
        type: FormItemType.list,
        label: 'Master', // previously was displayed was Feeder
        required: true,
        hidden: () => {
            const val = (this.status.value() as any);
            return (val == undefined || !val[0]) || val[0].id !== E.StatusEnum.Feeder;
        },
        listItems: [],
    };
    sharePortfolioCurrencyHedge: FormItem = {
        type: FormItemType.list,
        label: 'Share Currency Hedge',
        required: true,
        listItems: [
            { id: E.CurrencyHedgeEnum.NoHedge, text: 'No Hedge' },
            { id: E.CurrencyHedgeEnum.FullPortfolioHedge, text: 'Full Portfolio Hedge' },
            { id: E.CurrencyHedgeEnum.CurrencyOverlay, text: 'Currency overlay' },
            { id: E.CurrencyHedgeEnum.PartialHedge, text: 'Partial Hedge' },
        ],
        style: [FormItemStyle.BreakOnBefore],
    };
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
            { id: E.ValuationFrequencyEnum.Other, text: 'Other' },
        ],
        style: [FormItemStyle.BreakOnBefore],
    };
    historicOrForwardPricing: FormItem = {
        type: FormItemType.list,
        label: 'Historic or Forward Pricing',
        required: true,
        listItems: [
            { id: E.PricingTypeEnum.Historic, text: 'Historic' },
            { id: E.PricingTypeEnum.Forward, text: 'Forward' },
        ],
    };
    hasCoupon: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Coupon',
        required: true,
        style: [FormItemStyle.SingleRow],
    };
    // conditional - hasCoupon
    couponType: FormItem = {
        type: FormItemType.list,
        label: 'Coupon Type',
        required: true,
        listItems: [
            { id: E.CouponTypeEnum.Interest, text: 'Interest' },
            { id: E.CouponTypeEnum.CapitalGain, text: 'Capital gain' },
            { id: E.CouponTypeEnum.InterestCapitalGain, text: 'Interest & Capital gain' },
        ],
        hidden: () => {
            return this.hasCoupon.value() === false || this.hasCoupon.value() === 0;
        },
    };
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
            { id: E.FrequencyOfDistributionDeclarationEnum.Annually, text: 'Annually' },
        ],
        hidden: () => {
            return this.hasCoupon.value() === false || this.hasCoupon.value() === 0;
        },
    };

    // allow for sell/buy
    allowSellBuy: FormItem = {
        type: FormItemType.boolean,
        label: 'Sell/Buy Order Permitted',
        required: true,
        style: [FormItemStyle.BreakOnBefore],
    };

    // sell/buy
    sellBuyCalendar: FormItem = {
        type: FormItemType.list,
        label: 'Sell/Buy Calendar',
        required: true,
        listItems: [
            { id: E.SellBuyCalendar.SubscriptionCalendar, text: 'Subscription Calendar' },
            { id: E.SellBuyCalendar.RedemptionCalendar, text: 'Redemption Calendar' },
        ],
        hidden: () => {
            return this.allowSellBuy.value() === false || this.allowSellBuy.value() === 0;
        },
    };
}

export class ShareKeyFactsOptional {
    cusip: FormItem = {
        type: FormItemType.text,
        label: 'CUSIP',
        required: false,
    };
    valor: FormItem = {
        type: FormItemType.number,
        label: 'Valor',
        required: false,
    };
    wkn: FormItem = {
        type: FormItemType.text,
        label: 'WKN',
        required: false,
    };
    bloombergCode: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code',
        required: false,
    };
    sedol: FormItem = {
        type: FormItemType.text,
        label: 'SEDOL',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
    };
    dormantStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Dormant Start Date',
        required: false,
    };
    dormantEndDate: FormItem = {
        type: FormItemType.date,
        label: 'Dormant End Date',
        required: false,
    };
    liquidationStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Liquidation Start Date',
        required: false,
    };
    terminationDate: FormItem = {
        type: FormItemType.date,
        label: 'Share Class Termination Date',
        required: false,
    };
    // conditional - classTerminationDate
    terminationDateExplanation: FormItem = {
        type: FormItemType.text,
        label: 'Share Class Termination Date Explanation',
        required: false,
        hidden: () => {
            return (this.terminationDate.value() as string).length === 0;
        },
    };
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
            { id: E.GeographicalAreaEnum.USA, text: 'USA' },
        ],
    };
    srri: FormItem = {
        type: FormItemType.list,
        label: 'SRRI (Synthetic Risk and Reward Indicator)',
        required: false,
        listItems: [
            { id: 1, text: '1' },
            { id: 2, text: '2' },
            { id: 3, text: '3' },
            { id: 4, text: '4' },
            { id: 5, text: '5' },
            { id: 6, text: '6' },
            { id: 7, text: '7' },
        ],
    };
    sri: FormItem = {
        type: FormItemType.list,
        label: 'SRI (Synthetic Risk Indicator)',
        required: false,
        listItems: [
            { id: 1, text: '1' },
            { id: 2, text: '2' },
            { id: 3, text: '3' },
            { id: 4, text: '4' },
            { id: 5, text: '5' },
            { id: 6, text: '6' },
            { id: 7, text: '7' },
        ],
    };
    navHedge: FormItem = {
        type: FormItemType.list,
        label: 'Share Class NAV Hedge',
        required: false,
        listItems: [
            { id: E.NavHedgeEnum.No, text: 'No' },
            { id: E.NavHedgeEnum.YesNav, text: 'Yes, 100% NAV Hedge' },
            { id: E.NavHedgeEnum.YesResidual, text: 'Yes, residual hedge' },
        ],
    };
    distributionPolicy: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Distribution Policy',
        required: false,
        listItems: [
            { id: E.DistributionPolicyEnum.Accumulating, text: 'Accumulating' },
            { id: E.DistributionPolicyEnum.Distributing, text: 'Distributing' },
            { id: E.DistributionPolicyEnum.Both, text: 'Accumulating & distributing' },
        ],
    };
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
            { id: E.LifecycleEnum.Terminated, text: 'Terminated' },
        ],
    };
    isClassUCITSEligible: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Share Class Eligible For UCITS',
        required: false,
    };
    isRDRCompliant: FormItem = {
        type: FormItemType.boolean,
        label: 'Is RDR Compliant',
        required: false,
    };
    isRestrictedToSeparateFeeArrangement: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Restricted To Separate Fee Arrangement',
        required: false,
    };
    hasForcedRedemption: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Forced Redemption',
        required: false,
    };
    isETF: FormItem = {
        type: FormItemType.boolean,
        label: 'Is ETF',
        required: false,
    };
    indexName: FormItem = {
        type: FormItemType.text,
        label: 'Index Name',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    indexCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Index Currency',
        required: false,
        listItems: [],
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    indexType: FormItem = {
        type: FormItemType.list,
        label: 'Index Type',
        required: false,
        listItems: [
            { id: E.IndexTypeEnum.Price, text: 'Price' },
            { id: E.IndexTypeEnum.Performance, text: 'Performance' },
            { id: E.IndexTypeEnum.PerformanceNetDividends, text: 'Perfomance net dividends' },
            { id: E.IndexTypeEnum.PerformanceGrossDividends, text: 'Performance gross dividends' },
        ],
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    bloombergUnderlyingIndexCode: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code Of Underlying Index',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    reutersUnderlyingIndexCode: FormItem = {
        type: FormItemType.text,
        label: 'Reuters Code Of Underlying Index',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    denominationBase: FormItem = {
        type: FormItemType.number,
        label: 'Denomination Base',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    isETC: FormItem = {
        type: FormItemType.boolean,
        label: 'Is ETC',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    isShort: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Short',
        required: false,
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    replicationMethodologyFirstLevel: FormItem = {
        type: FormItemType.list,
        label: 'Replication Methodology First Level',
        required: false,
        listItems: [
            { id: E.ReplicationFirstLevelEnum.Physical, text: 'Physical' },
            { id: E.ReplicationFirstLevelEnum.Synthetical, text: 'Synthetical' },
            { id: E.ReplicationFirstLevelEnum.Others, text: 'Others' },
        ],
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
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
            { id: E.ReplicationSecondLevelEnum.Futures, text: 'Futures' },
        ],
        hidden: () => {
            return this.isETF.value() !== true;
        },
    };
    hasPRIIPDataDelivery: FormItem = {
        type: FormItemType.boolean,
        label: 'Has PRIIP Data Delivery',
        required: false,
    };
    hasUCITSDataDelivery: FormItem = {
        type: FormItemType.boolean,
        label: 'Has UCITS Data Delivery',
        required: false,
    };
    ucitsKiidUrl: FormItem = {
        type: FormItemType.text,
        label: 'UCITS KIID URL',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
    };
    internalReference: FormItem = {
        type: FormItemType.text,
        label: 'Internal Reference',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
    };
    additionalComments: FormItem = {
        type: FormItemType.textarea,
        label: 'Additional Comments',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
    };
}

function validateISIN(c: FormControl) {
    const ISIN_REGEXP = new RegExp(/\b^[A-Z]{2}[0-9]{10}\b/);

    return ISIN_REGEXP.test(c.value) && c.value.length === 12 ? null : {
        'ISIN must meet ISO 6166 format (12 capitalised characters).': c.value,
    };
}

function validateIBAN(c: FormControl) {

    return ibanValidator(c) === null ? null : {
        'IBAN must be 14 to 34 characters long with 2 letters at the beginning': c.value,
    };
}
