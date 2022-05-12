import { MemberNodeMessageBody } from '@setl/utils/common';

export interface UmbrellaFundRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    walletID: any;
}

export interface SaveUmbrellaFundRequestBody extends MemberNodeMessageBody {
    token: string;
    draft: number;
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
    fundAdministratorID: number;
    custodianBankID: number;
    investmentAdvisorID: string;
    payingAgentID: string;
    transferAgentID: string;
    centralisingAgentID: string;
    giin: number;
    delegatedManagementCompanyID: number;
    auditorID: string;
    taxAuditorID: string;
    principlePromoterID: string;
    legalAdvisorID: string;
    directors: string;
    internalReference: string;
    additionalNotes: string;
}

export interface UpdateUmbrellaFundRequestBody extends MemberNodeMessageBody {
    token: string;
    walletID: any;
    umbrellaFundID: number;
    draft: number;
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
    additionalNotes: string;
}

export interface IznDeleteUmbrellaDraftRequestBody extends MemberNodeMessageBody {
    token: string;
    id: string;
}

export interface fetchUmbrellaAuditRequestBody extends MemberNodeMessageBody {
    token: string;
    umbrellaFundID: number;
}
