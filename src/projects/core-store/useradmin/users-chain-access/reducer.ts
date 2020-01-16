import {Action} from 'redux';
import * as PermissionsActions from './actions';
import {
    UsersChainAccessState,
    UsersChainAccessDetail,
} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

import {getUsersChainAccess} from './selectors';

const initialState: UsersChainAccessState = {};

export const UsersChainAccessReducer = function (state: UsersChainAccessState = initialState,
                                                action: Action) {

    /* Swicth the action type. */
    switch (action.type) {

        /**
         * Set admin access.
         */
        case PermissionsActions.SET_USERS_CHAIN_ACCESS:
            /* Return the new state from the custom function. */
            return setUsersChainAccess( state, action );

        /**
        * Default
        * -------
        * Returns the original state.
        */
        default:
            return state;
    }
};

/**
 * Set User Chain Access
 * ---------------------------
 * Sets a user's chain access, usually they come back as one and are
 * just added to the object.
 *
 * @param {state} object - the current state.
 * @param {action} object - the action, type and payload of what needs to be done.
 *
 * @return {newState} object -
 */
function setUsersChainAccess (state, action) {
    /* Variables. */
    let
        newState,
        newChainAccess = _.get(action, 'payload[1].Data', []);

    /* Now tidy the data up. */
    newChainAccess = sortChainArray(newChainAccess);

    /* Generate the new state. */
    newState = Object.assign({}, state, newChainAccess );

    return newState;
}

/**
 * Sort Chains Array
 * ------------------
 * Sorts the chains array into an object by User ID.
 *
 * @param  {array} array - An array of chains, each with a user ID.
 *
 * @return {newStructure} object - a new object of chains access by User ID.
 */
function sortChainArray ( array ) {
    /* Varibales. */
    let
        i,
        newStructure = {};

    /* Loop over each chain and create the new userID structure. */
    for ( i in array ) {
        /* Make the user object if not exists... */
        if ( ! newStructure[ array[i].userID ] ) newStructure[ array[i].userID ] = [];

        /* ...and assing the chain by it's ID to that user.  */
        newStructure[ array[i].userID ].push( array[i] );
    }

    /* Return. */
    return newStructure;
}
