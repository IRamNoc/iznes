import { KycDetailsReducer, KycDetailsState } from './kyc-details';
import { combineReducers, Reducer } from 'redux';
import { KycMyInformationsReducer, KycMyInformationsState } from './my-informations';
import { AmKycListReducer, AmKycListState } from './ofi-am-kyc-list';
import { investorInvitationState, investorInvitationReducer } from './invitationsByUserAmCompany';
import { kycStatusAuditTrailState, kycStatusAuditTrailReducer } from './status-audit-trail';
import { MyKycListState, MyKycListReducer } from './kyc-list';
import { MyKycRequestedState, myKycRequestedReducer, setMyKycRequestedKycs } from './kyc-request';
import { kycInformationAuditTrailState, kycInformationAuditTrailReducer } from './information-audit-trail';
import { OfiInvMyDocumentsListReducer, OfiInvMyDocumentsState } from './inv-my-documents';
import { OfiClientReferentialState, OfiClientReferentialReducer } from "./client-referential";
import { OfiClientReferentialAuditState, OfiClientReferentialAuditReducer } from "./client-referential-audit";

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
    OFI_SET_CLIENT_REFERENTIAL,
    OFI_CLEAR_REQUESTED_CLIENT_REFERENTIAL,
    OFI_SET_REQUESTED_CLIENT_REFERENTIAL,
    ofiClearRequestedClientReferential,
    ofiSetRequestedClientReferential
} from './client-referential';

export {
    OFI_SET_CLIENT_REFERENTIAL_AUDIT,
} from './client-referential-audit';

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
} from './kyc-details';

export * from './invitationsByUserAmCompany';

export * from './kyc-list';

export {
    OFI_SET_MY_DOCUMENTS_LIST,
    OFI_SET_REQUESTED_MY_DOCUMENTS,
    OFI_CLEAR_REQUESTED_MY_DOCUMENTS,
    ofiClearRequestedMyDocuments
} from './inv-my-documents';

export {
    setMyKycRequestedKycs,
    setMyKycRequestedPersist,
    clearMyKycRequestedPersist,
    MyKycRequestedIds,
    MyKycStakeholderRelations
} from './kyc-request';

export interface KycState {
    myInformations: KycMyInformationsState;
    amKycList: AmKycListState;
    investorInvitations: investorInvitationState;
    myKycList: MyKycListState;
    myKycRequested: MyKycRequestedState;
    kycDetails: KycDetailsState;
    statusAuditTrail: kycStatusAuditTrailState;
    informationAuditTrail: kycInformationAuditTrailState;
    invMyDocuments: OfiInvMyDocumentsState;
    clientReferential: OfiClientReferentialState;
    clientReferentialAudit: OfiClientReferentialAuditState;
}

export const KycReducer: Reducer<KycState> = combineReducers<KycState>({
    myInformations: KycMyInformationsReducer,
    amKycList: AmKycListReducer,
    investorInvitations: investorInvitationReducer,
    myKycList: MyKycListReducer,
    myKycRequested: myKycRequestedReducer,
    kycDetails: KycDetailsReducer,
    statusAuditTrail: kycStatusAuditTrailReducer,
    informationAuditTrail: kycInformationAuditTrailReducer,
    invMyDocuments: OfiInvMyDocumentsListReducer,
    clientReferential: OfiClientReferentialReducer,
    clientReferentialAudit: OfiClientReferentialAuditReducer,
});
