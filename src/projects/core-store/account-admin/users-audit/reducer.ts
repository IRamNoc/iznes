import {
    SET_ACCOUNT_ADMIN_USERS_AUDIT,
    SET_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT,
} from './actions';
import { UsersAuditState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: UsersAuditState = {
    users: [],
    requested: false,
};

export const usersAuditReducer = function (state: UsersAuditState = initialState,
                                           action: Action) {
    let newState: UsersAuditState;

    switch (action.type) {
    case SET_ACCOUNT_ADMIN_USERS_AUDIT:
        const users = _.get(action, 'payload[1].Data', []);

        newState = Object.assign({}, state, {
            users,
        });

        return newState;

    case SET_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT:
        return toggleAccountAdminUsersAuditRequested(state, true);

    case CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS_AUDIT:
        return toggleAccountAdminUsersAuditRequested(state, false);

    default:
        return state;
    }
};

/**
 * Toggle requested
 * @param state
 * @param requestedUsers
 * @return {UsersAuditState}
 */
function toggleAccountAdminUsersAuditRequested(state: UsersAuditState,
                                               requested: boolean): UsersAuditState {
    return Object.assign({}, state, {
        requested,
    });
}
