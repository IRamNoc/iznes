export interface KycDetail {
    status: string;
    companyName: string;
    actionDate: string;
    kycDate: string;
    reviewBy: string;
}

export interface AmKycListState {
    kycList:Array<KycDetail>;
    requested: boolean;
}