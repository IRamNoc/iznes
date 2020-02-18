export type MyKycRequestedIds = {
        kycID : number,
        amcID : number,
        completedStep: number,
}[];

export interface MyKycRequestedPersist{
    identification?: boolean;
}

export type MyKycStakeholderRelations = {
        kycID: number;
        stakeholderIDs: number[];
}[];

export interface MyKycRequestedState {
    kycs : MyKycRequestedIds; // list of current kyc(s) combined in the active kyc form.
    formPersist: MyKycRequestedPersist;
    stakeholderRelations: MyKycStakeholderRelations;
}
