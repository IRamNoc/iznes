export interface OfiFundShare {
    accountId?: number;
    fundShareID?: number;
    fundShareName: string;
    fundID: number;
    isin: string;
    shareClassCode: number;
    shareClassInvestmentStatus: number;
    subscriptionStartDate: string;
    launchDate: string;
    shareClassCurrency: number;
    valuationFrequency: number;
    historicOrForwardPricing: number;
    status: string;
    master: number;
    feeder: number;
    hasCoupon: number;
    couponType: number;
    freqOfDistributionDeclaration: number;
    maximumNumDecimal: number;
    subscriptionCategory: number;
    subscriptionCurrency: number;
    minInitialSubscriptionInShare: number;
    minInitialSubscriptionInAmount: number;
    minSubsequentSubscriptionInShare: number;
    minSubsequentSubscriptionInAmount: number;
    redemptionCategory: number;
    redemptionCurrency: number;
    minInitialRedemptionInShare: number;
    minInitialRedemptionInAmount: number;
    minSubsequentRedemptionInShare: number;
    minSubsequentRedemptionInAmount: number;
    subscriptionTradeCyclePeriod: number;
    numberOfPossibleSubscriptionsWithinPeriod: number;
    weeklySubscriptionDealingDays: number;
    monthlySubscriptionDealingDays: string;
    yearlySubscriptionDealingDays: string;
    redemptionTradeCyclePeriod: number;
    numberOfPossibleRedemptionsWithinPeriod: number;
    weeklyRedemptionDealingDays: number;
    monthlyRedemptionDealingDays: string;
    yearlyRedemptionDealingDays: string;
    navPeriodForSubscription: number;
    navPeriodForRedemption: number;
    portfolioCurrencyHedge: number;
    subscriptionCutOffTime: string;
    subscriptionCutOffTimeZone: number;
    subscriptionSettlementPeriod: number;
    redemptionCutOffTime: string;
    redemptionCutOffTimeZone: number;
    redemptionSettlementPeriod: number;
    subscriptionRedemptionCalendar: string;
    maxManagementFee: number;
    maxSubscriptionFee: number;
    maxRedemptionFee: number;
    investorProfile: number;
    mifiidChargesOngoing: number;
    mifiidChargesOneOff: number;
    mifiidTransactionCosts: number;
    mifiidServicesCosts: number;
    mifiidIncidentalCosts: number;
    keyFactOptionalData: string;
    characteristicOptionalData: string;
    calendarOptionalData: string;
    profileOptionalData: string;
    priipOptionalData: string;
    listingOptionalData: string;
    taxationOptionalData: string;
    solvencyIIOptionalData: string;
    representationOptionalData: string;
}

export interface CurrentRequest {
    fundShareID?: number;
}

export interface OfiFundShareState {
    fundShare: {
        [shareId: string]: OfiFundShare
    };
    requested: boolean;
    currentRequest: CurrentRequest;
}
 