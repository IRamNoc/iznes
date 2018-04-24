export interface UmbrellaFundDetail {
    umbrellaFundID?: number;
    umbrellaFundName: string;
    registerOffice: string;
    registerOfficeAddress: string;
    legalEntityIdentifier: string;
    domicile: string;
    umbrellaFundCreationDate: string;
    managementCompanyID: string;
    fundAdministratorID: string;
    custodianBankID: string;
    investmentAdvisorID: string;
    payingAgentID: string;
    transferAgentID: string;
    centralisingAgentID: string;
    giin: number;
    delegatedManagementCompanyID: string;
    auditorID: string;
    taxAuditorID: string;
    principlePromoterID: string;
    legalAdvisorID: string;
    directors: string;
    internalReference: string;
    additionnalNotes: string;
}

export interface UmbrellaFundListState {
    umbrellaFundList: {
        [key: string]: UmbrellaFundDetail
    };
    requested: boolean;
}
