import {combineReducers, Reducer} from 'redux';

import {
    OfiInvestorFundListState,
    OfiInvestorFundListReducer
} from './ofi-investor-fund-list';

export {
    OfiInvestorFundListState,
    OfiInvestorFundListReducer
};

export interface OfiFundInvestState {
    ofiInvestorFundList: OfiInvestorFundListState;
}

export const OfiFundInvestReducer: Reducer<OfiFundInvestState> = combineReducers({
    ofiInvestorFundList: OfiInvestorFundListReducer,
});
