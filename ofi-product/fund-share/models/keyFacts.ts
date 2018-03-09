export class ShareKeyFacts {
    // MANDATORY
    aumClass: number = null;
    aumClassDate: string = '';
    class: ShareClass = new ShareClass();
    frequencyOfDistributionDeclaration?: string = '';
    
    hasCoupon: boolean = false;
    // conditional - hasCoupon
    couponType?: string = '';

    historicOrForwardPricing: string = '';
    isin: string = '';
    name: string = '';
    nosClass: number = null;
    nosClassDate: string = '';
    status: string = '';
    subscriptionStartDate: string = '';
    valuationFrequency: string = '';
    valuationNAV: number = null;
    valuationNAVDate: string = '';

    // OPTIONAL
    assetClass?: string = '';
    bloombergCode?: string = '';    
    cusip?: string = '';
    dormantStartDate?: string = '';
    dormantEndDate?: string = '';
    geographicalArea?: string = '';
    
    // conditional - status
    feeder?: string = '';
    master?: string = '';
    
    hasForcedRedemption?: boolean = false;
    hasPRIIPDataDelivery?: boolean = false;
    hasUCITSDataDelivery?: boolean = false;
    isClassUCITSEligible?: boolean = false;
    
    isETF?: boolean = false;
    // conditional - isEFT
    eft: ShareEFT = new ShareEFT();
    
    isRDRCompliant?: boolean = false;
    isRestrictedToSeparateFeeArrangement?: boolean = false;
    liquidationStartDate?: string = '';
    sedol?: string = '';
    sri?: number = null;
    srri?: number = null;
    ucitsKiidUrl?: string = '';
    valor?: number = null;
    wkn?: string = '';
}

export class ShareClass {
    code: string = '';
    currency: string = '';
    investmentStatus: string = '';
    launchDate: string = '';

    distributionPolicy?: string = '';
    lifecycle?: string = '';
    navHedge?: string = '';
    
    terminationDate?: string = '';
    // conditional - classTerminationDate
    terminationDateExplanation?: string = '';
}

export class ShareEFT {
    bloombergUnderlyingIndexCode?: string = '';
    denominationBase?: number = null;
    indexCurrency?: string = '';
    indexName?: string = '';
    indexType?: string = '';
    isETC?: boolean = false;
    isShort?: boolean = false;
    replicationMethodologyFirstLevel?: string = '';
    replicationMethodologySecondLevel?: string = '';
    reutersUnderlyingIndexCode?: string = '';
}