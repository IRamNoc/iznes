export interface FundDetail {
    companyID: string;
    companyName: string;
    country: string;
    addressPrefix: string;
    postalAddressLine1: string;
    postalAddressLine2: string;
    city: string;
    stateArea: string;
    postalCode: string;
    taxResidence: string;
    registrationNum: string;
    supervisoryAuthority: string;
    numSiretOrSiren: string;
    creationDate: string;
    shareCapital: string;
    commercialContact: string;
    operationalContact: string;
    directorContact: string;
    lei: string;
    bic: string;
    giinCode: string;
    logoName: string;
    logoURL: string;
}

export interface FundListState {
    fundList: {
        [key: string]: FundDetail
    };
    requested: boolean;
    iznFundList: {
        [key: string]: IznesFundDetail
    };

    requestedIznesFund: boolean;
}

export interface FundSharesToProcess {
    current: number;
    shares: object;
}

/* Iznes fund */
export interface IznesFundDetail {
    fundName: string;
    isFundStructure: string;
    umbrellaFundID: number;
    umbrellaFundName: string;
    lei: string;
    registerOffice: string;
    registerOfficeAddress: string;
    domicile: string;
    isEuDirective: string;
    typeOfEuDirective: string;
    uitsVersion: string;
    legalForm: string;
    nationalNomenclatureOfLegalForm: string;
    homeCountryLegalType: string;
    fundCreationDate: string;
    fundLaunchate: string;
    fundCurrency: string;
    openOrCloseEnded: string;
    fiscalYearEnd: string;
    isFundOfFund: string;
    managementCompanyID: number;
    managementCompanyName: string;
    fundAdministrator: string;
    custodianBank: string;
    investmentManager: string;
    principalPromoter: string;
    payingAgent: string;
    fundManagers: string;
    transferAgent: string;
    centralizingAgent: string;
    isDedicatedFund: string;
    portfolioCurrencyHedge: string;
    globalItermediaryIdentification: string;
    delegatedManagementCompany: string;
    investmentAdvisor: string;
    auditor: string;
    taxAuditor: string;
    legalAdvisor: string;
    directors: string;
    pocket: string;
    hasEmbeddedDirective: string;
    hasCapitalPreservation: string;
    capitalPreservationLevel: string;
    capitalPreservationPeriod: string;
    hasCppi: string;
    cppiMultiplier: string;
    hasHedgeFundStrategy: string;
    isLeveraged: string;
    has130Or30Strategy: string;
    isFundTargetingEos: string;
    isFundTargetingSri: string;
    isPassiveFund: string;
    hasSecurityiesLending: string;
    hasSwap: string;
    hasDurationHedge: string;
    investmentObjective: string;
}
