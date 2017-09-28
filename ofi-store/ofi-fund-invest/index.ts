import {combineReducers, Reducer} from 'redux';

import {
    OfiInvestorFundAccessMyState,
    OfiInvestorFundAccessMyReducer,

    // Actions
    SET_FUND_ACCESS_MY,
    setRequestedFundAccessMy,
    clearRequestedFundAccessMy
} from './ofi-investor-fund-list';

export {
    OfiInvestorFundAccessMyState,
    OfiInvestorFundAccessMyReducer,

    // Actions
    SET_FUND_ACCESS_MY,
    setRequestedFundAccessMy,
    clearRequestedFundAccessMy
};

export interface OfiFundInvestState {
    ofiInvestorFundList: OfiInvestorFundAccessMyState;
}

export const OfiFundInvestReducer: Reducer<OfiFundInvestState> = combineReducers<OfiFundInvestState>({
    ofiInvestorFundList: OfiInvestorFundAccessMyReducer,
});
