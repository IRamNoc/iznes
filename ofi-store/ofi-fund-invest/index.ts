import {combineReducers, Reducer} from 'redux';

import {
    OfiFundAccessMyState,
    OfiFundAccessMyReducer,

    // Actions
    SET_FUND_ACCESS_MY,
    setRequestedFundAccessMy,
    clearRequestedFundAccessMy
} from './ofi-fund-access-my';

export {
    OfiFundAccessMyState,
    OfiFundAccessMyReducer,

    // Actions
    SET_FUND_ACCESS_MY,
    setRequestedFundAccessMy,
    clearRequestedFundAccessMy
};

export interface OfiFundInvestState {
    ofiInvestorFundList: OfiFundAccessMyState;
}

export const OfiFundInvestReducer: Reducer<OfiFundInvestState> = combineReducers<OfiFundInvestState>({
    ofiInvestorFundList: OfiFundAccessMyReducer,
});
