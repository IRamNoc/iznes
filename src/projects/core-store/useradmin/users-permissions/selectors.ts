import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {UsersPermissionsState} from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getUsersPermissions = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.usersPermissions
);

export const getUsersAdminPermissions = createSelector(
    getUsersPermissions,
    (state: UsersPermissionsState) => state.usersAdminPermissions
);

export const getUsersTxPermissions = createSelector(
    getUsersPermissions,
    (state: UsersPermissionsState) => state.usersTxPermissions
);

export const getUsersMenuPermissions = createSelector(
    getUsersPermissions,
    (state: UsersPermissionsState) => state.usersMenuPermissions
);