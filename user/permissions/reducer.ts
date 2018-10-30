/* Helper classes and functions. */
import * as _ from 'lodash';
import { Action } from 'redux';

/* Models. */
import { PermissionsState } from './model';

/* Actions. */
import {
    SET_PERMISSIONS_LIST,
    SET_PERMISSIONS_REQUESTED,
    RESET_PERMISSIONS_REQUESTED,
} from './actions';

/* The intitial state of programmes. */
const initialState: PermissionsState = {
    permissions: {},
    requested: false,
};

/**
 * The reducer for programmes.
 *
 * @param {Object} state - The current state.
 * @param {Action} action - The newly dispatched action.
 *
 * @return {Object} - The new state.
 */
export const permissionsReducer = function (
    state: PermissionsState = initialState,
    action: Action,
) {
    /* Switch for the action type. */
    switch (action.type) {
    /* Set programmes list. */
    case SET_PERMISSIONS_LIST:
        return handleSetPermissionsList(state, action);

    /* Set programmes requested. */
    case SET_PERMISSIONS_REQUESTED:
        return handleSetPermissionsRequested(state);

    /* Reset programmes requested. */
    case RESET_PERMISSIONS_REQUESTED:
        return handleResetPermissionsRequested(state);

    /* Default to returning the state unchanged. */
    default:
        return state;
    }
};

/**
 * Takes the current state and adds the new programmes list to it, returning that newly mutated state.
 *
 * @param {Object} state - The current state.
 * @param {Action} action - The newly dispatched action.
 *
 * @return {Object} - The new state.
 */
function handleSetPermissionsList(state, action) {
    /* Get the payload form the JSON object. */
    const permissions = _.get(action, 'payload[1].Data');

    /* Merge the new state into the previous one. */
    const newState = Object.assign({}, state, {
        permissions,
    });

    /* Return new state. */
    return handleSetPermissionsRequested(newState);
}

/**
 * Sets the requested flag to true.
 *
 * @param {Object} state - The current state.
 *
 * @return {Object} - The new state.
 */
function handleSetPermissionsRequested(state) {
    /* Merge the new state into the previous one. */
    const newState = Object.assign({}, state, {
        requested: true,
    });

    /* Return new state. */
    return newState;
}

/**
 * Resets the requested flag.
 *
 * @param {Object} state - The current state.
 *
 * @return {Object} - The new state.
 */
function handleResetPermissionsRequested(state) {
    /* Merge the new state into the previous one. */
    const newState = Object.assign({}, state, {
        requested: false,
    });

    /* Return new state. */
    return newState;
}
