import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {PermissionGroupState} from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getPermissionGroup = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.permissionGroup
);

export const getAdminPermissionGroup = createSelector(
    getPermissionGroup,
    (state: PermissionGroupState) => state.adminPermList
);

export const getTranPermissionGroup = createSelector(
    getPermissionGroup,
    (state: PermissionGroupState) => state.tranPermList
);

export const getMenuPermissionGroup = createSelector(
    getPermissionGroup,
    (state: PermissionGroupState) => state.menuPermList
);
