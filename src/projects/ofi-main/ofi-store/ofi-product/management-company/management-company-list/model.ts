import { List } from 'immutable';

export interface ManagementCompanyDetail {
    companyID: string;
    entityID?: string;
    companyName: string;
    emailAddress: string;
    legalFormName: string;
    country: string;
    postalAddressLine1: string;
    postalAddressLine2: string;
    city: string;
    postalCode: string;
    taxResidence: string;
    rcsMatriculation: string;
    supervisoryAuthority: string;
    numSiretOrSiren: string;
    shareCapital: string;
    commercialContact: string;
    opeManagementCompanyListStaterationalContact: string;
    directorContact: string;
    lei: string;
    bic: string;
    giinCode: string;
    websiteUrl: string;
    phoneNumberPrefix: string;
    phoneNumber: string;
    signatureTitle: string;
    signatureHash: string;
    logoTitle: string;
    logoHash: string;
    isThirdPartyKyc: boolean;
    managementCompanyType: 'nowcp' | 'common' | 'id2s';
    externalEmail: string;
}

export interface ManagementCompanyListState {
    managementCompanyList: {
        [key: string]: ManagementCompanyDetail;
    };
    requested: boolean;
}

export interface InvManagementCompanyListState {
    investorManagementCompanyList: List<ManagementCompanyDetail>,
    invRequested: boolean;
}
