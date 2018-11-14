import {CurrentRequest, OfiNavFundHistoryState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import * as moment from 'moment';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import {
    SET_NAV_FUND_HISTORY,
    OFI_SET_CURRENT_NAV_FUND_HISTORY,
    CLEAR_REQUESTED_NAV_FUND_HISTORY,
    SET_REQUESTED_NAV_FUND_HISTORY
} from './actions';

import {NavFundHistoryItem} from './model';

const initialState: OfiNavFundHistoryState = {
    navFundHistory: [],
    currentRequest: {
        shareId: '',
        navDateFrom: '',
        navDateTo: ''
    },
    requested: false
};

/**
 *  Ofi manage nav history reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiNavFundHistoryReducer = function (state: OfiNavFundHistoryState = initialState, action: Action): OfiNavFundHistoryState {
    switch (action.type) {
        case SET_NAV_FUND_HISTORY:
            return handleSetOfiNavFundHistory(state, action);

        case OFI_SET_CURRENT_NAV_FUND_HISTORY:
            return handleSetCurrentRequest(state, action);

        case SET_REQUESTED_NAV_FUND_HISTORY:
            return toggleRequested(state, true);

        case CLEAR_REQUESTED_NAV_FUND_HISTORY:
            return toggleRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set manage nav history
 *
 * @param state
 * @param action
 * @return {OfiNavFundHistoryState}
 */
function handleSetOfiNavFundHistory(state: OfiNavFundHistoryState, action: Action): OfiNavFundHistoryState {
    const navFundHistoryData = _.get(action, 'payload[1].Data', []);
    let navFundHistory: NavFundHistoryItem[] = [];
    try {
        navFundHistory = immutableHelper.reduce(navFundHistoryData, (result: NavFundHistoryItem[], item) => {

            const navDate = item.get('navDate', '');
            const navPubDate = item.get('navPublicationDate', '');

            result.push({
                shareId: item.get('shareId', 0),
                currency: item.get('shareClassCurrency', ''),
                nav: item.get('nav', 0),
                navDate: (navDate !== null) ? moment(navDate).format('YYYY-MM-DD') : 'N/A',
                navPubDate: (navPubDate !== null) ? moment(navPubDate).format('YYYY-MM-DD') : 'N/A',
                status: item.get('navStatus', 0),
                navUsed: (item.get('navUsed',0) > 0 ? 1 : 0),
            });
            return result;
        }, []);
    } catch (e) {
        navFundHistory = [];
    }

    return Object.assign({}, state, {
        navFundHistory
    });
}

/**
 * Handle set requested
 * @param state
 * @param action
 * @return {{}&OfiNavFundHistoryState&{currentRequest: CurrentRequest, requested: boolean}}
 */
function handleSetCurrentRequest(state: OfiNavFundHistoryState, action: Action): OfiNavFundHistoryState {
    const currentRequest: CurrentRequest = _.get(action, 'currentRequest');

    return Object.assign({}, state, {
        currentRequest
    });
}

/**
 * Toggle requested
 * @param state
 * @return {{}&OfiNavFundHistoryState&{requested: boolean}}
 */
function toggleRequested(state: OfiNavFundHistoryState, requested): OfiNavFundHistoryState {

    return Object.assign({}, state, {
        requested
    });
}




