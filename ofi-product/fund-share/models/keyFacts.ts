import {FormItem, FormItemType} from '@setl/core-dynamic-forms/DynamicForm';

export class ShareKeyFactsMandatory {
    name: FormItem = {
        type: FormItemType.text,
        label: 'Full Share Name',
        required: true
    }
    code: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Code',
        required: false,
        listItems: [
            { id: 'class-a', text: 'Class A' },
            { id: 'class-c', text: 'Class C' },
            { id: 'class-d', text: 'Class D' },
            { id: 'class-r', text: 'Class R' },
            { id: 'class-i', text: 'Class I' }
        ]
    }
    isin: FormItem = {
        type: FormItemType.text,
        label: 'ISIN',
        required: true
    }
    currency: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Currency',
        required: false,
        listItems: [
            { id: 'EUR', text: 'EUR' },
            { id: 'GBP', text: 'GBP' },
            { id: 'USD', text: 'USD' }
        ]
    }
    subscriptionStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Subscription Period Start Date',
        required: true
    }
    launchDate: FormItem = {
        type: FormItemType.date,
        label: 'Share Class Launch Date',
        required: false
    }
    investmentStatus: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Investment Status',
        required: true,
        listItems: [
            { id: 'open', text: 'Open' },
            { id: 'soft-closed', text: 'Soft closed' },
            { id: 'hard-Closed', text: 'Hard Closed' },
            { id: 'closed-for-redemption', text: 'Closed for redemption' },
            { id: 'closed-for-subscription-redemption', text: 'Closed for subscription and redemption' }
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
        required: false,
        listItems: [
            { id: 'master', text: 'Master' },
            { id: 'feeder', text: 'Feeder' },
            { id: 'na', text: 'N/A' }
        ]
    }
    valuationFrequency: FormItem = {
        type: FormItemType.list,
        label: 'Valuation Frequency',
        required: true,
        listItems: [
            { id: 'daily', text: 'Daily' },
            { id: 'twice-a-week', text: 'Twice a week' },
            { id: 'weekly', text: 'Weekly' },
            { id: 'twicea-a-month', text: 'Twice a month' },
            { id: 'monthly', text: 'Monthly' },
            { id: 'quarterly', text: 'Quarterly' },
            { id: 'twice-a-year', text: 'Twice a Year' },
            { id: 'annually', text: 'Annually' },
            { id: 'at-least-annualy', text: 'At least Annualy' },
            { id: 'other', text: 'Other' }
        ]
    }
    historicOrForwardPricing: FormItem = {
        type: FormItemType.list,
        label: 'Historic or Forward Pricing',
        required: false,
        listItems: [
            { id: 'historic', text: 'Historic' },
            { id: 'forward', text: 'Forward' }
        ]
    }
    hasCoupon: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Coupon',
        required: false
    }
    // conditional - hasCoupon
    couponType: FormItem = {
        type: FormItemType.list,
        label: 'Coupon type',
        required: false,
        listItems: [
            { id: 'interest', text: 'Interest' },
            { id: 'capital-gain', text: 'Capital gain' },
            { id: 'interest-capital-gain', text: 'Interest & Capital gain' }
        ],
        conditional: {
            formItem: 'hasCoupon',
            showOnValue: true
        }
    }
    frequencyOfDistributionDeclaration: FormItem = {
        type: FormItemType.list,
        label: 'Frequency Of Distribution Declaration',
        required: false,
        listItems: [
            { id: 'daily', text: 'Daily' },
            { id: 'twice-a-week', text: 'Twice a week' },
            { id: 'weekly', text: 'Weekly' },
            { id: 'twice-a-month', text: 'Twice a month' },
            { id: 'monthly', text: 'Monthly' },
            { id: 'quartely', text: 'Quartely' },
            { id: 'twice-a-year', text: 'Twice a year' },
            { id: 'annually', text: 'Annually' }
        ],
        conditional: {
            formItem: 'hasCoupon',
            showOnValue: true
        }
    }
}

export class ShareKeyFactsOptional {
    cusip: FormItem = {
        type: FormItemType.text,
        label: 'CUSIP',
        required: true
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
        required: true
    }
    sedol: FormItem = {
        type: FormItemType.text,
        label: 'SEDOL',
        required: false
    }
    dormantStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Dormant Start Date',
        required: true
    }
    dormantEndDate: FormItem = {
        type: FormItemType.date,
        label: 'Dormant End Date',
        required: true
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
        required: false
    }
    assetClass: FormItem = {
        type: FormItemType.list,
        label: 'Asset Class',
        required: true,
        listItems: [
            { id: 'alternatives', text: 'Alternatives' },
            { id: 'bonds', text: 'Bonds' },
            { id: 'commodities', text: 'Commodities' },
            { id: 'convertibles', text: 'Convertibles' },
            { id: 'diversified', text: 'Diversified' },
            { id: 'equities', text: 'Equities' },
            { id: 'money-market', text: 'Money Market' },
            { id: 'options', text: 'Options' },
            { id: 'private-equity', text: 'Private Equity' },
            { id: 'real-estate', text: 'Real Estate' }
        ]
    }
    geographicalArea: FormItem = {
        type: FormItemType.list,
        label: 'Geographical Area',
        required: true,
        listItems: [
            { id: 'asia', text: 'Asia' },
            { id: 'asia-ex-japan', text: 'Asia Ex Japan' },
            { id: 'asia-pacific-ex-japan', text: 'Asia Pacific Ex Japan' },
            { id: 'asia-em', text: 'Asia EM' },
            { id: 'europe', text: 'Europe' },
            { id: 'europe-ex-uk', text: 'Europe Ex UK' },
            { id: 'europe-em', text: 'Europe EM' },
            { id: 'europe-euro', text: 'Europe Euro' },
            { id: 'global', text: 'Global' },
            { id: 'global-em', text: 'Global EM' },
            { id: 'latin-america-em', text: 'Latin America EM' },
            { id: 'middle-east-africa-em', text: 'Middle East & Africa EM' },
            { id: 'united-kingdom', text: 'United Kingdom' },
            { id: 'usa', text: 'USA' }
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
    // conditional - status
    master: FormItem = {
        type: FormItemType.text,
        label: 'Master',
        required: true
    }
    feeder: FormItem = {
        type: FormItemType.text,
        label: 'Feeder',
        required: true
    }
    navHedge: FormItem = {
        type: FormItemType.list,
        label: 'Share Class NAV Hedge',
        required: false,
        listItems: [
            { id: 'no', text: 'No' },
            { id: 'yes-nav-hedge', text: 'Yes, 100% NAV Hedge' },
            { id: 'yes-residual-hedge', text: 'Yes, residual hedge' }
        ]
    }
    distributionPolicy: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Distribution Policy',
        required: false,
        listItems: [
            {id: 'accumulating', text: 'Accumulating' },
            {id: 'distributing', text: 'Distributing' },
            {id: 'accumulating-distributing', text: 'Accumulating & distributing' }
        ]
    }
    lifecycle: FormItem = {
        type: FormItemType.list,
        label: 'Share Class Lifecycle',
        required: false,
        listItems: [
            { id: 'projected', text: 'Projected' },
            { id: 'to-be-launched', text: 'To be launched' },
            { id: 'offering-period', text: 'Offering period' },
            { id: 'active', text: 'Active' },
            { id: 'dormant', text: 'Dormant' },
            { id: 'in-liquidation', text: 'In liquidation' },
            { id: 'terminated', text: 'Terminated' }
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
        required: false
    }
    indexCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Index Currency',
        required: false,
        listItems: [
            { id: 'EUR', text: 'EUR' },
            { id: 'GBP', text: 'GBP' },
            { id: 'USD', text: 'USD' }
        ]
    }
    indexType: FormItem = {
        type: FormItemType.list,
        label: 'Index Type',
        required: false,
        listItems: [
            { id: 'price', text: 'Price' },
            { id: 'performance', text: 'Performance' },
            { id: 'perfomance-net-dividends', text: 'Perfomance net dividends' },
            { id: 'performance-gross-dividends', text: 'Performance gross dividends' }
        ]
    }
    bloombergUnderlyingIndexCode: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code Of Underlying Index',
        required: false
    }
    reutersUnderlyingIndexCode: FormItem = {
        type: FormItemType.text,
        label: 'Reuters Code Of Underlying Index',
        required: false
    }
    denominationBase: FormItem = {
        type: FormItemType.number,
        label: 'Denomination Base',
        required: false
    }
    isETC: FormItem = {
        type: FormItemType.boolean,
        label: 'Is ETC',
        required: false
    }
    isShort: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Short',
        required: false
    }
    replicationMethodologyFirstLevel: FormItem = {
        type: FormItemType.list,
        label: 'Replication Methodology First Level',
        required: false,
        listItems: [
            { id: 'physical', text: 'Physical' },
            { id: 'synthetical', text: 'Synthetical' },
            { id: 'others', text: 'Others' }
        ]
    }
    replicationMethodologySecondLevel: FormItem = {
        type: FormItemType.list,
        label: 'Replication Methodology Second Level',
        required: false,
        listItems: [
            { id: 'full', text: 'Full' },
            { id: 'optimized-equities-sampled-bonds', text: 'Optimized (equities) – Sampled (bonds)' },
            { id: 'physical-backed', text: 'Physical backed' },
            { id: 'unfunded-swap', text: 'Unfunded swap' },
            { id: 'funded-swap', text: 'Funded swap' },
            { id: 'combination-unfunded-and-funded-swap', text: 'Combination unfunded and funded swap' },
            { id: 'futures', text: 'Futures' }
        ]
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