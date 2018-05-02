import {Action} from 'redux';
import * as _ from 'lodash';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {FundShareAuditDetail, OfiFundShareAuditState} from './model';
import {OrderedMap} from 'immutable';

const initialState: OfiFundShareAuditState = {
    fundShareAudit: {},
    requestedFundShareAudit: false
};

/**
 *  Ofi fund share reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundShareAuditReducer = function (state: OfiFundShareAuditState = initialState, action: Action): OfiFundShareAuditState {
    switch (action.type) {
        case actions.SET_FUND_SHARE_AUDIT:
            return handleSetOfiFundShareAudit(state, action);

        case actions.SET_REQUESTED_FUND_SHARE_AUDIT:
            return toggleFundShareAuditRequested(state, true);

        case actions.CLEAR_REQUESTED_FUND_SHARE_AUDIT:
            return toggleFundShareAuditRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set fund share audit
 *
 * @param state
 * @param action
 * @return {OfiFundShareAuditState}
 */
function handleSetOfiFundShareAudit(state: OfiFundShareAuditState, action: Action): OfiFundShareAuditState {
    const fundShareAuditData = _.get(action, 'payload[1].Data', []);
    let fundShareAudit: { [key: number]: FundShareAuditDetail[] } = {};
    try {
        if(fundShareAuditData[0]) {
            const fundShareId = fundShareAuditData[0].fundShareID;

            fundShareAudit[fundShareId] = fundShareAuditData;
        } else {
            fundShareAudit = null;
        }
    } catch (e) {
        fundShareAudit = null;
    }

    return Object.assign({}, state, {
        fundShareAudit
    });
}

/**
 * Toggle requested
 * @param state
 * @return {OfiFundShareState}
 */
function toggleFundShareAuditRequested(state: OfiFundShareAuditState, requestedFundShareAudit): OfiFundShareAuditState {
    return Object.assign({}, state, {
        requestedFundShareAudit
    });
}
