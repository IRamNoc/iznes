export interface FundShareAccessDetail {
    shareId: number;
    shareName: string;
    fundId: number;
    entryFee: number;
    exitFee: number;
    /**
     * 0: suspended
     * 1: active
     * 2: deleted (merged)
     */
    shareStatus: number;
    issuer: string;
    metaData: object;
    // 1: has access
    // 0: no access
    userStatus: number;
    managementCompany: string;
    price: number;
    holidayMgmtConfig: string;
    hasValidatedKiid: boolean;
}

export interface FundShareAccessList {
    [fundShareId: number]: FundShareAccessDetail;
}

export interface FundAccessDetail {
    fundId: number;
    fundName: string;
    fundProspectus: string;
    fundReport: string;
    fundSicavId: number;
    classification: number;
}

export interface FundAccessList {
    [fundId: number]: FundAccessDetail;
}

export interface OfiFundAccessMyState {
    fundAccessList: FundAccessList;
    fundShareAccessList: FundShareAccessList;
    requested: boolean;
}
