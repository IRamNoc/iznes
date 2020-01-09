import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {UsersWalletPermissionsState} from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getUsersWalletPermissions = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.usersWalletPermissions
);
