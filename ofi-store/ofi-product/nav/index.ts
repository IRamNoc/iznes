import {combineReducers, Reducer} from 'redux';

import {
    OfiManageNavListState,
    OfiManageNavListReducer,

    // Actions
    SET_MANAGE_NAV_LIST,
    setRequestedManageNavList,
    clearRequestedManageNavList,
    ofiSetCurrentManageNavRequest,

    // selector
    getOfiManageNavListCurrentRequest
} from './manage-nav-list';

export {
    // Actions
    SET_MANAGE_NAV_LIST,
    setRequestedManageNavList,
    clearRequestedManageNavList,
    ofiSetCurrentManageNavRequest,

    // selector
    getOfiManageNavListCurrentRequest
};

export interface OfiManageNavState {
    ofiManageNavList: OfiManageNavListState;
}

export const OfiManageNavReducer: Reducer<OfiManageNavState> = combineReducers<OfiManageNavState>({
    ofiManageNavList: OfiManageNavListReducer,
});

