import {combineReducers, Reducer} from 'redux';

import {
    OfiNavFundsListState,
    OfiNavFundsListReducer,

    // Actions
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    clearRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,

    // selector
    getOfiNavFundsListCurrentRequest
} from './nav-funds-list';

export {
    // Actions
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    clearRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,

    // selector
    getOfiNavFundsListCurrentRequest
};

export interface OfiManageNavState {
    ofiNavFundsList: OfiNavFundsListState;
}

export const OfiManageNavReducer: Reducer<OfiManageNavState> = combineReducers<OfiManageNavState>({
    ofiNavFundsList: OfiNavFundsListReducer,
});

