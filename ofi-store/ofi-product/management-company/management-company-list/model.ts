import { List } from 'immutable';

export interface ManagementCompanyDetail {
    companyID: string;
    entityID?: string;
    companyName: string;
    emailAddress: string;
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

export interface managementCompanyListState {
    managementCompanyList: {
        [key: string]: ManagementCompanyDetail;
    };
    requested: boolean;
}

export interface invManagementCompanyListState {
    investorManagementCompanyList: List<ManagementCompanyDetail>,
    invRequested: boolean;
}
