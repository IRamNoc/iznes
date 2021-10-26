export enum FundShareStatus {
    active = 1,
    locked = -1,
    disabled = -2
}

export interface AllFundShareDetail {
    shareId: number;
    shareName: string;
    fundId: number;
    fundName: string;
    fundShareIsin: string;
    fundShareStatus: FundShareStatus;
}

export interface IznesShareDetail {
    fundShareID: number;
    draft: string;
    draftUser?: string;
    draftDate?: string;
    fundShareName: string;
    fundID: number;
    isin: string;
    shareClassCode: string;
    shareClassInvestmentStatus: string;
    shareClassCurrency: string;
    iban: string;
    mainIban: string;
    valuationFrequency: string;
    historicOrForwardPricing: string;
    hasCoupon: string;
    couponType: string;
    freqOfDistributionDeclaration: string;
    status: number;
    master: boolean;
    feeder: number;
    allowSellBuy: number;
    sellBuyCalendar: number;
    maximumNumDecimal: string;
    subscriptionCategory: string;
    subscriptionQuantityRoundingRule: number;
    subscriptionCurrency: string;
    minInitialSubscriptionInShare: number;
    minInitialSubscriptionInAmount: number;
    minSubsequentSubscriptionInShare: number;
    minSubsequentSubscriptionInAmount: number;
    redemptionCategory: string;
    redemptionQuantityRoundingRule: number;
    redemptionCurrency: string;
    minSubsequentRedemptionInShare: number;
    minSubsequentRedemptionInAmount: number;
    portfolioCurrencyHedge: string;
    subscriptionCutOffTime: string;
    subscriptionCutOffTimeZone: string;
    subscriptionSettlementPeriod: string;
    redemptionCutOffTime: string;
    redemptionCutOffTimeZone: string;
    redemptionSettlementPeriod: string;
    subscriptionRedemptionCalendar: string;
    maxManagementFee: number;
    maxSubscriptionFee: number;
    maxRedemptionFee: number;
    investorProfile: string;
    keyFactOptionalData: string;
    profileOptionalData: string;
    priipOptionalData: string;
    listingOptionalData: string;
    taxationOptionalData: string;
    solvencyIIOptionalData: string;
    representationOptionalData: string;
    fundName: string;
    umbrellaFundID: number;
    managementCompanyName: string;
    managementCompanyId: number;
    subscriptionStartDate: string;
    launchDate: string;
    fundShareStatus: string;
    mifiidChargesOngoing: number;
    mifiidChargesOneOff: number;
    mifiidTransactionCosts: number;
    mifiidServicesCosts: number;
    mifiidIncidentalCosts: number;
    subscriptionTradeCyclePeriod: number;
    numberOfPossibleSubscriptionsWithinPeriod: number;
    weeklySubscriptionDealingDays: number;
    monthlySubscriptionDealingDays: number;
    yearlySubscriptionDealingDays: number;
    redemptionTradeCyclePeriod: number;
    numberOfPossibleRedemptionsWithinPeriod: number;
    weeklyRedemptionDealingDays: number;
    monthlyRedemptionDealingDays: number;
    yearlyRedemptionDealingDays: number;
    navPeriodForSubscription: number;
    navPeriodForRedemption: number;
    isProduction?: string;
    amUserId?: number;
    classification: number;
}

export interface OfiFundShareListState {
    amAllFundShareList: {
        [shareId: string]: AllFundShareDetail
    };
    requestedAmAllFundShareList: boolean;
    iznShareList: {
        [shareId: string]: IznesShareDetail
    };
    requestedIznesShare: boolean;
}
