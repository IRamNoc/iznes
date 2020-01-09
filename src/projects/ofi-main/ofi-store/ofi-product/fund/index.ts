import { combineReducers, Reducer } from 'redux';

import {
    FundListState,
    FundListReducer,
    GET_IZN_FUND_LIST,
    setRequestedIznesFunds,
} from './fund-list';

export {
    FundListState,
    FundListReducer,
    GET_IZN_FUND_LIST,
    setRequestedIznesFunds,
};

export interface FundState {
    fundList: FundListState;
}

export const FundReducer: Reducer<FundState> = combineReducers<FundState>({
    fundList: FundListReducer,
});
