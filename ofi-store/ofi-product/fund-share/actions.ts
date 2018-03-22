import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';
import {CurrentRequest} from './model';

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_FUND_SHARE = `${name}/SET_REQUESTED_FUND_SHARE`;
export const setRequestedFundShare = kAction(SET_REQUESTED_FUND_SHARE);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_FUND_SHARE = `${name}/CLEAR_REQUESTED_FUND_SHARE`;
export const clearRequestedFundShare = kAction(CLEAR_REQUESTED_FUND_SHARE);

/**
 *  Set fund share
 */
export const SET_FUND_SHARE = `${name}/SET_FUND_SHARE`;

/**
 *  Update fund share
 */
export const UPDATE_FUND_SHARE = `${name}/UPDATE_FUND_SHARE`;

/**
 * Set request
 */
export const OFI_SET_CURRENT_FUND_SHARE = `${name}/OFI_SET_CURRENT_FUND_SHARE`;

interface OfiSetCurrentFundShareRequest extends Action {
    currentRequest: CurrentRequest;
}

export const ofiSetCurrentFundShareRequest: ActionCreator<OfiSetCurrentFundShareRequest> = (currentRequest) => ({
    type: OFI_SET_CURRENT_FUND_SHARE,
    currentRequest
});