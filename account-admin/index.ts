import { combineReducers, Reducer } from 'redux';

import {
    SET_ACCOUNT_ADMIN_TEAMS,
    setRequestedAccountAdminTeams,
    clearRequestedAccountAdminTeams,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS,
    UserTeam,
    UserTeamsState,
    getAccountAdminUserTeams,
    userTeamsReducer,
} from './teams';

export {
    SET_ACCOUNT_ADMIN_TEAMS,
    setRequestedAccountAdminTeams,
    clearRequestedAccountAdminTeams,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS,
    UserTeam,
    UserTeamsState,
    getAccountAdminUserTeams,
    userTeamsReducer,
};

export interface AccountAdminState {
    accountAdminTeams: UserTeamsState;
}

export const accountAdminReducer: Reducer<AccountAdminState> = combineReducers<AccountAdminState>({
    accountAdminTeams: userTeamsReducer,
});
