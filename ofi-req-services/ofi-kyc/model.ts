import {MemberNodeMessageBody} from '@setl/utils/common';

// Invitation
interface Invitation {
    email: string;
    firstname?: string;
    lastname?: string;
    lang: any;
    clientreference?: string;
}

export interface SendInvitationRequestData {
    assetManagerName: string;
    amCompanyName: string;
    investors: Array<Invitation>;
}

export interface SendInvestInvitationRequestBody extends MemberNodeMessageBody {
    token: string;
    assetManagerName: string;
    amCompanyName: string;
    investors: Array<Invitation>;
}

export interface UseTokenRequestBody extends MemberNodeMessageBody{
    token: string,
    invitationToken: string
}

export interface VerifyInvitationTokenRequestBody extends MemberNodeMessageBody {
    token: string;
    source: string;
}

export interface CreateUserRequestData {
    token: string;
    email: string;
    password: string;
    lang: string;
}

export interface CreateUserRequestBody extends MemberNodeMessageBody {
    token: string;
    email: string;
    password: string;
    accountName: string;
    accountDescription: string;
    lang: string;
}

export interface ApprovedKycRequestData {
    kycID: number;
    investorEmail: string;
    investorFirstName: string;
    investorCompanyName: string;
    amCompanyName: string;
    lang: string;
    invitedID: number;
}

export interface ApprovedKycMessageBody extends MemberNodeMessageBody {
    token: string;
    kycID: number;
    investorEmail: string;
    investorFirstName: string;
    investorCompanyName: string;
    amCompanyName: string;
    lang: string;
    invitedID: number;
}

export interface RejectedKycRequestData {
    kycID: number;
    investorEmail: string;
    investorFirstName: string;
    investorCompanyName: string;
    amCompanyName: string;
    amEmail: string;
    amPhoneNumber: string;
    amInfoText: string;
    lang: string;
}

export interface SaveKycDocumentRequestData {
    walletID: number;
    name: string;
    hash: string;
    type: string;
    common: boolean;
    'default': number;
}

export interface GetKycDocumentRequestData {
    walletID: number;
    kycID: number;
}

export interface RejectedKycMessageBody extends MemberNodeMessageBody {
    token: string;
    kycID: number;
    investorEmail: string;
    investorFirstName: string;
    investorCompanyName: string;
    amCompanyName: string;
    amEmail: string;
    amPhoneNumber: string;
    amInfoText: string;
    lang: string;
}

export interface AskForMoreInfoRequestData {
    kycID: number;
    investorEmail: string;
    investorFirstName: string;
    investorCompanyName: string;
    amCompanyName: string;
    amEmail: string;
    amPhoneNumber: string;
    amInfoText: string;
    lang: string;
}

export interface AskForMoreInfoMessageBody extends MemberNodeMessageBody {
    token: string;
    kycID: number;
    investorEmail: string;
    investorFirstName: string;
    investorCompanyName: string;
    amCompanyName: string;
    amEmail: string;
    amPhoneNumber: string;
    amInfoText: string;
    lang: string;
}

export interface GetAmKycListRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface GetMyKycListRequestBody extends MemberNodeMessageBody {
    token: string;
    walletid: number;
}

export interface GetInvestorRequestBody extends MemberNodeMessageBody {
    token: string;
}

interface Shares {
    id: string;
}

export interface SaveFundAccessRequestBody extends MemberNodeMessageBody {
    token: string;
    access: object;
    kycID: number;
    investorWalletID: number;
}

export interface fetchInvitationsByUserAmCompanyRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface getKycRequestDetailsRequestData extends MemberNodeMessageBody {
    kycID: number;
}

export interface getKycRequestDetailsRequestBody extends MemberNodeMessageBody {
    token: string;
    kycID: number;
}

export interface createKYCDraftRequestData{
    inviteToken: string;
    managementCompanyID: number;
    investorWalletID: number;
    kycStatus: number;
    alreadyCompleted: number;
}

export interface createKYCDraftMessageBody extends MemberNodeMessageBody{
    token: string;
    inviteToken: string;
    managementCompanyID: number;
    investorWalletID: number;
    kycStatus: number;
}

export interface SaveFundAccessRequestData {
    access: object;
    kycID: number;
    investorWalletID: number;
}

export interface SaveKycDocumentRequestBody extends MemberNodeMessageBody {
    token: string;
    walletID: number;
    name: string;
    hash: string;
    type: string;
    common: boolean;
    'default': number;
}

export interface GetKycDocumentRequestBody extends MemberNodeMessageBody {
    token: string;
    walletID: number;
    kycID: number;
}
