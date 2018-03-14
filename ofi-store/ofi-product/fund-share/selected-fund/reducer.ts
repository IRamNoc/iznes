import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {OfiFundShareSelectedFundState, OfiFundShareSelectedFund, CurrentRequest} from './model';

const initialState: OfiFundShareSelectedFundState = {
    fundShareSelectedFund: {},
    requestedFundShareSelectedFund: false,
    currentRequest: {}
};

/**
 *  Ofi fund share reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundShareSelectedFundReducer = function (state: OfiFundShareSelectedFundState = initialState, action: Action): OfiFundShareSelectedFundState {
    switch (action.type) {
        case actions.SET_FUND_SHARE_SELECTED_FUND:
            return handleSetOfiFundShareSelectedFund(state, action);

        case actions.SET_REQUESTED_FUND_SHARE_SELECTED_FUND:
            return toggleFundShareSelectedFundRequested(state, true);

        case actions.CLEAR_REQUESTED_FUND_SHARE_SELECTED_FUND:
            return toggleFundShareSelectedFundRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle selected fund state
 *
 * @param state
 * @param action
 * @return {OfiFundShareSelectedFundState}
 */
function handleSetOfiFundShareSelectedFund(state: OfiFundShareSelectedFundState, action: Action): OfiFundShareSelectedFundState {
    const fundShareSelectedFundData = _.get(action, 'payload[1].Data', []);
    let fundShareSelectedFund: { [shareId: string]: OfiFundShareSelectedFund } = {};
    try {
        fundShareSelectedFund = immutableHelper.reduce(fundShareSelectedFundData, (result: { [shareId: string]: any }, item) => {
            

            return result;
        }, {});
    } catch (e) {
        fundShareSelectedFund = {};
    }

    return Object.assign({}, state, {
        fundShareSelectedFund
    });
}

/**
 * Toggle requested
 * @param state
 * @return {OfiFundShareSelectedFundState}
 */
function toggleFundShareSelectedFundRequested(state: OfiFundShareSelectedFundState, requestedFundShareSelectedFund): OfiFundShareSelectedFundState {
    return Object.assign({}, state, {
        requestedFundShareSelectedFund
    });
}

/**
 * Handle set requested
 * @param state
 * @param action
 * @return {{}&OfiFundShareSelectedFundState&{currentRequest: CurrentRequest, requested: boolean}}
 */
function handleSetCurrentRequest(state: OfiFundShareSelectedFundState, action: Action): OfiFundShareSelectedFundState {
    const currentRequest: CurrentRequest = _.get(action, 'currentRequest');

    return Object.assign({}, state, {
        currentRequest
    });
}