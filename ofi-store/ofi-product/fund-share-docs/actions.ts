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
export const OFI_SET_CURRENT_FUND_SHARE_DOCS = `${name}/OFI_SET_CURRENT_FUND_SHARE_DOCS`;

interface OfiSetCurrentFundShareDocsRequest extends Action {
    currentRequest: CurrentRequest;
}

export const ofiSetCurrentFundShareDocsRequest: ActionCreator<OfiSetCurrentFundShareDocsRequest> = (currentRequest) => ({
    type: OFI_SET_CURRENT_FUND_SHARE_DOCS,
    currentRequest
});