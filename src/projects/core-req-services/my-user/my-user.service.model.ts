import { MemberNodeRequest, MemberNodeMessageBody } from '@setl/utils/common';

export interface ResetAPITokenRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface LoginRequestMessageBody extends MemberNodeMessageBody {
    UserName: string;
    Password: string;
    CFCountry: string;
}

export interface LoginSSORequestMessageBody extends MemberNodeMessageBody {
    emailAddress: string;
    accessToken: string;
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
}

export interface AuthenticateTwoFactorAuthenticationBody extends MemberNodeMessageBody {
    twoFactorCode: string;
    userID: string;
    type: string;
}

export interface GetTwoFactorQrCodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface ForgotTwoFactorRequestBody extends MemberNodeMessageBody {
    email: string;
}

export interface ResetTwoFactorRequestBody extends MemberNodeMessageBody {
    resetToken: string;
}

export interface SaveNewPasswordRequestBody extends MemberNodeMessageBody {
    token: string;
    oldPassword: string;
    newPassword: string;
}

export interface LoginRequestMessage extends MemberNodeRequest {
    MessageBody: LoginRequestMessageBody;
}

export interface LoginSSORequestMessage extends MemberNodeRequest {
    MessageBody: LoginSSORequestMessageBody;
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

export interface SetDecimalOperatorRequestBody extends MemberNodeMessageBody {
    token: string;
    decimalseparator : any;
}

export interface SetDataOperatorRequestBody extends MemberNodeMessageBody {
    token: string;
    dataseparator : any;
}

export interface GetLanguageRequestBody extends MemberNodeMessageBody {
    token: string;
    userID: string;
}

export interface GetSiteMenuRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface StatusNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RegisterNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface TruncateNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RemoveNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface TestNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface GetAlertsRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface MarkAlertAsReadRequestBody extends MemberNodeMessageBody {
    token: string;
    alertID: number;
}
