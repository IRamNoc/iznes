import {combineReducers, Reducer} from 'redux';

import {
    OfiFundAccessMyState,
    OfiFundAccessMyReducer,

    // Actions
    SET_FUND_ACCESS_MY,
    setRequestedFundAccessMy,
    clearRequestedFundAccessMy,
    FundAccessMyActions,
} from './ofi-fund-access-my';

export {
    OfiFundAccessMyState,
    OfiFundAccessMyReducer,

    // Actions
    SET_FUND_ACCESS_MY,
    setRequestedFundAccessMy,
    clearRequestedFundAccessMy,
    FundAccessMyActions,
};

import {
    OfiListOfFundsComponentState,
    OfiListOfFundComponentReducer,
    ofiListOfFundsComponentActions,
} from './ofi-list-of-funds-component';

export {ofiListOfFundsComponentActions};


export interface OfiFundInvestState {
    ofiInvestorFundList: OfiFundAccessMyState;
    ofiListOfFundsComponent: OfiListOfFundsComponentState;
}

export const OfiFundInvestReducer: Reducer<OfiFundInvestState> = combineReducers<OfiFundInvestState>({
    ofiInvestorFundList: OfiFundAccessMyReducer,
    ofiListOfFundsComponent: OfiListOfFundComponentReducer,
});
