import { createSelector } from 'reselect';
import { AdminUsersState } from '../index';
import { UsersState } from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin

export const getUsers = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.users,
);

export const getUsersList = createSelector(
    getUsers,
    (state: UsersState) => state.usersList,
);
