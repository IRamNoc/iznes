import { createSelector } from 'reselect';
import { AccountAdminState, PermissionAreasState } from '../index';

const getAccountAdminObj = (state): AccountAdminState => state.accountAdmin;

export const getAccountAdminPermissions = createSelector(
    getAccountAdminObj,
    (state: AccountAdminState) => state.permissionAreas,
);

export const getAccountPermissionAreas = createSelector(
    getAccountAdminPermissions,
    (state: PermissionAreasState) => state.permissionAreas,
);
