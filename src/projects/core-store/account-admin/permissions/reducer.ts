import {
    SET_ACCOUNT_ADMIN_PERMISSION_AREAS,
    SET_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS,
    CLEAR_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS,
} from './actions';
import { PermissionAreasState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: PermissionAreasState = {
    permissionAreas: [],
    requested: false,
};

export const permissionAreasReducer = function (state: PermissionAreasState = initialState,
                                                action: Action) {
    let newState: PermissionAreasState;

    switch (action.type) {
    case SET_ACCOUNT_ADMIN_PERMISSION_AREAS:
        const permissionAreas = _.get(action, 'payload[1].Data', []);

        newState = Object.assign({}, state, {
            permissionAreas,
        });

        return newState;

    case SET_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS:
        return toggleAccountAdminPermissionAreasRequested(state, true);

    case CLEAR_REQUESTED_ACCOUNT_ADMIN_PERMISSION_AREAS:
        return toggleAccountAdminPermissionAreasRequested(state, false);

    default:
        return state;
    }
};

/**
 * Toggle requested
 * @param state
 * @param requested
 * @return {PermissionAreasState}
 */
function toggleAccountAdminPermissionAreasRequested(state: PermissionAreasState,
                                                    requested: boolean): PermissionAreasState {
    return Object.assign({}, state, {
        requested,
    });
}
