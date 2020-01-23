import {
    SET_USER_TYPES,
    SET_REQUESTED_USER_TYPES,
    CLEAR_REQUESTED_USER_TYPES,
} from './actions';
import { UserTypesState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: UserTypesState = {
    userTypes: [],
    requested: false,
};

export const userTypesReducer = function (state: UserTypesState = initialState,
                                          action: Action) {
    let newState: UserTypesState;

    switch (action.type) {
    case SET_USER_TYPES:
        const userTypes = _.get(action, 'payload[1].Data', []);

        newState = Object.assign({}, state, {
            userTypes,
        });

        return newState;

    case SET_REQUESTED_USER_TYPES:
        return toggleUserTypesRequested(state, true);

    case CLEAR_REQUESTED_USER_TYPES:
        return toggleUserTypesRequested(state, false);

    default:
        return state;
    }
};

/**
 * Toggle requested
 * @param state
 * @param requestedUserTypes
 * @return {UserTypesState}
 */
function toggleUserTypesRequested(state: UserTypesState,
                                  requested: boolean): UserTypesState {
    return Object.assign({}, state, {
        requested,
    });
}
