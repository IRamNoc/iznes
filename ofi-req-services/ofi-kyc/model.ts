import {MemberNodeMessageBody} from '@setl/utils/common';

// Invitation
interface Invitation {
    email: string;
    firstname?: string;
    lastname?: string;
}

export interface SendInvitationRequestData {
    assetManagerName: string;
    amCompanyName: string;
    investors: Array<Invitation>;
    lang: string;
}

export interface SendInvestInvitationRequestBody extends MemberNodeMessageBody {
    token: string;
    assetManagerName: string;
    amCompanyName: string;
    investors: Array<Invitation>;
    lang: string;
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
}

export interface ApprovedKycMessageBody extends MemberNodeMessageBody {
    token: string;
    kycID: number;
    investorEmail: string;
    investorFirstName: string;
    investorCompanyName: string;
    amCompanyName: string;
    lang: string;
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

export interface GetInvestorRequestBody extends MemberNodeMessageBody {
    token: string;
}

interface Shares {
    id: string;
}

export interface SaveFundAccessRequestData {
    shareArray: Array<Shares>;
    kycID: number;
    investorWalletID: number;
}

export interface SaveFundAccessRequestBody extends MemberNodeMessageBody {
    token: string;
    shareArray: Array<Shares>;
    kycID: number;
    investorWalletID: number;
    entryFee: number;
    exitFee: number;
}
