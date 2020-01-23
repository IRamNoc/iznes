import {
    SET_ACCOUNT_ADMIN_TEAMS,
    SET_REQUESTED_ACCOUNT_ADMIN_TEAMS,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS,
} from './actions';
import { UserTeamsState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: UserTeamsState = {
    teams: [],
    requested: false,
};

export const userTeamsReducer = function (state: UserTeamsState = initialState,
                                          action: Action) {
    let newState: UserTeamsState;

    switch (action.type) {
    case SET_ACCOUNT_ADMIN_TEAMS:
        const teams = _.get(action, 'payload[1].Data', []);

        newState = Object.assign({}, state, {
            teams,
        });

        return newState;

    case SET_REQUESTED_ACCOUNT_ADMIN_TEAMS:
        return toggleAccountAdminTeamsRequested(state, true);

    case CLEAR_REQUESTED_ACCOUNT_ADMIN_TEAMS:
        return toggleAccountAdminTeamsRequested(state, false);

    default:
        return state;
    }
};

/**
 * Toggle requested
 * @param state
 * @param requestedTeams
 * @return {AccountAdminTeamsState}
 */
function toggleAccountAdminTeamsRequested(state: UserTeamsState,
                                          requested: boolean): UserTeamsState {
    return Object.assign({}, state, {
        requested,
    });
}
