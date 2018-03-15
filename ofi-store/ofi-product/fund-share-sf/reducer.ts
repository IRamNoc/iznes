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

        default:
            return state;
    }
};

/**
 * Handle set am all fund share list
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