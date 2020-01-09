import { createSelector } from 'reselect';
import { AdminUsersState } from '../index';
import { UserTypesState } from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getUsers = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.userTypes,
);

export const getUserTypes = createSelector(
    getUsers,
    (state: UserTypesState) => state.userTypes,
);
