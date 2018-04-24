import {combineReducers, Reducer} from 'redux';

import {
    UmbrellaFundListState,
    UmbrellaFundListReducer,
    SET_UMBRELLA_FUND_LIST,
    setRequestedUmbrellaFund
} from './umbrella-fund-list';

export {
    UmbrellaFundListState,
    UmbrellaFundListReducer,
    SET_UMBRELLA_FUND_LIST,
    setRequestedUmbrellaFund
};

export interface UmbrellaFundState {
    umbrellaFundList: UmbrellaFundListState;
}

export const UmbrellaFundReducer: Reducer<UmbrellaFundState> = combineReducers<UmbrellaFundState>({
    umbrellaFundList: UmbrellaFundListReducer,
});
