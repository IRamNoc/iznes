export interface MyKycRequestedIds {
    [index : number] : {
        kycID : number,
        amcID : number,
        completedStep: number
    }
}

export interface MyKycRequestedState {
    kycs : MyKycRequestedIds
}