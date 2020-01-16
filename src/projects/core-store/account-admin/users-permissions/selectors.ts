import { createSelector } from 'reselect';
import { AccountAdminState, UserPermissionAreasState } from '../index';

const getAccountAdminObj = (state): AccountAdminState => state.accountAdmin;

export const getAccountAdminUserPermissions = createSelector(
    getAccountAdminObj,
    (state: AccountAdminState) => state.userPermissionAreas,
);

export const getAccountUserPermissionAreas = createSelector(
    getAccountAdminUserPermissions,
    (state: UserPermissionAreasState) => state.permissionAreas,
);
