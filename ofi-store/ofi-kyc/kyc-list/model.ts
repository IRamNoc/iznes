export interface MyKyc {
    email: string
}

export interface MyKycList {
    [kyc: number]: MyKyc
}

export interface MyKycListState {
    requested : boolean,
    kycList : MyKycList
}