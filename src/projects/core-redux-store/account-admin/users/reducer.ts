import {
    SET_ACCOUNT_ADMIN_USERS,
    SET_REQUESTED_ACCOUNT_ADMIN_USERS,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS,
} from './actions';
import { UsersState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: UsersState = {
    users: [],
    requested: false,
};

export const usersReducer = function (state: UsersState = initialState,
                                      action: Action) {
    let newState: UsersState;

    switch (action.type) {
    case SET_ACCOUNT_ADMIN_USERS:
        const users = _.get(action, 'payload[1].Data', []);

        _.forEach(users, (user) => {
            user.status = user.userStatus;
        });

        newState = Object.assign({}, state, {
            users,
        });

        return newState;

    case SET_REQUESTED_ACCOUNT_ADMIN_USERS:
        return toggleAccountAdminUsersRequested(state, true);

    case CLEAR_REQUESTED_ACCOUNT_ADMIN_USERS:
        return toggleAccountAdminUsersRequested(state, false);

    default:
        return state;
    }
};

/**
 * Toggle requested
 * @param state
 * @param requestedUsers
 * @return {UsersState}
 */
function toggleAccountAdminUsersRequested(state: UsersState,
                                          requested: boolean): UsersState {
    return Object.assign({}, state, {
        requested,
    });
}
