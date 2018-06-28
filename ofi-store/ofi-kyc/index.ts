import {combineReducers, Reducer} from 'redux';
import {KycMyInformationsReducer, KycMyInformationsState} from './my-informations';
import {AmKycListReducer, AmKycListState} from './ofi-am-kyc-list';
import {investorInvitationState, investorInvitationReducer} from './invitationsByUserAmCompany';
import {AmKycMyRequestDetailsReducer, KycMyRequestDetailsState} from './ofi-my-request-details';

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
    clearrequested
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

export interface KycState {
    myInformations: KycMyInformationsState;
    amKycList: AmKycListState;
    investorInvitations: investorInvitationState;
    kycMyRequestDetails: KycMyRequestDetailsState;
}

export const KycReducer: Reducer<KycState> = combineReducers<KycState>({
    myInformations: KycMyInformationsReducer,
    amKycList: AmKycListReducer,
    investorInvitations: investorInvitationReducer,
    kycMyRequestDetails: AmKycMyRequestDetailsReducer,
});
