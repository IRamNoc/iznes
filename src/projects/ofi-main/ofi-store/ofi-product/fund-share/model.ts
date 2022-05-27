export interface OfiFundShare {
    accountId?: number;
    draft: string;
    fundShareID?: number;
    fundShareName: string;
    fundID: number;
    isin: string;
    shareClassCode: string;
    shareClassInvestmentStatus: number;
    subscriptionStartDate: string;
    launchDate: string;
    shareClassCurrency: number;
    iban: string;
    mainIban: string;
    valuationFrequency: number;
    historicOrForwardPricing: number;
    status: number;
    master: boolean;
    feeder: number;
    visibleByAll:boolean;
    hasCoupon: number;
    couponType: number;
    freqOfDistributionDeclaration: number;
    allowSellBuy: boolean;
    sellBuyCalendar: number;
    maximumNumDecimal: number;
    subscriptionCategory: number;
    subscriptionQuantityRoundingRule: number;
    subscriptionCurrency: number;
    minInitialSubscriptionInShare: number;
    minInitialSubscriptionInAmount: number;
    minSubsequentSubscriptionInShare: number;
    minSubsequentSubscriptionInAmount: number;
    redemptionCategory: number;
    redemptionQuantityRoundingRule: number;
    redemptionCurrency: number;
    minSubsequentRedemptionInShare: number;
    minSubsequentRedemptionInAmount: number;
    subscriptionTradeCyclePeriod: number;
    numberOfPossibleSubscriptionsWithinPeriod: number;
    weeklySubscriptionDealingDays: string;
    monthlySubscriptionDealingDays: string;
    yearlySubscriptionDealingDays: string;
    redemptionTradeCyclePeriod: number;
    numberOfPossibleRedemptionsWithinPeriod: number;
    weeklyRedemptionDealingDays: string;
    monthlyRedemptionDealingDays: string;
    yearlyRedemptionDealingDays: string;
    navPeriodForSubscription: number;
    navPeriodForRedemption: number;
    portfolioCurrencyHedge: number;
    subscriptionCutOffTime: string;
    subscriptionCutOffTimeZone: number;
    subscriptionSettlementPeriod: number;
    subscriptionSettlementPivotDate: number;
    subscriptionPaymentInstructionTrigger: number;
    subscriptionValuationReference: number;
    redemptionCutOffTime: string;
    redemptionCutOffTimeZone: number;
    redemptionSettlementPeriod: number;
    redemptionSettlementPivotDate: number;
    redemptionValuationReference: number;
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
    profileOptionalData: string;
    priipOptionalData: string;
    listingOptionalData: string;
    taxationOptionalData: string;
    solvencyIIOptionalData: string;
    representationOptionalData: string;
    ktpCode: string;
    buyCentralizationCalendar: number;
    buyNAVCalendar: number;
    buySettlementCalendar: number;
    sellCentralizationCalendar: number;
    sellNAVCalendar: number;
    sellSettlementCalendar: number;
    cashAccountBic: string;
    cashAccountIznesScope: number;
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

export interface OfiFundShareDocuments {
    prospectus: number;
    kiid: number;
    annualActivityReport: number;
    semiAnnualSummary: number;
    sharesAllocation: number;
    sriPolicy: number;
    transparencyCode: number;
    businessLetter: number;
    productSheet: number;
    monthlyFinancialReport: number;
    monthlyExtraFinancialReport: number;
    quarterlyFinancialReport: number;
    quarterlyExtraFinancialReport: number;
    letterToShareholders: number;
    kid: number;
    statutoryAuditorsCertification: number;
    ept: number;
    emt: number;
    tpts2: number;
}
