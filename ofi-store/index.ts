import {Reducer, combineReducers} from 'redux';

import {OfiFundInvestState, OfiFundInvestReducer} from './ofi-fund-invest';

export {
    SET_FUND_ACCESS_MY,
    clearRequestedFundAccessMy,
    setRequestedFundAccessMy
} from './ofi-fund-invest';

export interface OfiState {
    ofiFundInvest: OfiFundInvestState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiFundInvest: OfiFundInvestReducer,
});

