import {combineReducers, Reducer} from 'redux';

import {
    FundListState,
    FundListReducer,
    SET_FUND_LIST,
    SET_FUND_SHARE_LIST,
    GET_IZN_FUND_LIST
} from './fund-list';

export {
    FundListState,
    FundListReducer,
    SET_FUND_LIST,
    SET_FUND_SHARE_LIST,
    GET_IZN_FUND_LIST
};

export interface FundState {
    fundList: FundListState;
}

export const FundReducer: Reducer<FundState> = combineReducers<FundState>({
    fundList: FundListReducer,
});
