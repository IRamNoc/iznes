import { createSelector } from 'reselect';
import { AccountAdminState, UsersAuditState } from '../index';

const getUsers = (state): AccountAdminState => state.accountAdminUsers;

export const getAccountAdmin = createSelector(
    getUsers,
    (state: AccountAdminState) => state.usersAudit,
);

export const getAccountAdminUsersAudit = createSelector(
    getAccountAdmin,
    (state: UsersAuditState) => state.users,
);
