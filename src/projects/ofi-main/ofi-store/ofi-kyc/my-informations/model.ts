export interface KycUser {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    phoneCode: string;
    phoneNumber: string;
}

export type KycPartySelections = {
    iznes?: boolean;
    nowCPIssuer?: boolean;
    nowCPInvestor?: boolean;
    id2sCustodian?: boolean;
    id2sIPA?: boolean;
};

export interface KycMyInformations extends KycUser {
    invitedBy: KycUser;
    amCompanyName: string;
    amManagementCompanyID: number;
    invitationToken: string;
    investorType: number;
    kycPartySelections: KycPartySelections;
}
