export interface KycUser {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    phoneCode: string;
    phoneNumber: string;
}

export interface KycMyInformations extends KycUser {
    invitedBy: KycUser;
    amManagementCompanyID: number;
    invitationToken: string;
}
