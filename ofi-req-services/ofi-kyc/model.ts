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

export interface VerifyInvitationTokenRequestBody extends MemberNodeMessageBody{
    token: string;
    source: string;
}

export interface CreateUserRequestData{
    token: string;
    email: string;
    password: string;
}

export interface CreateUserRequestBody extends MemberNodeMessageBody{
    token: string;
    email: string;
    password: string;
    accountName: string;
    accountDescription: string;
}

export interface GetAmKycListRequestBody extends MemberNodeMessageBody{
    token: string;
}

export interface GetInvestorRequestBody extends MemberNodeMessageBody {
    token: string;
}

