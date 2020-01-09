import { combineReducers, Reducer } from 'redux';

import {
    SET_ACCOUNT_ADMIN_USERS,
    setRequestedAccountAdminUsers,
    clearRequestedAccountAdminUsers,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS,
    User,
    UsersState,
    usersReducer,
} from './users';

export {
    SET_ACCOUNT_ADMIN_USERS,
    setRequestedAccountAdminUsers,
    clearRequestedAccountAdminUsers,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS,
    User,
    UsersState,
    usersReducer,
};

import {
    SET_ACCOUNT_ADMIN_USERS_AUDIT,
    setRequestedAccountAdminUsersAudit,
    clearRequestedAccountAdminUsersAudit,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT,
    UsersAuditState,
    getAccountAdminUsersAudit,
    usersAuditReducer,
} from './users-audit';

export {
    SET_ACCOUNT_ADMIN_USERS_AUDIT,
    setRequestedAccountAdminUsersAudit,
    clearRequestedAccountAdminUsersAudit,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT,
    UsersAuditState,
    getAccountAdminUsersAudit,
    usersAuditReducer,
};

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

import {
    SET_ACCOUNT_ADMIN_PERMISSION_AREAS,
    setRequestedAccountAdminPermissionAreas,
    clearRequestedAccountAdminPermissionAreas,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS,
    PermissionAreasState,
    getAccountAdminPermissions,
    permissionAreasReducer,
} from './permissions';

export {
    SET_ACCOUNT_ADMIN_PERMISSION_AREAS,
    setRequestedAccountAdminPermissionAreas,
    clearRequestedAccountAdminPermissionAreas,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS,
    PermissionAreasState,
    getAccountAdminPermissions,
    permissionAreasReducer,
};

import {
    SET_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
    setRequestedAccountAdminUserPermissionAreas,
    clearRequestedAccountAdminUserPermissionAreas,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
    UserPermissionAreasState,
    getAccountAdminUserPermissions,
    userPermissionAreasReducer,
} from './users-permissions';

export {
    SET_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
    setRequestedAccountAdminUserPermissionAreas,
    clearRequestedAccountAdminUserPermissionAreas,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
    UserPermissionAreasState,
    getAccountAdminUserPermissions,
    userPermissionAreasReducer,
};

export interface AccountAdminState {
    users: UsersState;
    usersAudit: UsersAuditState;
    userPermissionAreas: UserPermissionAreasState;
    teams: UserTeamsState;
    teamsAudit: UserTeamsAuditState;
    permissionAreas: PermissionAreasState;
}

export const accountAdminReducer: Reducer<AccountAdminState> = combineReducers<AccountAdminState>({
    users: usersReducer,
    usersAudit: usersAuditReducer,
    userPermissionAreas: userPermissionAreasReducer,
    teams: userTeamsReducer,
    teamsAudit: userTeamsAuditReducer,
    permissionAreas: permissionAreasReducer,
});
