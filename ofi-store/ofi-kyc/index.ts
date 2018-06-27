import { combineReducers, Reducer } from 'redux';
import { KycMyInformationsReducer, KycMyInformationsState } from './my-informations';
import { AmKycListReducer, AmKycListState } from './ofi-am-kyc-list';
import { investorInvitationState, investorInvitationReducer } from './invitationsByUserAmCompany';
import { kycStatusAuditTrailState, kycStatusAuditTrailReducer } from './status-audit-trail';
import { MyKycListState, MyKycListReducer } from './kyc-list';
import { kycInformationAuditTrailState, kycInformationAuditTrailReducer } from './information-audit-trail';

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

export * from './invitationsByUserAmCompany';

export * from './kyc-list';

export interface KycState {
    myInformations: KycMyInformationsState;
    amKycList: AmKycListState;
    investorInvitations: investorInvitationState;
    myKycList: MyKycListState;
    statusAuditTrail: kycStatusAuditTrailState;
    informationAuditTrail: kycInformationAuditTrailState;
}

export const KycReducer: Reducer<KycState> = combineReducers<KycState>({
    myInformations: KycMyInformationsReducer,
    amKycList: AmKycListReducer,
    investorInvitations: investorInvitationReducer,
    myKycList: MyKycListReducer
    statusAuditTrail: kycStatusAuditTrailReducer,
    informationAuditTrail: kycInformationAuditTrailReducer,
});
