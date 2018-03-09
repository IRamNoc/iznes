export class ShareCharacteristic {
    maxDecimalShares: number = null;
    portfolioCurrencyHedge?: string = '';

    redemptionCategory: string = '';
    // conditional - redemptionCategory
    redemption: ShareCharacteristicRedemption = new ShareCharacteristicRedemption();

    subscriptionCategory: string;
    // conditional - subscriptionCategory
    subscription: ShareCharacteristicSubscription = new ShareCharacteristicSubscription();
}

export class ShareCharacteristicSubscription {
    minInitialSubscriptionShares?: number = null;
    minInitialSubscriptionAmount?: number = null;
    minSubsequentSubscriptionShares?: number = null;
    minSubsequentSubscriptionAmount?: number = null;
    subscriptionCurrency?: string = '';
}

export class ShareCharacteristicRedemption {
    minInitialRedemptionShares?: number = null;
    minInitialRedemptionAmount?: number = null;
    minSubsequentRedemptionShares?: number = null;
    minSubsequentRedemptionAmount?: number = null;
    redemptionCurrency?: string = '';
}