export class SharePRIIP {
    annualizedVolatility?: number = null; // 1
    bondWeight?: number = null; // 1
    capitalGuarantee?: CapitalGuarantee = new CapitalGuarantee();
    category?: number = null;
    hasCapitalGuarantee?: boolean = false;
    investmentAmount?: number = null;
    isPRIIPFlexible?: boolean = false;
    lumpSumOrRegularPremiumIndicator?: 'LS' | 'RP';
    maturityDate?: string = '';
    macaulayDuration?: number = null; // 1
    mrm?: MRM = new MRM();
    numberOfObservedReturns?: number = null;
    recommendedHoldingPeriod?: number = null;
    referenceDate?: string = '';
    return?: Return = new Return();
    risk?: Risk = new Risk();
    targetMarketRetailInvestorType?: number = null; // 1
    vev?: number = null;
    vev1?: number = null;
    vev2?: number = null;
    vev3?: number = null;
    volatilityOfStressedScenario?: number = null;
}

class CapitalGuarantee {
    characteristics?: string = ''; // 1
    level?: string = ''; // 1
    limitations?: string = ''; // 1
    earlyExitConditions?: string = ''; // 1
}

class MRM {
    excessKurtosis?: number = null;
    meanReturn?: number = null;
    skewness?: number = null;
    sigma?: number = null;
}

class Return {
    return1YStressScenario?: string = ''; // 1
    return1YUnfavourable?: boolean = false; // 1
    return1YModerate?: boolean = false; // 1
    return1YFavourable?: boolean = false; // 1
    halfRHPStressScenario?: string = ''; // 1
    halfRHPUnfavourable?: boolean = false; // 1
    halfRHPModerate?: boolean = false; // 1
    halfRHPFavourable?: boolean = false; // 1
    rhpStressScenario?: string = ''; // 1
    rhpUnfavourable?: boolean = false; // 1
    rhpModerate?: boolean = false; // 1
    rhpFavourable?: boolean = false; // 1
}

class Risk {
    creditRiskMeasure?: number
    hasCreditRisk?: boolean = false;
    liquidityRisk?: string = '';
    marketRiskMeasure?: number = null;
    otherRiskNarrative?: number = null; // 1
    possibleMaximumLoss?: number = null;
    summaryRiskIndicator?: number = null;
}