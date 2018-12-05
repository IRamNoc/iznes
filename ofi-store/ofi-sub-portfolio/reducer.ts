import { Action } from 'redux';

import { SubPortfolioBankingDetailsState } from './model';
import {
    SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST,
    RESET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
    SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
} from './actions';
import { get, merge } from 'lodash';

const initialState: SubPortfolioBankingDetailsState = {
    requested: false,
    bankingDetails: {},
};

export const OfiSubPortfolioBankingDetailsReducer =
    function (state: SubPortfolioBankingDetailsState = initialState, action: Action) {

        switch (action.type) {

            case SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED:
                return toggleRequestState(state, true);

            case RESET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED:
                return toggleRequestState(state, false);

            case SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST:
                return ofiSetSubPortfolioBankingDetailsState(state, action);

            default:
                return state;
        }
    };

/**
 * Set Sub-Portfolio banking details list
 * --------------------------------------
 * @param {SubPortfolioBankingDetailsState} state
 * @param {Action} action
 * @return {SubPortfolioBankingDetailsState}
 */
function ofiSetSubPortfolioBankingDetailsState(state: SubPortfolioBankingDetailsState, action: Action) {

    const bankingDetails = get(action, 'payload[1].Data', []);
    const subPortfolioBankingDetailsList: any = {};

    bankingDetails.forEach((detail) => {
        subPortfolioBankingDetailsList[detail.option] = {
            establishmentName: detail.establishmentName,
            bic: detail.bic,
            addressLine1: detail.addressLine1,
            addressLine2: detail.addressLine2,
            zipCode: detail.zipCode,
            city: detail.city,
            country: detail.country,
        };
    });

    return Object.assign({}, state, { bankingDetails: subPortfolioBankingDetailsList });
}

/**
 * Toggle Requested Flag
 * ---------------------
 * @param {SubPortfolioBankingDetailsState} state
 * @param {boolean} requested
 * @return {SubPortfolioBankingDetailsState}
 */
function toggleRequestState(state: SubPortfolioBankingDetailsState, requested: boolean): SubPortfolioBankingDetailsState {
    return Object.assign({}, state, { requested });
}
