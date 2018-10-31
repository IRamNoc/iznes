export interface MyKycRequestedIds {
    [index : number] : {
        kycID : number,
        amcID : number,
        completedStep: number,
    };
}

export interface MyKycRequestedPersist{
    identification?: boolean;
}

export interface MyKycRequestedState {
    kycs : MyKycRequestedIds;
    formPersist: MyKycRequestedPersist;
}
