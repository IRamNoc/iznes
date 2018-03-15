import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {OfiFundShareSelectedFundState} from './model';

const initialState: OfiFundShareSelectedFundState = {
    currentFundId: null
};

/**
 *  Ofi fund share selected fund reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundShareSelectedFundReducer = function (state: OfiFundShareSelectedFundState = initialState, action: Action): OfiFundShareSelectedFundState {
    switch (action.type) {
        case actions.OFI_SET_CURRENT_FUND_SHARE_SF:
            return handleSetFundShareSelectedFund(state, action);

        case actions.OFI_CLEAR_CURRENT_FUND_SHARE_SF:
            return handleClearFundShareSelectedFund(state, action);

        default:
            return state;
    }
};

/**
 * Handle set fund share selected fund
 *
 * @param state
 * @param action
 * @return {OfiFundShareState}
 */
function handleSetFundShareSelectedFund(state: OfiFundShareSelectedFundState, action: Action): OfiFundShareSelectedFundState {
    const currentFundId = _.get(action, 'currentFundId', null);

    return Object.assign({}, state, {
        currentFundId
    });
}

/**
 * Handle clear fund share selected fund
 *
 * @param state
 * @param action
 * @return {OfiFundShareState}
 */
function handleClearFundShareSelectedFund(state: OfiFundShareSelectedFundState, action: Action): OfiFundShareSelectedFundState {
    return Object.assign({}, state, {
        currentFundId: null
    });
}