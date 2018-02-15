import {CurrentRequest, OfiManageNavListState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import {
    SET_MANAGE_NAV_LIST,
    OFI_SET_CURRENT_MANAGE_NAV_REQUEST,
    CLEAR_REQUESTED_MANAGE_NAV_LIST,
    SET_REQUESTED_MANAGE_NAV_LIST
} from './actions';

import {NavDetail} from './model';

const initialState: OfiManageNavListState = {
    navList: [],
    currentRequest: {
        fundName: '',
        navDateField: '',
        navDate: ''
    },
    requested: true
};

/**
 *  Ofi manage nav list reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiManageNavListReducer = function (state: OfiManageNavListState = initialState, action: Action): OfiManageNavListState {
    switch (action.type) {
        case SET_MANAGE_NAV_LIST:
            return handleSetManageNavList(state, action);

        case OFI_SET_CURRENT_MANAGE_NAV_REQUEST:
            return handleSetCurrentRequest(state, action);

        case SET_REQUESTED_MANAGE_NAV_LIST:
            return toggleRequested(state, true);

        case CLEAR_REQUESTED_MANAGE_NAV_LIST:
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
 * @return {OfiManageNavListState}
 */
function handleSetManageNavList(state: OfiManageNavListState, action: Action): OfiManageNavListState {
    const navListData = _.get(action, 'payload[1].Data', []);
    let navList: NavDetail[] = [];
    try {
        navList = immutableHelper.reduce(navListData, (result: NavDetail[], item) => {
            const metadata = JSON.parse(item.get('metadata', {}));
            const currency = metadata.shareCurrency[0].id;

            result.push({
                shareId: item.get('shareId', 0),
                fundId: item.get('fundId', 0),
                fundShareName: item.get('fundShareName', ''),
                isin: item.get('isin', 0),
                currency: currency,
                nav: item.get('nav', 0),
                navDate: item.get('navDate', ''),
                status: item.get('status', 0)
            });
            return result;
        }, []);
    } catch (e) {
        navList = [];
    }

    return Object.assign({}, state, {
        navList
    });
}

/**
 * Handle set requested
 * @param state
 * @param action
 * @return {{}&OfiManageNavListState&{currentRequest: CurrentRequest, requested: boolean}}
 */
function handleSetCurrentRequest(state: OfiManageNavListState, action: Action): OfiManageNavListState {
    const currentRequest: CurrentRequest = _.get(action, 'currentRequest');

    return Object.assign({}, state, {
        currentRequest
    });
}

/**
 * Toggle requested
 * @param state
 * @return {{}&OfiManageNavListState&{requested: boolean}}
 */
function toggleRequested(state: OfiManageNavListState, requested): OfiManageNavListState {

    return Object.assign({}, state, {
        requested
    });
}




