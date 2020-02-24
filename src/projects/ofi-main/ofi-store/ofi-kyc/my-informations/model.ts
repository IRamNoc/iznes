import { kycPartySelections } from '../../../ofi-kyc/my-requests/kyc-form-helper';

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
    amCompanyName: string;
    amManagementCompanyID: number;
    invitationToken: string;
    investorType: number;
    kycPartySelections: kycPartySelections;
}
