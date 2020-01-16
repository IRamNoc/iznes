import {Action} from 'redux';
import * as PermissionsActions from './actions';
import {
    UsersPermissionsState,
    UsersAdminPermissonDetail,
    UsersTxPermissonDetail,
    UsersMenuPermissonDetail
} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

import {getAdminPermissions, getTranPermissions} from '@setl/core-store'

const initialState: UsersPermissionsState = {
    usersAdminPermissions: {},
    usersTxPermissions: {},
    usersMenuPermissions: {}
};

export const UsersPermissionsReducer = function (state: UsersPermissionsState = initialState,
                                                 action: Action) {

    /* Local variables. */
    let newState: UsersPermissionsState;
    let usersAdminPermissions: {
        [key: number]: UsersAdminPermissonDetail
    };
    let usersTxPermissions: {
        [key: number]: UsersTxPermissonDetail
    };
    let usersMenuPermissions: {
        [key: number]: UsersMenuPermissonDetail
    };
    let newEntityPermissions: any;

    /* Swicth the action type. */
    switch (action.type) {

        /**
         * Set admin permissions.
         * ----------------------
         * Adds permissions for a administrative entity to the store.
         *
         * @payload {entityPermissions} - an object of permissions for an entity.
         */
        case PermissionsActions.SET_USERS_ADMIN_PERMISSIONS:
            /* Pull the data from the message body. */
            newEntityPermissions = _.get(action, 'payload[1].Data', []);

            /* Now tidy the data up. */
            newEntityPermissions = sortPermissionsArray(newEntityPermissions);

            /* Assign the new permissions with the old ones. */
            usersAdminPermissions = Object.assign({}, state.usersAdminPermissions, newEntityPermissions);

            /* Generate the new state. */
            newState = Object.assign({}, state, {
                usersAdminPermissions
            });

            /* Return the new state. */
            return newState;

        /**
         * Set trans permissions.
         * ----------------------
         * Adds permissions for a transactional entity to the store.
         *
         * @payload {entityPermissions} - an object of permissions for an entity.
         */
        case PermissionsActions.SET_USERS_TX_PERMISSIONS:
            /* Pull the data from the message body. */
            newEntityPermissions = _.get(action, 'payload[1].Data', []);

            /* Now tidy the data up. */
            newEntityPermissions = sortPermissionsArray(newEntityPermissions);

            /* Assign the new permissions with the old ones. */
            usersTxPermissions = Object.assign({}, state.usersTxPermissions, newEntityPermissions);

            /* Generate the new state. */
            newState = Object.assign({}, state, {
                usersTxPermissions
            });

            /* Return the new state. */
            return newState;

        /**
         * Set menu permissions.
         * ----------------------
         * Adds permissions for a menu entity to the store.
         *
         * @payload {entityPermissions} - an object of permissions for an entity.
         */
        case PermissionsActions.SET_USERS_MENU_PERMISSIONS:
            /* Pull the data from the message body. */
            newEntityPermissions = _.get(action, 'payload[1].Data', []);

            /* Now tidy the data up. */
            newEntityPermissions = sortPermissionsArray(newEntityPermissions);

            /* Assign the new permissions with the old ones. */
            usersMenuPermissions = Object.assign({}, state.usersMenuPermissions, newEntityPermissions);

            /* Generate the new state. */
            newState = Object.assign({}, state, {
                usersMenuPermissions
            });

            /* Return the new state. */
            return newState;

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
 * Sort Permissions Array
 * ----------------------
 * Pass in an array of permissions and get back an objects of permissions by ID
 * under thier entity ID
 *
 * @param {permissions} - the current array of permissions.
 *
 * @return {newStructure} - the new object to be assigned to the store.
 * e.g {
 *     [entityId: number]: {
 *         [permissionId: number]: { [permission: string]: value:number },
 *         ...
 *     }
 * }
 */
function sortPermissionsArray(permissions) {
    /* New data. */
    let
        i,
        newStructure = {};

    /* Let's flatten the array into an object of permissions by permission ID. */
    for (i = 0; i < permissions.length; i++) {
        /* Handle the entity object not existing. */
        if (!newStructure[permissions[i].userID]) newStructure[permissions[i].userID] = {};

        /* Assign the permission by ID. */
        newStructure[permissions[i].userID][permissions[i].groupID] = permissions[i];
    }

    /* Return. */
    return newStructure;
}
