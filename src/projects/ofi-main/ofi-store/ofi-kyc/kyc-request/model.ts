export type MyKycRequestedIds = {
        kycID : number,
        amcID : number,
        completedStep: number,
        isThirdPartyKyc: number,
        managementCompanyType: 'common' | 'nowcp' | 'id2s';
}[];

export type MyKycStakeholderRelations = {
        kycID: number;
        stakeholderIDs: number[];
}[];

export interface MyKycRequestedState {
    kycs : MyKycRequestedIds; // list of current kyc(s) combined in the active kyc form.
    stakeholderRelations: MyKycStakeholderRelations;
}
