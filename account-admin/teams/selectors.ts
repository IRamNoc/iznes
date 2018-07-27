import { createSelector } from 'reselect';
import { AccountAdminState, UserTeamsState } from '../index';

const getUserTeams = (state): AccountAdminState => state.accountAdmin;

export const getAccountAdmin = createSelector(
    getUserTeams,
    (state: AccountAdminState) => state.teams,
);

export const getAccountAdminTeams = createSelector(
    getAccountAdmin,
    (state: UserTeamsState) => state.teams,
);
