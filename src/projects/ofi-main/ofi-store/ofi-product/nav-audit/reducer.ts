import {Action} from 'redux';
import * as _ from 'lodash';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {NavAuditDetail, OfiNavAuditState} from './model';
import {OrderedMap} from 'immutable';

const initialState: OfiNavAuditState = {
    navAudit: {},
    requestedNavAudit: false
};

/**
 *  Ofi fund share reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiNavAuditReducer = function (state: OfiNavAuditState = initialState, action: Action): OfiNavAuditState {
    switch (action.type) {
        case actions.SET_NAV_AUDIT:
            return handleSetOfiNavAudit(state, action);

        case actions.SET_REQUESTED_NAV_AUDIT:
            return toggleNavAuditRequested(state, true);

        case actions.CLEAR_REQUESTED_NAV_AUDIT:
            return toggleNavAuditRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set fund share audit
 *
 * @param state
 * @param action
 * @return {OfiNAVAuditState}
 */
function handleSetOfiNavAudit(state: OfiNavAuditState, action: Action): OfiNavAuditState {
    const navAuditData = _.get(action, 'payload[1].Data', []);
    let navAudit: { [key: number]: NavAuditDetail[] } = {};
    try {
        if(navAuditData[0]) {
            const fundShareId = navAuditData[0].fundShareID;

            navAudit[fundShareId] = navAuditData;
        } else {
            navAudit = null;
        }
    } catch (e) {
        navAudit = null;
    }

    return Object.assign({}, state, {
        navAudit
    });
}

/**
 * Toggle requested
 * @param state
 * @return {OfiFundShareState}
 */
function toggleNavAuditRequested(state: OfiNavAuditState, requestedNavAudit): OfiNavAuditState {
    return Object.assign({}, state, {
        requestedNavAudit
    });
}
