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

            const navDetail = {
                shareId: item.get('shareId', 0),
                fundId: item.get('fundId', 0),
                fundShareName: item.get('fundShareName', ''),
                isin: item.get('isin', 0),
                currency: item.get('shareClassCurrency', ''),
                nav: null,
                navDate: item.get('navDate', ''),
                navPubDate: item.get('navPublicationDate', ''),
                status: item.get('navStatus', 0),
                asm: item.get('asm', ''),
                shareAum: item.get('shareAum', ''),
                numberOfShares: item.get('numberOfShares', ''),
            };

            switch (item.get('navStatus')) {
                case -1:
                    navDetail['nav'] = item.get('priceValidated');
                    break;
                case 1:
                    navDetail['nav'] = item.get('priceEstimated');
                    break;
                case 2:
                    navDetail['nav'] = item.get('priceTechnical');
                    break;
            }

            result.push(navDetail);
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




