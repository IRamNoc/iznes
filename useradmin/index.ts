import {
    UsersState,
    UsersReducer,
    SET_ADMIN_USERLIST,
    getUsersList
} from './users';

import {combineReducers, Reducer} from 'redux';

export {
    SET_ADMIN_USERLIST,
    getUsersList
};

export interface AdminUsersState {
    users: UsersState;
}

export const adminUserReducer: Reducer<AdminUsersState> = combineReducers<AdminUsersState>({
    users: UsersReducer
});
