import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {UsersChainAccessState} from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getUsersChainAccess = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.usersChainAccess
);
