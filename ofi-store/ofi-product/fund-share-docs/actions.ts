import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';
import {CurrentRequest} from './model';

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_FUND_SHARE_DOCS = `${name}/SET_REQUESTED_FUND_SHARE_DOCS`;
export const setRequestedFundShareDocs = kAction(SET_REQUESTED_FUND_SHARE_DOCS);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_FUND_SHARE_DOCS = `${name}/CLEAR_REQUESTED_FUND_SHARE_DOCS`;
export const clearRequestedFundShareDocs = kAction(CLEAR_REQUESTED_FUND_SHARE_DOCS);

/**
 *  Set fund share
 */
export const SET_FUND_SHARE_DOCS = `${name}/SET_FUND_SHARE_DOCS`;

/**
 *  Update fund share
 */
export const UPDATE_FUND_SHARE_DOCS = `${name}/UPDATE_FUND_SHARE_DOCS`;

/**
 * Set request
 */
export const SET_CURRENT_FUND_SHARE_DOCS = `${name}/SET_CURRENT_FUND_SHARE_DOCS`;

export interface setCurrentFundShareDocsRequestAction extends Action {
    currentRequest: CurrentRequest;
}

export const setCurrentFundShareDocsRequest: ActionCreator<setCurrentFundShareDocsRequestAction> = id => ({
    type: SET_CURRENT_FUND_SHARE_DOCS,
    currentRequest: {
        fundShareID: id,
    },
});
