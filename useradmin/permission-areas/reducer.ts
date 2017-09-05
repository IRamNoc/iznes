/* Core Imports. */
import {Action} from 'redux';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

/* Actions. */
import * as adminPermAreasActions from './actions';

/* Models. */
import {
    PermAreasState,
    AdminPermAreaDetail,
    TxPermAreaDetail
} from './model';

const initialState: PermAreasState = {
    adminPermAreaList: {},
    txPermAreaList: {}
};

export const PermAreasReducer = function (state: PermAreasState = initialState,
                                                action: Action) {

    /* Local stuff. */
    let newState: PermAreasState;
    let adminPermAreaList: {
        [key: number]: AdminPermAreaDetail
    };
    let txPermAreaList: {
        [key: number]: AdminPermAreaDetail
    };

    switch (action.type) {
        case adminPermAreasActions.SET_ADMIN_PERM_AREAS_LIST:
            /* Get the array from the payload. */
            adminPermAreaList = _.get(action, 'payload[1].Data', []);

            /* Let's assign it to the higher state. */
            newState = Object.assign({}, state, {
                adminPermAreaList
            });

            /* Return the newly assigned state. */
            return newState;

        case adminPermAreasActions.SET_TX_PERM_AREAS_LIST:
            /* Get the array from the payload. */
            txPermAreaList = _.get(action, 'payload[1].Data', []);

            /* Let's assign it to the higher state. */
            newState = Object.assign({}, state, {
                txPermAreaList
            });

            /* Return the newly assigned state. */
            return newState;

        default:
            return state;
    }
};
