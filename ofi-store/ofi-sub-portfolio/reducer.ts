import { Action } from 'redux';
import { get, omit } from 'lodash';
import { SubPortfolioBankingDetailsState } from './model';
import {
    SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST,
    RESET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
    SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
    DELETE_SUB_PORTFOLIO_BANKING_DETAIL,
} from './actions';

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

            case DELETE_SUB_PORTFOLIO_BANKING_DETAIL:
                return ofiDeleteSubPortfolioBankingDetailState(state, action);

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
        const bankIdentificationStatement = detail.bankIdentificationStatement
            ? JSON.parse(detail.bankIdentificationStatement)
            : {
                fileID: null,
                hash: null,
                name: null,
            };
        subPortfolioBankingDetailsList[detail.option] = {
            ...omit(detail, ['option']),
            bankIdentificationStatement,
        };
    });

    return Object.assign({}, state, { bankingDetails: subPortfolioBankingDetailsList });
}

/**
 * Delete Sub-Portfolio banking detail
 * --------------------------------------
 * @param {SubPortfolioBankingDetailsState} state
 * @param {Action} action
 * @return {SubPortfolioBankingDetailsState}
 */
function ofiDeleteSubPortfolioBankingDetailState(state: SubPortfolioBankingDetailsState, action: Action) {

    const deletedAddress = get(action, 'payload[1].Data.response[0].DeletedAddress', '');
    const newList = JSON.parse(JSON.stringify(state.bankingDetails));

    Object.keys(newList).find((key) => {
        if (key === deletedAddress) {
            delete newList[key];
            return newList;
        }
    });

    return Object.assign({}, state, { bankingDetails: newList });
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
