import {OfiInvestorFundListState} from './model';
import {Action} from 'redux';

import {
    SET_FUND_ACCESS_MY,
    SET_REQUESTED_FUND_ACCESS_MY,
    CLEAR_REQUESTED_FUND_ACCESS_MY,
} from './actions';

const initialState: OfiInvestorFundListState = {
    fundList: [],
    requested: false
};

/**
 *  Ofi investor fund list reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiInvestorFundListReducer = function (state: OfiInvestorFundListState = initialState, action: Action) {
    switch (action.type) {
        case SET_FUND_ACCESS_MY:
            return handleSetFundAccessMy(state, action);

        case SET_REQUESTED_FUND_ACCESS_MY:
            return handleSetRequestedFundAccessMy(state, action);

        case CLEAR_REQUESTED_FUND_ACCESS_MY:
            return handleClearRequestedFundAccessMy(state, action);

        default:
            return state;
    }
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiInvestorFundListState}
 */
function handleSetFundAccessMy(state: OfiInvestorFundListState, action: Action): OfiInvestorFundListState {
    return state;
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiInvestorFundListState}
 */
function handleSetRequestedFundAccessMy(state: OfiInvestorFundListState, action: Action): OfiInvestorFundListState {
    return state;
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiInvestorFundListState}
 */
function handleClearRequestedFundAccessMy(state: OfiInvestorFundListState, action: Action): OfiInvestorFundListState {
    return state;
}





