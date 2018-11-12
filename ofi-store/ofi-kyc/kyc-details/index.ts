export {
    KycDetailsState
} from './model';

export {
    SET_KYC_DETAILS_GENERAL,
    SET_KYC_DETAILS_COMPANY,
    SET_KYC_DETAILS_COMPANYBENEFICIARIES,
    SET_KYC_DETAILS_BANKING,
    SET_KYC_DETAILS_CLASSIFICATION,
    SET_KYC_DETAILS_RISKNATURE,
    SET_KYC_DETAILS_RISKOBJECTIVES,
    SET_KYC_DETAILS_DOCUMENTS,
    SET_KYC_DETAILS_VALIDATION,

    setkycdetailsgeneralrequested,
    setkycdetailscompanyrequested,
    setkycdetailscompanybeneficiariesrequested,
    setkycdetailsbankingrequested,
    setkycdetailsclassificationrequested,
    setkycdetailsrisknaturerequested,
    setkycdetailsriskobjectivesrequested,
    setkycdetailsdocumentsrequested,
    setkycdetailsvalidationrequested,

    clearkycdetailsgeneralrequested,
    clearkycdetailscompanyrequested,
    clearkycdetailscompanybeneficiariesrequested,
    clearkycdetailsbankingrequested,
    clearkycdetailsclassificationrequested,
    clearkycdetailsrisknaturerequested,
    clearkycdetailsriskobjectivesrequested,
    clearkycdetailsdocumentsrequested,
    clearkycdetailsvalidationrequested,

    clearkycdetailsall
} from './actions';

export {
    KycDetailsReducer
} from './reducer';
