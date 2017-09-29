export interface ManagementCompanyDetail {
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

export interface ManagementCompanyList {
    [managementCompanyId: number]: ManagementCompanyDetail
}

export interface ManagementCompanyListState {
    managementCompanyList: ManagementCompanyList;
    requested: boolean;
}
