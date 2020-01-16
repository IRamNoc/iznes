export interface MyDetailState {
    username: string;
    emailAddress: string;
    userId: number;
    lastLogin: string;
    userType: number;
    userTypeStr: string;
    displayName?: string;
    firstName: string;
    lastName: string;
    mobilePhone?: string;
    addressPrefix?: string;
    address1?: string;
    address2?: string;
    address3?: string;  // City or Town
    address4?: string;  // State or Area
    postalCode?: string;
    country?: string;
    memorableQuestion?: string;
    memorableAnswer?: string;
    profileText?: string;
    admin: boolean;
    accountId: number;
    memberId: number;
    companyName: string;
    phoneCode: string;
    phoneNumber: string;
    defaultWalletID: number;
    sessionTimeoutSecs: number;
}
