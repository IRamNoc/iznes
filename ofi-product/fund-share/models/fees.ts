export class ShareFees {
    allInFeeApplied: number = null;
    allInFeeDate: string = '';
    allInFeeIncludesTransactionCosts: boolean = false;
    allInFeeMaximum: number = null;
    carriedInterest: string = '';
    carriedInterestDescription: string = '';
    distributionFee: number = null;
    distributionFeeDate: string = '';

    exPost: ShareFeesExPost = new ShareFeesExPost();
    
    exitCostDescription: string = '';
    hasCarriedInterest: boolean = false;
    hasContingentDeferredSalesChargeFee: boolean; 
    hasDilutionLevyApplied: boolean = false;
    hasPerformanceFee: boolean = false;
    hasSeparateDistributionFee: boolean;
    highWaterMark: number = null;
    hurdleRate: number = null;
    isTrailerFeeClean: boolean = false;
    managementFeeApplied: number = null;
    managementFeeAppliedDate: string = '';
    maxManagementFee: number = null;
    maxRedemptionFee: number = null;
    maxSubscriptionFee: number = null;
    miFIDIIAncillaryCharges: number = null;
    miFIDIIIncidentalCosts: number = null;
    miFIDIIOneOffCharges: number = null;
    miFIDIIOngoingCharges: number = null;
    miFIDIITransactionsCosts: number = null;
    ongoingChargesDate: string = '';
    performanceFeeApplied: number = null;
    performanceFeeDescription: string = '';
    performanceFeeMaximum: number = null;
    redemptionFeeInFavourOfFund: number = null;
    redemptionFeeMinimum: number = null;
    subscriptionFeeMaximum: number = null;
    subscriptionFeeMinimum: number = null;
    subscriptionFeeInFavourOfFund: number = null;
    terExcludingPerformanceFee: number = null;
    terExcludingPerformanceFeeDate: string = '';
    terIncludingPerformanceFee: number = null;
    terIncludingPerformanceFeeDate: string = '';
    transactionCosts: number = null;
    
    yriy: string = '';
    halfRhpRiy: string = '';
    rhpRiy: string = '';
}

export class ShareFeesExPost {
    incidentalCostsPercentage: string = '';
    incidentalCostsPeriodStart: string = '';
    incidentalCostsPeriodEnd: string = '';
    managementFeeAppliedPercentage: number = null;
    managementFeeAppliedPeriodStart: string = '';
    managementFeeAppliedPeriodEnd: string = '';
    oneOffEntryCostsPercentage: number = null;
    oneOffEntryCostsPeriodStart: string = '';
    oneOffEntryCostsPeriodEnd: string = '';
    oneOffExitCostsPercentage: number = null;
    oneOffExitCostsPeriodStart: string = '';
    oneOffExitCostsPeriodEnd: string = '';
    otherOngoingCostsAsPercentage: number = null;
    otherOngoingCostsPeriodStart: string = '';
    otherOngoingCostsPeriodEnd: string = '';
    transactionCostsPercentage: number = null;
    transactionCostsPeriodStart: string = '';
    transactionCostsPeriodEnd: string = '';
}