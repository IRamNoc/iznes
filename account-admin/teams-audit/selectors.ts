import { createSelector } from 'reselect';
import { AccountAdminState, UserTeamsAuditState } from '../index';

const getUserTeams = (state): AccountAdminState => state.accountAdminTeams;

export const getAccountAdmin = createSelector(
    getUserTeams,
    (state: AccountAdminState) => state.teamsAudit,
);

export const getAccountAdminTeamsAudit = createSelector(
    getAccountAdmin,
    (state: UserTeamsAuditState) => state.teams,
);
