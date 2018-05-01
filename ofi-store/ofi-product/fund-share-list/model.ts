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
    fundShareName: string;
    fundID: number;
    isin: string;
    shareClassCode: string;
    shareClassInvestmentStatus: string;
    shareClassCurrency: string;
    valuationFrequency: string;
    historicOrForwardPricing: string;
    hasCoupon: string;
    couponType: string;
    freqOfDistributionDeclaration: string;
    status: number;
    master: boolean;
    feeder: number;
    maximumNumDecimal: string;
    subscriptionCategory: string;
    subscriptionCurrency: string;
    minInitialSubscriptionInShare: string;
    minInitialSubscriptionInAmount: string;
    minSubsequentSubscriptionInShare: string;
    minSubsequentSubscriptionInAmount: string;
    redemptionCategory: string;
    redemptionCurrency: string;
    minInitialRedemptionInShare: string;
    minInitialRedemptionInAmount: string;
    minSubsequentRedemptionInShare: string;
    minSubsequentRedemptionInAmount: string;
    portfolioCurrencyHedge: string;
    subscriptionCutOffTime: string;
    subscriptionCutOffTimeZone: string;
    subscriptionSettlementPeriod: string;
    redemptionCutOffTime: string;
    redemptionCutOffTimeZone: string;
    redemptionSettlementPeriod: string;
    subscriptionRedemptionCalendar: string;
    maxManagementFee: string;
    maxSubscriptionFee: string;
    maxRedemptionFee: string;
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
    mifiidChargesOngoing: string;
    mifiidChargesOneOff: string;
    mifiidTransactionCosts: string;
    mifiidIncidentalCosts: string;
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
