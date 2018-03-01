import {CurrentRequest, OfiNavFundsListState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import * as moment from 'moment';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import {
    SET_NAV_FUNDS_LIST,
    OFI_SET_CURRENT_NAV_FUNDS_LIST,
    CLEAR_REQUESTED_NAV_FUNDS_LIST,
    SET_REQUESTED_NAV_FUNDS_LIST
} from './actions';

import {NavDetail} from './model';

const initialState: OfiNavFundsListState = {
    navFundsList: [],
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
export const OfiNavFundsListReducer = function (state: OfiNavFundsListState = initialState, action: Action): OfiNavFundsListState {
    switch (action.type) {
        case SET_NAV_FUNDS_LIST:
            return handleSetOfiNavFundsList(state, action);

        case OFI_SET_CURRENT_NAV_FUNDS_LIST:
            return handleSetCurrentRequest(state, action);

        case SET_REQUESTED_NAV_FUNDS_LIST:
            return toggleRequested(state, true);

        case CLEAR_REQUESTED_NAV_FUNDS_LIST:
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
function handleSetOfiNavFundsList(state: OfiNavFundsListState, action: Action): OfiNavFundsListState {
    const navListData = _.get(action, 'payload[1].Data', []);
    let navFundsList: NavDetail[] = [];
    try {
        navFundsList = immutableHelper.reduce(navListData, (result: NavDetail[], item) => {
            const metadata = JSON.parse(item.get('metadata', {}));
            const currency = metadata.shareCurrency[0].id;
            const navDate = item.get('navDate', '');
            const nextValuationDateRaw = metadata.valuationFrequency[0].id;
            const nextValuationDate = getNextValuationDate(nextValuationDateRaw, navDate);

            result.push({
                shareId: item.get('shareId', 0),
                fundId: item.get('fundId', 0),
                fundShareName: item.get('fundShareName', ''),
                isin: item.get('isin', 0),
                currency: currency,
                nav: item.get('nav', 0),
                navDate: moment(navDate).format('YYYY-MM-DD'),
                status: item.get('status', 0),
                nextValuationDate: nextValuationDate
            });
            return result;
        }, []);
    } catch (e) {
        navFundsList = [];
    }

    return Object.assign({}, state, {
        navFundsList
    });
}

function getNextValuationDate(nextValuationDateRaw: string, navDate: string): string {
    let nextValuationDate;
    const date = moment(navDate);

    switch (nextValuationDateRaw) {
        case 'Daily':
            nextValuationDate = date.add(1, 'days');
            break;
        case 'Weekly':
            nextValuationDate = date.add(1, 'weeks');
            break;
        case 'Monthly':
            nextValuationDate = date.add(1, 'months');
            break;
        case 'Quarterly':
            nextValuationDate = date.add(12, 'weeks');
            break;
        case 'Annually':
            nextValuationDate = date.add(1, 'years');
            break;
        default:
            nextValuationDate = 'N/A';
    }

    return nextValuationDate.format('YYYY-MM-DD');
}

/**
 * Handle set requested
 * @param state
 * @param action
 * @return {{}&OfiNavFundsListState&{currentRequest: CurrentRequest, requested: boolean}}
 */
function handleSetCurrentRequest(state: OfiNavFundsListState, action: Action): OfiNavFundsListState {
    const currentRequest: CurrentRequest = _.get(action, 'currentRequest');

    return Object.assign({}, state, {
        currentRequest
    });
}

/**
 * Toggle requested
 * @param state
 * @return {{}&OfiNavFundsListState&{requested: boolean}}
 */
function toggleRequested(state: OfiNavFundsListState, requested): OfiNavFundsListState {

    return Object.assign({}, state, {
        requested
    });
}




