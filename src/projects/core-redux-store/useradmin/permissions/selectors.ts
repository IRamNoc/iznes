import { createSelector } from 'reselect';
import { AdminUsersState } from '../index';
import { PermissionsState } from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getPermissions = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.permissions,
);

export const getAdminPermissions = createSelector(
    getPermissions,
    (state: PermissionsState) => state.adminPermissions,
);

export const getTranPermissions = createSelector(
    getPermissions,
    (state: PermissionsState) => state.transPermissions,
);

export const getMenuPermissions = createSelector(
    getPermissions,
    (state: PermissionsState) => state.menuPermissions,
);
