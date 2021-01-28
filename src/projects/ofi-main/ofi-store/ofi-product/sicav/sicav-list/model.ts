export interface SicavDetail {
    companyID: string;
    sicavName: string;
    country: string;
    addrPrefix: string;
    postalAddressLine1: string;
    postalAddressLine2: string;
    city: string;
    stateArea: string;
    postalcode: string;
    taxResidence: string;
    registrationNum: string;
    supervisoryAuthority: string;
    numSIRETorSIREN: string;
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
    externalEmail: string;

}

export interface SicavListState {
    sicavList: {
        [key: string]: SicavDetail
    };
    requested: boolean;
}
