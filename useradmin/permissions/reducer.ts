import {Action} from 'redux';
import * as PermissionsActions from './actions';
import {
    PermissionsState,
    AdminPermissonDetail,
    TransPermissonDetail
} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

import { getAdminPermissions, getTranPermissions } from '@setl/core-store'

const initialState: PermissionsState = {
    adminPermissions: {},
    transPermissions: {}
};

export const PermissionsReducer = function (state: PermissionsState = initialState,
                                                action: Action) {

    /* Local variables. */
    let newState: PermissionsState;
    let adminPermissions: {
        [key: number]: AdminPermissonDetail
    };
    let oldAdminPermissions:any;
    let transPermissions: {
        [key: number]: TransPermissonDetail
    };
    let oldTransPermissions:any;
    let newEntityPermissions:any;

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
            oldAdminPermissions = getAdminPermissions(state);

            console.log(" |--- Set Admin Permissions ");
            console.log(" | new data : ", newEntityPermissions);
            console.log(" | old state: ", oldAdminPermissions);

            /* Generate the new state. */
            newState = Object.assign({}, state, {
                adminPermissions
            });

            /* Return the new state. */
            return state;

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

            console.log(" |--- Set TX Permissions ");
            console.log(" | new data : ", newEntityPermissions);

            /* Generate the new state. */
            newState = Object.assign({}, state, {
                transPermissions
            });

            /* Return the new state. */
            return state;

        /**
        * Default
        * -------
        * Returns the original state.
        */
        default:
            return state;
    }
};
