/* Users */
import {
    UsersState,
    UsersReducer,
} from './users';
export {
    SET_ADMIN_USERLIST,
    getUsersList
} from './users';

/* Permission groups. */
import {
    PermissionGroupState,
    PermissionGroupReducer,
} from './permission-group';
export {
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    getAdminPermissionGroup,
    getTranPermissionGroup,
} from './permission-group';

/* Permission areas. */
import {
    PermAreasState,
    PermAreasReducer,
} from './permission-areas';
export {
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    getAdminPermAreaList,
    getTxPermAreaList
} from './permission-areas';

/* Group permissions. */
import {
    PermissionsState,
    PermissionsReducer,
} from './permissions';
export {
    SET_ADMIN_PERMISSIONS,
    SET_TX_PERMISSIONS,
    getPermissions,
    getAdminPermissions,
    getTranPermissions,
} from './permissions';

/* Users permissions. */
import {
    UsersPermissionsState,
    UsersPermissionsReducer,
} from './users-permissions';
export {
    SET_USERS_ADMIN_PERMISSIONS,
    SET_USERS_TX_PERMISSIONS,
    getUsersPermissions,
    getUsersAdminPermissions,
    getUsersTxPermissions,
} from './users-permissions';

/* Define this branch of the app redux store. */
export interface AdminUsersState {
    users: UsersState;
    permissionGroup: PermissionGroupState;
    permAreaList: PermAreasState;
    permissions: PermissionsState;
    usersPermissions: UsersPermissionsState;
}

/* Import Redux reducers to combine. */
import {combineReducers, Reducer} from 'redux';

/* Export the comibined reducers of this branch. */
export const adminUserReducer: Reducer<AdminUsersState> = combineReducers<AdminUsersState>({
    users: UsersReducer,
    permissionGroup: PermissionGroupReducer,
    permAreaList: PermAreasReducer,
    permissions: PermissionsReducer,
    usersPermissions: UsersPermissionsReducer,
});
