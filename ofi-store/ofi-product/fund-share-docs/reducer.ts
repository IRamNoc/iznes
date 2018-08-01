import { Action } from 'redux';
import * as _ from 'lodash';
import { fromJS } from 'immutable';
import { immutableHelper } from '@setl/utils';

import * as actions from './actions';
import { setCurrentFundShareDocsRequestAction } from './actions';

import { OfiFundShareDocuments, OfiFundShareDocsState, CurrentRequest } from './model';

const initialState: OfiFundShareDocsState = {
    fundShareDocuments: {},
    requested: false,
    currentRequest: {},
};

/**
 *  Ofi fund share docs reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundShareDocsReducer = (
    state: OfiFundShareDocsState = initialState,
    action: Action,
): OfiFundShareDocsState => {
    switch (action.type) {
    case actions.SET_FUND_SHARE_DOCS:
        return handleSetOfiFundShareDocs(state, action);

    case actions.UPDATE_FUND_SHARE_DOCS:
        return handleSetOfiFundShareDocs(state, action);

    case actions.SET_REQUESTED_FUND_SHARE_DOCS:
        return toggleFundShareDocsRequested(state, true);

    case actions.CLEAR_REQUESTED_FUND_SHARE_DOCS:
        return toggleFundShareDocsRequested(state, false);

    case actions.SET_CURRENT_FUND_SHARE_DOCS:
        return setCurrentShareDocs(state, action as setCurrentFundShareDocsRequestAction);

    default:
        return state;
    }
};

/**
 * Handle set fund share
 *
 * @param state
 * @param action
 * @return {OfiFundShareState}
 */
function handleSetOfiFundShareDocs(state: OfiFundShareDocsState, action: Action): OfiFundShareDocsState {
    const fundShareDocsData = _.get(action, 'payload[1].Data', []);
    let fundShareDocuments: { [shareId: string]: OfiFundShareDocsState } = {};
    try {
        fundShareDocuments = immutableHelper.reduce(fundShareDocsData, (result: OfiFundShareDocuments, item) => {
            const shareId = item.get('fundShareID', 0);

            if (shareId === 0) {
                throw new Error('ShareId should not be zero');
            }

            result = {
                fundShareID: shareId,
                prospectus: item.get('prospectus', ''),
                kiid: item.get('kiid', ''),
                annualActivityReport: item.get('annualActivityReport', ''),
                semiAnnualSummary: item.get('semiAnnualSummary', ''),
                sharesAllocation: item.get('sharesAllocation', ''),
                sriPolicy: item.get('sriPolicy', ''),
                transparencyCode: item.get('transparencyCode', ''),
                businessLetter: item.get('businessLetter', ''),
                productSheet: item.get('productSheet', ''),
                monthlyFinancialReport: item.get('monthlyFinancialReport', ''),
                monthlyExtraFinancialReport: item.get('monthlyExtraFinancialReport', ''),
                quarterlyFinancialReport: item.get('quarterlyFinancialReport', ''),
                quarterlyExtraFinancialReport: item.get('quarterlyExtraFinancialReport', ''),
                letterToShareholders: item.get('letterToShareholders', ''),
                kid: item.get('kid', ''),
                statutoryAuditorsCertification: item.get('statutoryAuditorsCertification', ''),
                ept: item.get('ept', ''),
                emt: item.get('emt', ''),
                tpts2: item.get('tpts2', '')
            };

            return result;
        }, {});
    } catch (e) {
        fundShareDocuments = {};
    }

    return Object.assign({}, state, {
        fundShareDocuments
    });
}

/**
 * Toggle requested
 * @param state
 * @return {OfiFundShareDocsState}
 */
function toggleFundShareDocsRequested(state: OfiFundShareDocsState, requested): OfiFundShareDocsState {
    return {
        ...state,
        requested,
    };
}

/**
 * Handle set requested
 * @param state
 * @param action
 * @return {{}&OfiFundShareDocsState&{currentRequest: CurrentRequest, requested: boolean}}
 */
function handleSetCurrentRequest(state: OfiFundShareDocsState, action: Action): OfiFundShareDocsState {
    const currentRequest: CurrentRequest = _.get(action, 'currentRequest');

    return Object.assign({}, state, {
        currentRequest,
    });
}

function setCurrentShareDocs(
    state: OfiFundShareDocsState,
    action: setCurrentFundShareDocsRequestAction,
): OfiFundShareDocsState {
    return {
        ...state,
        currentRequest: action.currentRequest,
    };
}
