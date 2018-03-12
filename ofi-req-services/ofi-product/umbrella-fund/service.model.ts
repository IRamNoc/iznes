import {MemberNodeMessageBody} from '@setl/utils/common';

export interface UmbrellaFundRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    walletID: any;
}

export interface SaveUmbrellaFundRequestBody extends MemberNodeMessageBody {
    token: string;
    walletID: any;
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
    transferAgentID: any;
    centralisingAgentID: any;
    giin: number;
    delegatedManagementCompanyID: number;
    auditorID: number;
    taxAuditorID: number;
    principlePromoterID: number;
    legalAdvisorID: number;
    directors: string;
}

export interface UpdateUmbrellaFundRequestBody extends MemberNodeMessageBody {
    token: string;
    walletID: any;
    umbrellaFundID: number;
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
