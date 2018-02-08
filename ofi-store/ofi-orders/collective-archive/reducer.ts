import {OfiCollectiveArchiveState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper, mDateHelper} from '@setl/utils';

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

    const collectiveArchiveList = immutableHelper.reduce(collectiveArchiveData, (result, item) => {
        const cutoffDate = item.get('cutoffDate', '');
        const cutoffDateNumber = mDateHelper.dateStrToUnixTimestamp(cutoffDate, 'YYYY-MM-DD HH:mm:ss');

        result.push({
            subscriptionTotal: item.get('subscriptionTotal', 0),
            subscriptionQuantity: item.get('subscriptionQuantity', 0),
            redemptionTotal: item.get('redemptionTotal', 0),
            redemptionQuantity: item.get('redemptionQuantity', 0),
            cutoffDate,
            cutoffDateNumber,
            asset: item.get('asset', ''),
            price: item.get('price', 0)
        });
        return result;
    }, []);

    return Object.assign({}, state, {
        collectiveArchiveList
    });
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



