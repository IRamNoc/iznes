import { createSelector } from 'reselect';
import { AccountAdminState } from '../index';

const getUserTeams = (state): AccountAdminState => state.accountAdmin;

export const getAccountAdminUserTeams = createSelector(
    getUserTeams,
    (state: AccountAdminState) => state.accountAdminTeams.teams,
);
