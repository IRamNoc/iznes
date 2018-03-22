import {combineReducers, Reducer} from 'redux';

import {
    UmbrellaFundListState,
    UmbrellaFundListReducer,
    SET_UMBRELLA_FUND_LIST,
} from './umbrella-fund-list';

export {
    UmbrellaFundListState,
    UmbrellaFundListReducer,
    SET_UMBRELLA_FUND_LIST,
};

export interface UmbrellaFundState {
    umbrellaFundList: UmbrellaFundListState;
}

export const UmbrellaFundReducer: Reducer<UmbrellaFundState> = combineReducers<UmbrellaFundState>({
    umbrellaFundList: UmbrellaFundListReducer,
});
