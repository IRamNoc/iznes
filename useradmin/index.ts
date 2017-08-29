import {
    UsersState,
    UsersReducer,
    SET_ADMIN_USERLIST,
    getUsersList
} from './users';

import {
    PermissionGroupState,
    PermissionGroupReducer,
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    getAdminPermissionGroup,
    getTranPermissionGroup
} from './permission-group';

import {combineReducers, Reducer} from 'redux';

export {
    SET_ADMIN_USERLIST,
    getUsersList
};

export {
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    getAdminPermissionGroup,
    getTranPermissionGroup
};

export interface AdminUsersState {
    users: UsersState;
    permissionGroup: PermissionGroupState;
}

export const adminUserReducer: Reducer<AdminUsersState> = combineReducers<AdminUsersState>({
    users: UsersReducer,
    permissionGroup: PermissionGroupReducer
});
