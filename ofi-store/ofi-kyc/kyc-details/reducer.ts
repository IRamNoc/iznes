import {
    CLEAR_KYC_DETAILS_BANKING_REQUESTED,
    CLEAR_KYC_DETAILS_CLASSIFICATION_REQUESTED,
    CLEAR_KYC_DETAILS_COMPANY_REQUESTED,
    CLEAR_KYC_DETAILS_COMPANYBENEFICIARIES_REQUESTED,
    CLEAR_KYC_DETAILS_DOCUMENTS_REQUESTED,
    CLEAR_KYC_DETAILS_GENERAL_REQUESTED,
    CLEAR_KYC_DETAILS_RISKNATURE_REQUESTED,
    CLEAR_KYC_DETAILS_RISKOBJECTIVES_REQUESTED,

    SET_KYC_DETAILS_BANKING,
    SET_KYC_DETAILS_BANKING_REQUESTED,
    SET_KYC_DETAILS_CLASSIFICATION,
    SET_KYC_DETAILS_CLASSIFICATION_REQUESTED,
    SET_KYC_DETAILS_COMPANY,
    SET_KYC_DETAILS_COMPANY_REQUESTED,
    SET_KYC_DETAILS_COMPANYBENEFICIARIES,
    SET_KYC_DETAILS_COMPANYBENEFICIARIES_REQUESTED,
    SET_KYC_DETAILS_DOCUMENTS,
    SET_KYC_DETAILS_DOCUMENTS_REQUESTED,
    SET_KYC_DETAILS_GENERAL,
    SET_KYC_DETAILS_GENERAL_REQUESTED,
    SET_KYC_DETAILS_RISKNATURE,
    SET_KYC_DETAILS_RISKNATURE_REQUESTED,
    SET_KYC_DETAILS_RISKOBJECTIVES,
    SET_KYC_DETAILS_RISKOBJECTIVES_REQUESTED
} from './actions';
import {Action} from 'redux';
import {get as getValue} from 'lodash';

import {KycDetailsState} from './model';

const initialState: KycDetailsState = {
    kycDetailsGeneral: {},
    kycDetailsGeneralRequested: false,
    kycDetailsCompany: {},
    kycDetailsCompanyRequested: false,
    kycDetailsCompanyBeneficiaries: {},
    kycDetailsCompanyBeneficiariesRequested: false,
    kycDetailsBanking: {},
    kycDetailsBankingRequested: false,
    kycDetailsClassification: {},
    kycDetailsClassificationRequested: false,
    kycDetailsRiskNature: {},
    kycDetailsRiskNatureRequested: false,
    kycDetailsRiskObjective: {},
    kycDetailsRiskObjectiveRequested: false,
    kycDetailsDocuments: {},
    kycDetailsDocumentsRequested: false,
};

export function KycDetailsReducer(state: KycDetailsState = initialState, action: Action): KycDetailsState {
    switch (action.type) {

        case SET_KYC_DETAILS_GENERAL:
            return handleDetailResponse(state, action, 'kycDetailsGeneral');
        case SET_KYC_DETAILS_GENERAL_REQUESTED:
            return toggleRequested(state, true);
        case CLEAR_KYC_DETAILS_GENERAL_REQUESTED:
            return toggleRequested(state, false);

        case SET_KYC_DETAILS_COMPANY:
            return handleDetailResponse(state, action, 'kycDetailsCompany');
        case SET_KYC_DETAILS_COMPANY_REQUESTED:
            return toggleRequested(state, true);
        case CLEAR_KYC_DETAILS_COMPANY_REQUESTED:
            return toggleRequested(state, false);

        case SET_KYC_DETAILS_COMPANYBENEFICIARIES:
            return handleDetailResponseMultiple(state, action, 'kycDetailsCompanyBeneficiaries');
        case SET_KYC_DETAILS_COMPANYBENEFICIARIES_REQUESTED:
            return toggleRequested(state, true);
        case CLEAR_KYC_DETAILS_COMPANYBENEFICIARIES_REQUESTED:
            return toggleRequested(state, false);

        case SET_KYC_DETAILS_BANKING:
            return handleDetailResponse(state, action, 'kycDetailsBanking');
        case SET_KYC_DETAILS_BANKING_REQUESTED:
            return toggleRequested(state, true);
        case CLEAR_KYC_DETAILS_BANKING_REQUESTED:
            return toggleRequested(state, false);

        case SET_KYC_DETAILS_CLASSIFICATION:
            return handleDetailResponse(state, action, 'kycDetailsClassification');
        case SET_KYC_DETAILS_CLASSIFICATION_REQUESTED:
            return toggleRequested(state, true);
        case CLEAR_KYC_DETAILS_CLASSIFICATION_REQUESTED:
            return toggleRequested(state, false);

        case SET_KYC_DETAILS_RISKNATURE:
            return handleDetailResponse(state, action, 'kycDetailsRiskNature');
        case SET_KYC_DETAILS_RISKNATURE_REQUESTED:
            return toggleRequested(state, true);
        case CLEAR_KYC_DETAILS_RISKNATURE_REQUESTED:
            return toggleRequested(state, false);

        case SET_KYC_DETAILS_RISKOBJECTIVES:
            return handleDetailResponse(state, action, 'kycDetailsRiskObjective');
        case SET_KYC_DETAILS_RISKOBJECTIVES_REQUESTED:
            return toggleRequested(state, true);
        case CLEAR_KYC_DETAILS_RISKOBJECTIVES_REQUESTED:
            return toggleRequested(state, false);

        case SET_KYC_DETAILS_DOCUMENTS:
            return handleDetailResponseMultiple(state, action, 'kycDetailsDocuments');
        case SET_KYC_DETAILS_DOCUMENTS_REQUESTED:
            return toggleRequested(state, true);
        case CLEAR_KYC_DETAILS_DOCUMENTS_REQUESTED:
            return toggleRequested(state, false);

        default:
            return state;
    }
}

function handleDetailResponse(state: KycDetailsState, action: Action, type: string): KycDetailsState {
    let data = getValue(action, ['payload', 1, 'Data', 0]);

    let response = {};
    response[type] = data;

    return {
        ...state,
        ...response
    };
}

function handleDetailResponseMultiple(state: KycDetailsState, action: Action, type: string): KycDetailsState {
    let data = getValue(action, ['payload', 1, 'Data']);

    let response = {};
    response[type] = data;

    return {
        ...state,
        ...response
    };
}

function toggleRequested(state: KycDetailsState, requested): KycDetailsState {
    return Object.assign({}, state, {
        requested
    });
}