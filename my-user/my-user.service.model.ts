import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface LoginRequestMessageBody extends MemberNodeMessageBody {
    UserName: string;
    Password: string;
    CFCountry: string;
}

export interface UserDetailsRequestMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface SaveUserDetailsRequestBody extends MemberNodeMessageBody {
    token: string;
    displayName: string;
    firstName: string;
    lastName: string;
    mobilePhone: string;
    addressPrefix: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postalCode: string;
    country: string;
    memorableQuestion: string;
    memorableAnswer: string;
    profileText: string;
}

export interface LoginRequestMessage extends MemberNodeRequest {
    MessageBody: LoginRequestMessageBody;
}

