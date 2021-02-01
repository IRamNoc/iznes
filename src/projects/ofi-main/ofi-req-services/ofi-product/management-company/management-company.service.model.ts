import { MemberNodeMessageBody } from '@setl/utils/common';

export interface ManagementCompanyRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    accountID: any;
}

export interface ManagementCompanyRequestData {
    companyID: any;
    companyName: any;
    emailAddress: any;
    legalFormName: string;
    country: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    postalCode: any;
    taxResidence: any;
    rcsMatriculation: string;
    supervisoryAuthority: any;
    numSiretOrSiren: any;
    shareCapital: any;
    commercialContact: any;
    operationalContact: any;
    directorContact: any;
    lei: any;
    bic: any;
    giinCode: any;
    websiteUrl: string;
    phoneNumberPrefix: string;
    phoneNumber: string;
    signatureTitle: string;
    signatureHash: string;
    logoTitle: any;
    logoHash: any;
    managementCompanyType: string;
    externalEmail: string;
}

export interface SaveManagementCompanyRequestBody extends MemberNodeMessageBody {
    token: any;
    entityId: any;
    companyName: any;
    emailAddress: any;
    legalFormName: string;
    country: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    postalCode: any;
    taxResidence: any;
    rcsMatriculation: string;
    supervisoryAuthority: any;
    numSiretOrSiren: any;
    shareCapital: any;
    commercialContact: any;
    operationalContact: any;
    directorContact: any;
    lei: any;
    bic: any;
    giinCode: any;
    websiteUrl: string;
    phoneNumberPrefix: string;
    phoneNumber: string;
    signatureTitle: string;
    signatureHash: string;
    logoTitle: any;
    logoHash: any;
    externalEmail: string;
}

export interface UpdateManagementCompanyRequestBody extends MemberNodeMessageBody {
    token: any;
    entityId: any;
    companyID: any;
    companyName: any;
    emailAddress: any;
    legalFormName: string;
    country: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    postalCode: any;
    taxResidence: any;
    rcsMatriculation: string;
    supervisoryAuthority: any;
    numSiretOrSiren: any;
    shareCapital: any;
    commercialContact: any;
    operationalContact: any;
    directorContact: any;
    lei: any;
    bic: any;
    giinCode: any;
    websiteUrl: string;
    phoneNumberPrefix: string;
    phoneNumber: string;
    signatureTitle: string;
    signatureHash: string;
    logoTitle: any;
    logoHash: any;
    externalEmail: string;
}

export interface DeleteManagementCompanyRequestData {
    companyID: any;
}

export interface DeleteManagementCompanyRequestBody extends MemberNodeMessageBody {
    token: any;
    companyID: any;
}
