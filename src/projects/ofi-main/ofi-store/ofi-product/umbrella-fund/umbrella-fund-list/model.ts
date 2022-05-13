export interface UmbrellaFundDetail {
    umbrellaFundID?: number;
    draft: number;
    draftUser?: string;
    draftDate?: string;
    umbrellaFundName: string;
    registerOffice: string;
    registerOfficeAddress: string;
    registerOfficeAddressLine2: string;
    registerOfficeAddressZipCode: string;
    registerOfficeAddressCity: string;
    registerOfficeAddressCountry: string;
    legalEntityIdentifier: string;
    domicile: string;
    umbrellaFundCreationDate: string;
    managementCompanyID: number;
    subCompanyOrder: number;
    companyName?: string;
    fundAdministratorID: number;
    custodianBankID: number;
    investmentAdvisorID: number[];
    payingAgentID: number[];
    transferAgentID: string;
    centralisingAgentID: string;
    giin: number;
    delegatedManagementCompanyID: number;
    auditorID: string;
    taxAuditorID: string;
    principlePromoterID: number[];
    legalAdvisorID: string;
    directors: string;
    internalReference: string;
    additionalNotes: string;
}

export interface UmbrellaFundListState {
    umbrellaFundList: {
        [key: string]: UmbrellaFundDetail,
    };
    requested: boolean;
    audit: {
        [key: number]: any[],
    };
}
