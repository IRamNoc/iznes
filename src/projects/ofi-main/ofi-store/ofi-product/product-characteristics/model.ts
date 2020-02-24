import { Map } from 'immutable';

export interface productCharacteristics {
    fundShareID: number;
    umbrellaFundName: string|null;
    fundName: string;
    fundShareName: string;
    isin: string;
    launchDate: string;
    fundManagers: string;
    srri: number;
    sri: number;
    legalForm: number;
    recommendedHoldingPeriod: number;
    shareClassCurrency: number;
    valuationFrequency: number;
    status: number;
    distributionPolicy: { id: number, text: string }[];
    maxManagementFee: number;
    maxSubscriptionFee: number;
    maxRedemptionFee: number;
    subscriptionTradeCyclePeriod: number;
    subscriptionCutOffTime: string;
    navPeriodForSubscription: number;
    subscriptionSettlementPeriod: number;
    subscriptionCategory: number;
    minInitialSubscriptionInAmount: number;
    minInitialSubscriptionInShare: number;
    redemptionTradeCyclePeriod: number;
    redemptionCutOffTime: string;
    navPeriodForRedemption: number;
    redemptionSettlementPeriod: number;
    redemptionCategory: number;
    minSubsequentRedemptionInAmount: number;
    minSubsequentRedemptionInShare: number;
    maximumNumDecimal: number;
    prospectus: string;
    kiid: string;
}