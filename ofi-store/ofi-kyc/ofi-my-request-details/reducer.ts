import * as actions from './actions';
import {Action} from 'redux';
import {KycMyRequestDetailsState} from './model';
import * as _ from 'lodash';
import {immutableHelper, mDateHelper} from '@setl/utils';

const initialState: KycMyRequestDetailsState = {
    kycMyRequestDetailsGeneral: [],
    kycMyRequestDetailsGeneralRequested: false,
    kycMyRequestDetailsCompany: [],
    kycMyRequestDetailsCompanyRequested: false,
    kycMyRequestDetailsCompanyBeneficiaries: [],
    kycMyRequestDetailsCompanyBeneficiariesRequested: false,
    kycMyRequestDetailsBanking: [],
    kycMyRequestDetailsBankingRequested: false,
    kycMyRequestDetailsClassification: [],
    kycMyRequestDetailsClassificationRequested: false,
    kycMyRequestDetailsRisknature: [],
    kycMyRequestDetailsRisknatureRequested: false,
    kycMyRequestDetailsRiskobjective: [],
    kycMyRequestDetailsRiskobjectiveRequested: false,
    kycMyRequestDetailsDocuments: [],
    kycMyRequestDetailsDocumentsRequested: false,
};

export function AmKycMyRequestDetailsReducer(state: KycMyRequestDetailsState = initialState, action: Action): KycMyRequestDetailsState {
    switch (action.type) {
        case actions.SET_KYC_MYREQ_DETAILS_GENERAL:
            return handleIt(state, action);
        case actions.SET_KYC_MYREQ_DETAILS_GENERAL_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_KYC_MYREQ_DETAILS_GENERAL_REQUESTED:
            return toggleRequested(state, false);
        case actions.SET_KYC_MYREQ_DETAILS_COMPANY:
            return handleIt(state, action);
        case actions.SET_KYC_MYREQ_DETAILS_COMPANY_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_KYC_MYREQ_DETAILS_COMPANY_REQUESTED:
            return toggleRequested(state, false);
        case actions.SET_KYC_MYREQ_DETAILS_COMPANYBENEFICIARIES:
            return handleIt(state, action);
        case actions.SET_KYC_MYREQ_DETAILS_COMPANYBENEFICIARIES_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_KYC_MYREQ_DETAILS_COMPANYBENEFICIARIES_REQUESTED:
            return toggleRequested(state, false);
        case actions.SET_KYC_MYREQ_DETAILS_BANKING:
            return handleIt(state, action);
        case actions.SET_KYC_MYREQ_DETAILS_BANKING_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_KYC_MYREQ_DETAILS_BANKING_REQUESTED:
            return toggleRequested(state, false);
        case actions.SET_KYC_MYREQ_DETAILS_CLASSIFICATION:
            return handleIt(state, action);
        case actions.SET_KYC_MYREQ_DETAILS_CLASSIFICATION_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_KYC_MYREQ_DETAILS_CLASSIFICATION_REQUESTED:
            return toggleRequested(state, false);
        case actions.SET_KYC_MYREQ_DETAILS_RISKNATURE:
            return handleIt(state, action);
        case actions.SET_KYC_MYREQ_DETAILS_RISKNATURE_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_KYC_MYREQ_DETAILS_RISKNATURE_REQUESTED:
            return toggleRequested(state, false);
        case actions.SET_KYC_MYREQ_DETAILS_RISKOBJECTIVES:
            return handleIt(state, action);
        case actions.SET_KYC_MYREQ_DETAILS_RISKOBJECTIVES_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_KYC_MYREQ_DETAILS_RISKOBJECTIVES_REQUESTED:
            return toggleRequested(state, false);
        case actions.SET_KYC_MYREQ_DETAILS_DOCUMENTS:
            return handleIt(state, action);
        case actions.SET_KYC_MYREQ_DETAILS_DOCUMENTS_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_KYC_MYREQ_DETAILS_DOCUMENTS_REQUESTED:
            return toggleRequested(state, false);
        default:
            return state;
    }
}

function handleIt(state: KycMyRequestDetailsState, action: Action): KycMyRequestDetailsState {
    const myArr = [];
    return Object.assign({}, state, {
        myArr
    });
}

function toggleRequested(state: KycMyRequestDetailsState, requested): KycMyRequestDetailsState {
    return Object.assign({}, state, {
        requested
    });
}