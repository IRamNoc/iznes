import { combineReducers, Reducer } from 'redux';

import {
    SET_ACCOUNT_ADMIN_TEAMS,
    setRequestedAccountAdminTeams,
    clearRequestedAccountAdminTeams,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS,
    UserTeam,
    UserTeamsState,
    getAccountAdmin,
    getAccountAdminTeams,
    userTeamsReducer,
} from './teams';

export {
    SET_ACCOUNT_ADMIN_TEAMS,
    setRequestedAccountAdminTeams,
    clearRequestedAccountAdminTeams,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS,
    UserTeam,
    UserTeamsState,
    getAccountAdmin,
    getAccountAdminTeams,
    userTeamsReducer,
};

import {
    SET_ACCOUNT_ADMIN_TEAMS_AUDIT,
    setRequestedAccountAdminTeamsAudit,
    clearRequestedAccountAdminTeamsAudit,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT,
    UserTeamsAuditState,
    getAccountAdminTeamsAudit,
    userTeamsAuditReducer,
} from './teams-audit';

export {
    SET_ACCOUNT_ADMIN_TEAMS_AUDIT,
    setRequestedAccountAdminTeamsAudit,
    clearRequestedAccountAdminTeamsAudit,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT,
    UserTeamsAuditState,
    getAccountAdminTeamsAudit,
    userTeamsAuditReducer,
};

export interface AccountAdminState {
    accountAdminTeams: UserTeamsState;
    accountAdminTeamsAudit: UserTeamsAuditState;
}

export const accountAdminReducer: Reducer<AccountAdminState> = combineReducers<AccountAdminState>({
    accountAdminTeams: userTeamsReducer,
    accountAdminTeamsAudit: userTeamsAuditReducer,
});
