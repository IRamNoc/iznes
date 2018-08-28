import { Action } from 'redux';
import * as PermissionsActions from './actions';
import {
    PermissionsState,
    AdminPermissonDetail,
    TransPermissonDetail,
    MenuPermissonDetail,
} from './model';
import * as _ from 'lodash';

const initialState: PermissionsState = {
    adminPermissions: {},
    transPermissions: {},
    menuPermissions: {},
};

export const permissionsReducer = function (state: PermissionsState = initialState,
                                            action: Action) {

    /* Local variables. */
    let newState: PermissionsState;
    let adminPermissions: {
        [key: number]: AdminPermissonDetail,
    };
    let transPermissions: {
        [key: number]: TransPermissonDetail,
    };
    let menuPermissions: {
        [key: number]: MenuPermissonDetail,
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
    case PermissionsActions.SET_ADMIN_PERMISSIONS:
        /* Pull the data from the message body. */
        newEntityPermissions = _.get(action, 'payload[1].Data', []);

        /* Now tidy the data up. */
        newEntityPermissions = sortPermissionsArray(newEntityPermissions);

        /* Assign the new permissions with the old ones. */
        if (Object.keys(newEntityPermissions).length) {
            adminPermissions = Object.assign({}, state.adminPermissions, newEntityPermissions);
        } else {
            adminPermissions = {};
        }

        /* Generate the new state. */
        newState = Object.assign({}, state, {
            adminPermissions,
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
    case PermissionsActions.SET_TX_PERMISSIONS:
        /* Pull the data from the message body. */
        newEntityPermissions = _.get(action, 'payload[1].Data', []);

        /* Now tidy the data up. */
        newEntityPermissions = sortPermissionsArray(newEntityPermissions);

        /* Assign the new permissions with the old ones. */
        if (Object.keys(newEntityPermissions).length) {
            transPermissions = Object.assign({}, state.transPermissions, newEntityPermissions);
        } else {
            transPermissions = {};
        }

        /* Generate the new state. */
        newState = Object.assign({}, state, {
            transPermissions,
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
    case PermissionsActions.SET_MENU_PERMISSIONS:

        /* Pull the data from the message body. */
        newEntityPermissions = _.get(action, 'payload[1].Data', []);

        /* Now tidy the data up. */
        newEntityPermissions = sortPermissionsArray(newEntityPermissions);

        /* Assign the new permissions with the old ones. */
        menuPermissions = Object.assign({}, state.menuPermissions, newEntityPermissions);

        /* Generate the new state. */
        newState = Object.assign({}, state, {
            menuPermissions,
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
    let i;
    const newStructure = {};

    /* Let's flatten the array into an object of permissions by permission ID. */
    for (i = 0; i < permissions.length; i += 1) {
        /* Handle the entity object not existing. */
        if (!newStructure[permissions[i].entityID]) newStructure[permissions[i].entityID] = {};

        /* Assign the permission by ID. */
        newStructure[permissions[i].entityID][permissions[i].permissionID] = permissions[i];
    }

    /* Return. */
    return newStructure;
}
