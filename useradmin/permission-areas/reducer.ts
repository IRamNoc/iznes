/* Core Imports. */
import {Action} from 'redux';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

/* Actions. */
import * as adminPermAreasActions from './actions';

/* Models. */
import {
    PermAreasState,
    AdminPermAreaDetail,
    TxPermAreaDetail,
    MenuPermAreaDetail
} from './model';

const initialState: PermAreasState = {
    adminPermAreaList: {},
    txPermAreaList: {},
    menuPermAreaList: {}
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
    let menuPermAreaList: {
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

        case adminPermAreasActions.SET_MENU_PERM_AREAS_LIST:
            /* Get the array from the payload. */
            menuPermAreaList = _.get(action, 'payload[1].Data', []);

            /* Let's assign it to the higher state. */
            newState = Object.assign({}, state, {
                menuPermAreaList
            });

            /* Return the newly assigned state. */
            return newState;

        default:
            return state;
    }
};
