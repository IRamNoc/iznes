import { MemberNodeMessageBody } from '@setl/utils/common';

export interface UmbrellaFundRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    walletID: any;
}

export interface SaveUmbrellaFundRequestBody extends MemberNodeMessageBody {
    token: string;
    walletID: any;
    draft: number;
    umbrellaFundName: string;
    registerOffice: string;
    registerOfficeAddress: string;
    legalEntityIdentifier: string;
    domicile: string;
    umbrellaFundCreationDate: string;
    managementCompanyID: number;
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
    additionnalNotes: string;
}

export interface UpdateUmbrellaFundRequestBody extends MemberNodeMessageBody {
    token: string;
    walletID: any;
    umbrellaFundID: number;
    draft: number;
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

export interface IznDeleteUmbrellaDraftRequestBody extends MemberNodeMessageBody {
    token: string;
    id: string;
}