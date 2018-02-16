import {CurrentRequest, OfiNavFundViewState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import {
    SET_NAV_FUND_VIEW,
    OFI_SET_CURRENT_NAV_FUND_VIEW,
    CLEAR_REQUESTED_NAV_FUND_VIEW,
    SET_REQUESTED_NAV_FUND_VIEW
} from './actions';

import {NavDetail} from './model';

const initialState: OfiNavFundViewState = {
    navFundView: null,
    currentRequest: {
        fundName: '',
        navDateField: '',
        navDate: ''
    },
    requested: true
};

/**
 *  Ofi manage nav view reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiNavFundViewReducer = function (state: OfiNavFundViewState = initialState, action: Action): OfiNavFundViewState {
    switch (action.type) {
        case SET_NAV_FUND_VIEW:
            return handleSetOfiNavFundView(state, action);

        case OFI_SET_CURRENT_NAV_FUND_VIEW:
            return handleSetCurrentRequest(state, action);

        case SET_REQUESTED_NAV_FUND_VIEW:
            return toggleRequested(state, true);

        case CLEAR_REQUESTED_NAV_FUND_VIEW:
            return toggleRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set manage nav view
 *
 * @param state
 * @param action
 * @return {OfiNavFundViewState}
 */
function handleSetOfiNavFundView(state: OfiNavFundViewState, action: Action): OfiNavFundViewState {
    const navFundViewData = _.get(action, 'payload[1].Data', []);
    let navFundView: NavDetail[] = [];
    try {
        navFundView = immutableHelper.reduce(navFundViewData, (result: NavDetail[], item) => {
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
        navFundView = [];
    }

    return Object.assign({}, state, {
        navFundView
    });
}

/**
 * Handle set requested
 * @param state
 * @param action
 * @return {{}&OfiNavFundViewState&{currentRequest: CurrentRequest, requested: boolean}}
 */
function handleSetCurrentRequest(state: OfiNavFundViewState, action: Action): OfiNavFundViewState {
    const currentRequest: CurrentRequest = _.get(action, 'currentRequest');

    return Object.assign({}, state, {
        currentRequest
    });
}

/**
 * Toggle requested
 * @param state
 * @return {{}&OfiNavFundViewState&{requested: boolean}}
 */
function toggleRequested(state: OfiNavFundViewState, requested): OfiNavFundViewState {

    return Object.assign({}, state, {
        requested
    });
}




