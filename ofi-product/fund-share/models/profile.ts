export class ShareProfile {
    ability?: Ability = new Ability();
    benchmark?: string = '';
    eligibility?: Eligibility = new Eligibility();
    investor: Investor = new Investor();
    isClientTypeEligibleCounterparty?: boolean = false;
    isClientTypeProfessional?: boolean = false;
    isClientTypeRetail?: boolean = false;
    outperformanceCommission?: string = '';
    peaEligibility?: boolean = false;
    recommendedHoldingPeriod?: number = null;
    returnProfile?: ReturnProfile = new ReturnProfile();    
}

class Ability {
    limitedCapitalLosses: boolean = false;
    lossesBeyondCapital: boolean = false;
    noCapitalLoss: boolean = false;
    totalCapitalLoss: boolean = false;
}


class Eligibility {
    advisedRetailDistribution: string = '';
    executionOnlyDistribution: string = '';
    executionOnlyWithAppropriatenessTest: string = '';
    portfolioManagement: string = '';
}

class Investor {
    advanced?: boolean = false;
    informed?: boolean = false;
    profile: string = '';
    withBasicKnowledge?: boolean = false;
}

class ReturnProfile {
    growth: boolean = false;
    hedging: boolean = false;
    income: boolean = false;
    optionsOrLeverage: boolean = false;
    other: boolean = false;
    preservation: boolean = false;
}