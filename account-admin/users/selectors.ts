import { createSelector } from 'reselect';
import { AccountAdminState, UsersState } from '../index';

const getUserTeams = (state): AccountAdminState => state.accountAdmin;

export const getAccountAdmin = createSelector(
    getUserTeams,
    (state: AccountAdminState) => state.users,
);

export const getAccountAdminUsers = createSelector(
    getAccountAdmin,
    (state: UsersState) => state.users,
);
