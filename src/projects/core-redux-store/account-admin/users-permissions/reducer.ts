import {
    SET_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
    SET_REQUESTED_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
} from './actions';
import { UserPermissionAreasState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: UserPermissionAreasState = {
    permissionAreas: [],
    requested: false,
};

export const userPermissionAreasReducer = function (state: UserPermissionAreasState = initialState,
                                                    action: Action) {
    let newState: UserPermissionAreasState;

    switch (action.type) {
    case SET_ACCOUNT_ADMIN_USER_PERMISSION_AREAS:
        const permissionAreas = _.get(action, 'payload[1].Data', []);

        newState = Object.assign({}, state, {
            permissionAreas,
        });

        return newState;

    case SET_REQUESTED_ACCOUNT_ADMIN_USER_PERMISSION_AREAS:
        return toggleAccountAdminUserPermissionAreasRequested(state, true);

    case CLEAR_REQUESTED_ACCOUNT_ADMIN_USER_PERMISSION_AREAS:
        return toggleAccountAdminUserPermissionAreasRequested(state, false);

    default:
        return state;
    }
};

/**
 * Toggle requested
 * @param state
 * @param requested
 * @return {UserPermissionAreasState}
 */
function toggleAccountAdminUserPermissionAreasRequested(state: UserPermissionAreasState,
                                                        requested: boolean): UserPermissionAreasState {
    return Object.assign({}, state, {
        requested,
    });
}
