import {combineReducers, Reducer} from 'redux';

import {
    OfiInvestorFundListState,
    OfiInvestorFundListReducer,

    // Actions
    SET_FUND_ACCESS_MY,
    setRequestedFundAccessMy,
    clearRequestedFundAccessMy
} from './ofi-investor-fund-list';

export {
    OfiInvestorFundListState,
    OfiInvestorFundListReducer,

    // Actions
    SET_FUND_ACCESS_MY,
    setRequestedFundAccessMy,
    clearRequestedFundAccessMy
};

export interface OfiFundInvestState {
    ofiInvestorFundList: OfiInvestorFundListState;
}

export const OfiFundInvestReducer: Reducer<OfiFundInvestState> = combineReducers<OfiFundInvestState>({
    ofiInvestorFundList: OfiInvestorFundListReducer,
});
