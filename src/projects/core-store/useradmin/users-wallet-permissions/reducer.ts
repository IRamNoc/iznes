import {Action} from 'redux';
import * as PermissionsActions from './actions';
import {
    UsersWalletPermissionsState,
    UsersWalletPermissionsDetail,
} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

import {getUsersWalletPermissions} from './selectors';

const initialState: UsersWalletPermissionsState = {};

export const UsersWalletPermissionsReducer = function (state: UsersWalletPermissionsState = initialState,
                                                action: Action) {

    /* Swicth the action type. */
    switch (action.type) {

        /**
         * Set admin permissions.
         */
        case PermissionsActions.SET_USERS_WALLET_PERMISSIONS:
            /* Return the new state from the custom function. */
            return setUsersWalletPermissions( state, action );

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
 * Set User Wallet Permissions
 * ---------------------------
 * Sets a user's wallet permissions, usually they come back as one and are
 * just added to the object.
 *
 * @param {state} object - the current state.
 * @param {action} object - the action, type and payload of what needs to be done.
 *
 * @return {newState} object -
 */
function setUsersWalletPermissions (state, action) {
    /* Variables. */
    let
        newState,
        newWalletPermissions = _.get(action, 'payload[1].Data', []);

    /* Now tidy the data up. */
    newWalletPermissions = sortWalletsArray(newWalletPermissions);

    /* Generate the new state. */
    newState = Object.assign({}, state, newWalletPermissions );

    return newState;
}

/**
 * Sort Wallets Array
 * ------------------
 * Sorts the wallets array into an object by User ID.
 *
 * @param  {array} array - An array of wallets, each with a user ID.
 *
 * @return {newStructure} object - a new object of wallets with
 * permissions by User ID.
 */
function sortWalletsArray ( array ) {
    /* Varibales. */
    let
        i,
        newStructure = {};

    /* Loop over each wallet and create the new userID structure. */
    for ( i in array ) {
        /* Make the user object if not exists... */
        if ( ! newStructure[ array[i].userID ] ) newStructure[ array[i].userID ] = [];

        /* ...and assing the wallet by it's ID to that user.  */
        newStructure[ array[i].userID ].push( array[i] );
    }

    /* Return. */
    return newStructure;
}
