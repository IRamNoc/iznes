import { MemberNodeRequest, MemberNodeMessageBody } from '@setl/utils/common';

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
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobilePhone?: string;
    addressPrefix?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    address4?: string;
    postalCode?: string;
    country?: string;
    companyName?: string;
    phoneCode?: string;
    phoneNumber?: string;
    defaultHomePage?: string;
    memorableQuestion?: string;
    memorableAnswer?: string;
    profileText?: string;
}

export interface SetTwoFactorAuthenticationBody extends MemberNodeMessageBody {
    token: string;
    twoFactorAuthentication: string;
    type: string;
    userID: string;
}

export interface AuthenticateTwoFactorAuthenticationBody extends MemberNodeMessageBody {
    token: string;
    secret: string;
    twoFactorCode: string;
    userID: string;
    type: string;
    sessionTimeout: number;
}

export interface ForgotTwoFactorRequestBody extends MemberNodeMessageBody {
    email: string;
    project: string;
}

export interface SaveNewPasswordRequestBody extends MemberNodeMessageBody {
    token: string;
    oldPassword: string;
    newPassword: string;
}

export interface LoginRequestMessage extends MemberNodeRequest {
    MessageBody: LoginRequestMessageBody;
}

export interface RefreshTokenRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface ForgotPasswordRequestBody extends MemberNodeMessageBody {
    username: string;
    lang: string;
}

export interface ValidTokenRequestBody extends MemberNodeMessageBody {
    resetToken: string;
}

export interface SetNewPasswordFromTokenRequestBody extends MemberNodeMessageBody {
    resetToken: string;
    newPassword: string;
    lang: string;
}

export interface SetLanguageRequestBody extends MemberNodeMessageBody {
    token: string;
    lang: any;
}

export interface GetLanguageRequestBody extends MemberNodeMessageBody {
    token: string;
    userID: string;
}

export interface GetSiteMenuRequestBody extends MemberNodeMessageBody {
    token: string;
}
