export interface AmKycDetail {
    kycID: number;
    investorUserID: number;
    investorUserName: string;
    investorFirstName: string;
    investorLastName: string;
    investorEmail: string;
    investorPhoneCode: string;
    investorPhoneNumber: string;
    investorCompanyName: string;
    amUserName: string;
    amFirstName: string;
    amLastName: string;
    lastUpdated: string;
    lastReviewBy: string;
    investorWalletID: number;
    walletName: string;
    amManagementCompanyID: number;
    isInvited: boolean;
    invitedID: number;
    status: string;
    dateEntered: string;
}

export interface AmKycListState {
    amKycList: Array<AmKycDetail>;
    requested: boolean;
}
