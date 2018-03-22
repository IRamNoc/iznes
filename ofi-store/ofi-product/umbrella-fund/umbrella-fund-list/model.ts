export interface UmbrellaFundDetail {
    umbrellaFundID?: number;
    umbrellaFundName: string;
    registerOffice: string;
    registerOfficeAddress: string;
    legalEntityIdentifier: string;
    domicile: string;
    umbrellaFundCreationDate: string;
    managementCompanyID: number;
    fundAdministratorID: number;
    custodianBankID: number;
    investmentManagerID: number;
    investmentAdvisorID: number;
    payingAgentID: number;
    transferAgentID: number;
    centralisingAgentID: number;
    giin: number;
    delegatedManagementCompanyID: number;
    auditorID: number;
    taxAuditorID: number;
    principlePromoterID: number;
    legalAdvisorID: number;
    directors: string;
}

export interface UmbrellaFundListState {
    umbrellaFundList: {
        [key: string]: UmbrellaFundDetail
    };
    requested: boolean;
}
