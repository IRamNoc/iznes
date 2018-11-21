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

export interface MyKycStakeholderRelations{
    [index: number]: {
        kycID: number;
        stakeholderIDs: number[];
    };
}

export interface MyKycRequestedState {
    kycs : MyKycRequestedIds;
    formPersist: MyKycRequestedPersist;
    stakeholderRelations: MyKycStakeholderRelations;
}
