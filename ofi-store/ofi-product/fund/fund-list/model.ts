export interface FundDetail {
    companyID: string;
    companyName: string;
    country: string;
    addressPrefix: string;
    postalAddressLine1: string;
    postalAddressLine2: string;
    city: string;
    stateArea: string;
    postalCode: string;
    taxResidence: string;
    registrationNum: string;
    supervisoryAuthority: string;
    numSiretOrSiren: string;
    creationDate: string;
    shareCapital: string;
    commercialContact: string;
    operationalContact: string;
    directorContact: string;
    lei: string;
    bic: string;
    giinCode: string;
    logoName: string;
    logoURL: string;
}

export interface FundListState {
    fundList: {
        [key: string]: FundDetail
    };
    requested: boolean;
}

export interface FundSharesToProcess {
    current: number;
    shares: object;
}
