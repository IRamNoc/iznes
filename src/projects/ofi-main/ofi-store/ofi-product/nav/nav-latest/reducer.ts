import {CurrentRequest, OfiNavLatestState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import {
    SET_NAV_LATEST,
    OFI_SET_CURRENT_NAV_LATEST,
    CLEAR_REQUESTED_NAV_LATEST,
    SET_REQUESTED_NAV_LATEST
} from './actions';

import {NavLatestDetail} from './model';

const initialState: OfiNavLatestState = {
    navLatest: [],
    currentRequest: {
        fundName: '',
        navDate: ''
    },
    requested: true
};

/**
 *  Ofi manage nav latest reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiNavLatestReducer = function (state: OfiNavLatestState = initialState, action: Action): OfiNavLatestState {
    switch (action.type) {
        case SET_NAV_LATEST:
            return handleSetOfiNavLatest(state, action);

        case OFI_SET_CURRENT_NAV_LATEST:
            return handleSetCurrentRequest(state, action);

        case SET_REQUESTED_NAV_LATEST:
            return toggleRequested(state, true);

        case CLEAR_REQUESTED_NAV_LATEST:
            return toggleRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set manage nav list
 *
 * @param state
 * @param action
 * @return {OfiNavFundsListState}
 */
function handleSetOfiNavLatest(state: OfiNavLatestState, action: Action): OfiNavLatestState {
    const navLatestData = _.get(action, 'payload[1].Data', []);
    let navLatest: NavLatestDetail[] = [];
    try {
        navLatest = immutableHelper.reduce(navLatestData, (result: NavLatestDetail[], item) => {
            result.push({
                nav: item.get('nav', 0),
                navDate: item.get('navDate', 0)
            });
            return result;
        }, []);
    } catch (e) {
        navLatest = [];
    }

    return Object.assign({}, state, {
        navLatest
    });
}

/**
 * Handle set requested
 * @param state
 * @param action
 * @return {{}&OfiNavLatestState&{currentRequest: CurrentRequest, requested: boolean}}
 */
function handleSetCurrentRequest(state: OfiNavLatestState, action: Action): OfiNavLatestState {
    const currentRequest: CurrentRequest = _.get(action, 'currentRequest');

    return Object.assign({}, state, {
        currentRequest
    });
}

/**
 * Toggle requested
 * @param state
 * @return {{}&OfiNavLatestState&{requested: boolean}}
 */
function toggleRequested(state: OfiNavLatestState, requested): OfiNavLatestState {
    return Object.assign({}, state, {
        requested
    });
}




