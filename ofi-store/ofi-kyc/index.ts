import {AmKycMyRequestDetailsReducer, KycMyRequestDetailsState} from './ofi-my-request-details';
import { combineReducers, Reducer } from 'redux';
import { KycMyInformationsReducer, KycMyInformationsState } from './my-informations';
import { AmKycListReducer, AmKycListState } from './ofi-am-kyc-list';
import { investorInvitationState, investorInvitationReducer } from './invitationsByUserAmCompany';
import { kycStatusAuditTrailState, kycStatusAuditTrailReducer } from './status-audit-trail';
import { MyKycListState, MyKycListReducer } from './kyc-list';
import { kycInformationAuditTrailState, kycInformationAuditTrailReducer } from './information-audit-trail';
import { OfiInvMyDocumentsListReducer, OfiInvMyDocumentsState } from './inv-my-documents';

export {
    KycMyInformations,
    SET_INFORMATIONS,
    setInformations,
} from './my-informations';

export {
    SET_AMKYCLIST,
    SET_REQUESTED,
    CLEAR_REQUESTED,
    setamkyclist,
    setrequested,
    clearrequested,
} from './ofi-am-kyc-list';

export {
    SET_KYC_MYREQ_DETAILS_GENERAL,
    setkycmyreqdetailsgeneralrequested,
    clearkycmyreqdetailsgeneralrequested,
    SET_KYC_MYREQ_DETAILS_COMPANY,
    setkycmyreqdetailscompanyrequested,
    clearkycmyreqdetailscompanyrequested,
    SET_KYC_MYREQ_DETAILS_COMPANYBENEFICIARIES,
    setkycmyreqdetailscompanybeneficiariesrequested,
    clearkycmyreqdetailscompanybeneficiariesrequested,
    SET_KYC_MYREQ_DETAILS_BANKING,
    setkycmyreqdetailsbankingrequested,
    clearkycmyreqdetailsbankingrequested,
    SET_KYC_MYREQ_DETAILS_CLASSIFICATION,
    setkycmyreqdetailsclassificationrequested,
    clearkycmyreqdetailsclassificationrequested,
    SET_KYC_MYREQ_DETAILS_RISKNATURE,
    setkycmyreqdetailsrisknaturerequested,
    clearkycmyreqdetailsrisknaturerequested,
    SET_KYC_MYREQ_DETAILS_RISKOBJECTIVES,
    setkycmyreqdetailsriskobjectivesrequested,
    clearkycmyreqdetailsriskobjectivesrequested,
    SET_KYC_MYREQ_DETAILS_DOCUMENTS,
    setkycmyreqdetailsdocumentsrequested,
    clearkycmyreqdetailsdocumentsrequested,
} from './ofi-my-request-details';

export * from './invitationsByUserAmCompany';

export * from './kyc-list';

export {
    OFI_SET_MY_DOCUMENTS_LIST,
    OFI_SET_REQUESTED_MY_DOCUMENTS,
    OFI_CLEAR_REQUESTED_MY_DOCUMENTS,
} from './inv-my-documents';

export interface KycState {
    myInformations: KycMyInformationsState;
    amKycList: AmKycListState;
    investorInvitations: investorInvitationState;
    kycMyRequestDetails: KycMyRequestDetailsState;
    myKycList: MyKycListState;
    statusAuditTrail: kycStatusAuditTrailState;
    informationAuditTrail: kycInformationAuditTrailState;
    invMyDocuments: OfiInvMyDocumentsState;
}

export const KycReducer: Reducer<KycState> = combineReducers<KycState>({
    myInformations: KycMyInformationsReducer,
    amKycList: AmKycListReducer,
    investorInvitations: investorInvitationReducer,
    kycMyRequestDetails: AmKycMyRequestDetailsReducer,
    myKycList: MyKycListReducer,
    statusAuditTrail: kycStatusAuditTrailReducer,
    informationAuditTrail: kycInformationAuditTrailReducer,
    invMyDocuments: OfiInvMyDocumentsListReducer,
});
