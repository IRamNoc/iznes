import { combineReducers, Reducer } from 'redux';

import {
    UmbrellaFundListState,
    umbrellaFundListReducer,
    SET_UMBRELLA_FUND_LIST,
    setRequestedUmbrellaFund,
} from './umbrella-fund-list';

export {
    UmbrellaFundListState,
    umbrellaFundListReducer,
    SET_UMBRELLA_FUND_LIST,
    setRequestedUmbrellaFund,
};

export interface UmbrellaFundState {
    umbrellaFundList: UmbrellaFundListState;
}

export const umbrellaFundReducer: Reducer<UmbrellaFundState> = combineReducers<UmbrellaFundState>({
    umbrellaFundList: umbrellaFundListReducer,
});
