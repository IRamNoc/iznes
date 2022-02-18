export interface FundListState {
    iznFundList: IznesFundDetails;
    requestedIznesFund: boolean;
    audit: {
        [key: number]: any[],
    };
}

export interface FundSharesToProcess {
    current: number;
    shares: object;
}

export interface IznesFundDetails {
    [key: string]: IznesFundDetail;
}

/* Iznes fund */
export interface IznesFundDetail {
    fundID: number;
    fundName: string;
    draft: string;
    draftUser?: string;
    draftDate?: string;
    isFundStructure: string;
    umbrellaFundID: number;
    umbrellaFundName: string;
    lei: string;
    registerOffice: string;
    registerOfficeAddress: string;
    registerOfficeAddressLine2: string;
    registerOfficeAddressZipCode: string;
    registerOfficeAddressCity: string;
    registerOfficeAddressCountry: string;
    domicile: string;
    isEuDirective: string;
    typeOfEuDirective: string;
    uitsVersion: string;
    legalForm: string;
    nationalNomenclatureOfLegalForm: string;
    homeCountryLegalType: string;
    fundCreationDate: string;
    fundLaunchDate: string;
    fundCurrency: string;
    openOrCloseEnded: string;
    fiscalYearEnd: string;
    isFundOfFund: string;
    externalTransmissionCollection: string;
    managementCompanyID: number;
    managementCompanyName: string;
    fundAdministrator: string;
    custodianBank: string;
    investmentManager: string;
    principlePromoterID: string[];
    payingAgentID: string[];
    fundManagers: string;
    transferAgentID: string;
    centralizingAgentID: string;
    isDedicatedFund: string;
    portfolioCurrencyHedge: string;
    classification: string;
    globalIntermediaryIdentification: string;
    delegatedManagementCompany: string;
    investmentAdvisorID: string[];
    auditorID: string;
    taxAuditorID: string;
    legalAdvisorID: string;
    directors: string;
    hasEmbeddedDirective: string;
    hasCapitalPreservation: string;
    capitalPreservationLevel: string;
    capitalPreservationPeriod: string;
    capitalisationDate: string;
    hasCppi: string;
    cppiMultiplier: string;
    hasHedgeFundStrategy: string;
    isLeveraged: string;
    has130Or30Strategy: string;
    isFundTargetingEos: string;
    isFundTargetingSri: string;
    isPassiveFund: string;
    hasSecurityLending: string;
    hasSwap: string;
    hasDurationHedge: string;
    investmentObjective: string;
    internalReference: string;
    additionalNotes: string;
}
