export interface AmKycDetail {
    status: string;
    companyName: string;
    actionDate: string;
    kycDate: string;
    reviewBy: string;
    invited: string;
}

export interface AmKycListState {
    amKycList:Array<AmKycDetail>;
    requested: boolean;
}