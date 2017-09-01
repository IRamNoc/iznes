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
    PermAreasState,
    PermAreasReducer,
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    getAdminPermAreaList,
    getTxPermAreaList
} from './permission-areas';

import {combineReducers, Reducer} from 'redux';

export {
    SET_ADMIN_USERLIST,
    getUsersList
};

export {
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    getAdminPermissionGroup,
    getTranPermissionGroup,
    getAdminPermAreaList,
    getTxPermAreaList
};

export interface AdminUsersState {
    users: UsersState;
    permissionGroup: PermissionGroupState;
    permAreaList: PermAreasState;
}

export const adminUserReducer: Reducer<AdminUsersState> = combineReducers<AdminUsersState>({
    users: UsersReducer,
    permissionGroup: PermissionGroupReducer,
    permAreaList: PermAreasReducer
});
