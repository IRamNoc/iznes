import {
    SET_ACCOUNT_ADMIN_TEAMS_AUDIT,
    SET_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT,
} from './actions';
import { UserTeamsAuditState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: UserTeamsAuditState = {
    teams: [],
    requested: false,
};

export const userTeamsAuditReducer = function (state: UserTeamsAuditState = initialState,
                                               action: Action) {
    let newState: UserTeamsAuditState;

    switch (action.type) {
    case SET_ACCOUNT_ADMIN_TEAMS_AUDIT:
        const teams = _.get(action, 'payload[1].Data', []);

        newState = Object.assign({}, state, {
            teams,
        });

        return newState;

    case SET_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT:
        return toggleAccountAdminTeamsAuditRequested(state, true);

    case CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS_AUDIT:
        return toggleAccountAdminTeamsAuditRequested(state, false);

    default:
        return state;
    }
};

/**
 * Toggle requested
 * @param state
 * @param requestedTeams
 * @return {UserTeamsAuditState}
 */
function toggleAccountAdminTeamsAuditRequested(state: UserTeamsAuditState,
                                               requested: boolean): UserTeamsAuditState {
    return Object.assign({}, state, {
        requested,
    });
}
