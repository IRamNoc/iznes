/* Core Imports. */
import {Action} from 'redux';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

/* Actions. */
import * as adminPermissionAreasActions from './actions';

/* Models. */
import {
    AdminPermAreaDetail,
    AdminPermAreasState
} from './model';

const initialState: AdminPermAreasState = {
    adminPermAreaList: {}
};

export const PermissionAreasReducer = function (state: AdminPermAreasState = initialState,
                                                action: Action) {

    /* Local stuff. */
    let newState: AdminPermAreasState;
    let adminPermAreaList: {
        [key: number]: AdminPermAreaDetail
    };

    switch (action.type) {
        case adminPermissionAreasActions.SET_ADMIN_PERMISSION_AREAS_LIST:
            /* Get the array from the payload. */
            adminPermAreaList = _.get(action, 'payload[1].Data', []);

            /* Let's assign it to the higher state. */
            newState = Object.assign({}, state, {
                adminPermAreaList
            });

            /* Return the newly assigned state. */
            return newState;

        default:
            return state;
    }
};
