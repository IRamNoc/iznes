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

import {
    AdminPermAreasState,
    PermissionAreasReducer,
    SET_ADMIN_PERMISSION_AREAS_LIST,
    getAdminPermAreaList
} from './permission-areas';

import {combineReducers, Reducer} from 'redux';

export {
    SET_ADMIN_USERLIST,
    getUsersList
};

export {
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    SET_ADMIN_PERMISSION_AREAS_LIST,
    getAdminPermissionGroup,
    getTranPermissionGroup,
    getAdminPermAreaList
};

export interface AdminUsersState {
    users: UsersState;
    permissionGroup: PermissionGroupState;
    permAreaList: AdminPermAreasState;
}

export const adminUserReducer: Reducer<AdminUsersState> = combineReducers<AdminUsersState>({
    users: UsersReducer,
    permissionGroup: PermissionGroupReducer,
    permAreaList: PermissionAreasReducer
});
