import { MemberNodeMessageBody } from '@setl/utils/common';

export interface SicavRequestMessageBody extends MemberNodeMessageBody {
    token: any;
}

export interface SaveSicavRequestBody extends MemberNodeMessageBody {
    token: any;
    companyID: any;
    sicavName: any;
    country: any;
    addrPrefix: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    stateArea: any;
    postalcode: any;
    taxResidence: any;
    registrationNum: any;
    supervisoryAuthority: any;
    numSIRETorSIREN: any;
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
    externalEmail: any;    
    emailValidation: any,
}

export interface UpdateSicavRequestBody extends MemberNodeMessageBody {
    token: any;
    sicavID: any;
    sicavName: any;
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
    numSIRETorSIREN: any;
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
    externalEmail: any;
    emailValidation:any;

}

export interface DeleteSicavRequestBody extends MemberNodeMessageBody {
    token: any;
    sicavID: any;
}
