import {MemberNodeMessageBody} from '@setl/utils/common';

export interface ManagementCompanyRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
}

export interface SaveManagementCompanyRequestBody extends MemberNodeMessageBody {
    token: any;
    entityId: any;
    companyName: any;
    country: any;
    addressPrefix: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    stateArea: any;
    postalCode: any;
    taxResidence: any;
    registrationNum: any;
    supervisoryAuthority: any;
    numSiretOrSiren: any;
    creationDate: any;
    shareCapital: any;
    commercialContact: any;
    operationalContact: any;
    directorContact: any;
    lei: any;
    bic: any;
    giinCode: any;
    logoName: any;
    logoURL: any;
}

export interface UpdateManagementCompanyRequestBody extends MemberNodeMessageBody {
    token: any;
    entityId: any;
    companyID: any;
    companyName: any;
    country: any;
    addressPrefix: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    stateArea: any;
    postalCode: any;
    taxResidence: any;
    registrationNum: any;
    supervisoryAuthority: any;
    numSiretOrSiren: any;
    creationDate: any;
    shareCapital: any;
    commercialContact: any;
    operationalContact: any;
    directorContact: any;
    lei: any;
    bic: any;
    giinCode: any;
    logoName: any;
    logoURL: any;
}

export interface DeleteManagementCompanyRequestBody extends MemberNodeMessageBody {
    token: any;
    companyID: any;
}
