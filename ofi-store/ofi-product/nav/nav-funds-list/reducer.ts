import { CurrentRequest, OfiNavFundsListState } from './model';
import { Action } from 'redux';
import * as _ from 'lodash';
import * as moment from 'moment';
import { fromJS } from 'immutable';
import { immutableHelper, NavHelperService } from '@setl/utils';
import { ValuationFrequencyEnum } from '../../../../ofi-product/fund-share/FundShareEnum';

import {
    SET_NAV_FUNDS_LIST,
    OFI_SET_CURRENT_NAV_FUNDS_LIST,
    CLEAR_REQUESTED_NAV_FUNDS_LIST,
    SET_REQUESTED_NAV_FUNDS_LIST
} from './actions';

import { NavDetail } from './model';

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
            // const metadata = JSON.parse(item.get('metadata', {}));
            const navDate = item.get('navDate', '');
            const navPubDate = item.get('navPublicationDate', '');
            const nextValuationDateRaw = item.get('valuationFrequency', '');
            const nextValuationDate = NavHelperService.getNextValuationDate(nextValuationDateRaw, navDate) || 'N/A';

            result.push({
                managementCompany: item.get('asm'),
                shareId: item.get('shareId', 0),
                fundId: item.get('fundId', 0),
                fundShareName: item.get('fundShareName', ''),
                isin: item.get('isin', 0),
                currency: item.get('shareClassCurrency', ''),
                nav: item.get('nav', 0),
                navEstimated: item.get('priceEstimated', 0),
                navTechnical: item.get('priceTechnical', 0),
                navValidated: item.get('priceValidated', 0),
                navDate: (navDate !== null) ? moment(navDate).format('YYYY-MM-DD') : 'N/A',
                navPubDate: (navPubDate !== null) ? moment(navPubDate).format('YYYY-MM-DD') : 'N/A',
                status: item.get('navStatus', 0),
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




