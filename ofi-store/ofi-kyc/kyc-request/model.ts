export interface MyKycRequestedIds {
    [index : number] : {
        kycID : number,
        amcID : number
    }
}

export interface MyKycRequestedState {
    kycs : MyKycRequestedIds
}