import {combineReducers, Reducer} from 'redux';

import {
    // Actions
    SET_REQUESTED_MANAGE_MEMBER_LIST,
    setRequestedManageMemberList,
    clearRequestedManageMemberList,
    SET_MANAGE_MEMBER_LIST,

    // State
    ManageMemberListState,

    // Reducer
    ManageMemberListReducer,

    // Selectors
    getMemberList
} from './manage-member-list';

export {
    SET_REQUESTED_MANAGE_MEMBER_LIST,
    setRequestedManageMemberList,
    clearRequestedManageMemberList,
    SET_MANAGE_MEMBER_LIST,
    getMemberList
};

export interface MemberState {
    manageMemberList: ManageMemberListState;
}

export const MemberReducer: Reducer<MemberState> = combineReducers<MemberState>({
    manageMemberList: ManageMemberListReducer,
});
