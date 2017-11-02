import {OfiCollectiveArchiveState} from './model';
import {Action} from 'redux';
import _ from 'lodash';
import {fromJS} from 'immutable';

import {
    SET_COLLECTIVE_ARCHIVE,
    SET_REQUESTED_COLLECTIVE_ARCHIVE,
    CLEAR_REQUESTED_COLLECTIVE_ARCHIVE
} from './actions';

const initialState: OfiCollectiveArchiveState = {
    collectiveArchiveList: [],
    requested: false
};

/**
 *  Ofi collective archive reducer
 *
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiCollectiveArchiveReducer = function (state: OfiCollectiveArchiveState = initialState, action: Action): OfiCollectiveArchiveState {
    switch (action.type) {
        case SET_COLLECTIVE_ARCHIVE:
            return handleSetCollectiveArchive(state, action);

        case SET_REQUESTED_COLLECTIVE_ARCHIVE:
            return toggleRequested(state, true);

        case CLEAR_REQUESTED_COLLECTIVE_ARCHIVE:
            return toggleRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiCollectiveArchiveState}
 */
function handleSetCollectiveArchive(state: OfiCollectiveArchiveState, action: Action): OfiCollectiveArchiveState {
    const collectiveArchiveData = _.get(action, 'payload[1].Data', []);
    console.log(collectiveArchiveData);

    return state;
}

/**
 * Toggle the state of requested.
 *
 * @param state
 * @param requested
 * @return {{} & any & {requested: *}}
 */
function toggleRequested(state, requested) {
    return Object.assign({}, state, {requested});
}



