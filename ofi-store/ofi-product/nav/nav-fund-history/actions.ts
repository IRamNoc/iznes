import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';
import {CurrentRequest} from './model';

/**
 *  Set nav fund history
 */
export const SET_NAV_FUND_HISTORY = `${name}/SET_NAV_FUND_HISTORY`;

/**
 * Set (Set to true) request nav fund history state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_NAV_FUND_HISTORY = `${name}/SET_REQUESTED_NAV_FUND_HISTORY`;
export const setRequestedNavFundHistory = kAction(SET_REQUESTED_NAV_FUND_HISTORY);

/**
 * Clear (set to false) request manage nav history state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_NAV_FUND_HISTORY = `${name}/CLEAR_REQUESTED_NAV_FUND_HISTORY`;
export const clearRequestedNavFundHistory = kAction(CLEAR_REQUESTED_NAV_FUND_HISTORY);

/**
 *
 */
export const OFI_SET_CURRENT_NAV_FUND_HISTORY = `${name}/OFI_SET_CURRENT_NAV_FUND_HISTORY`;

interface OfiSetCurrentNavFundHistoryRequest extends Action {
    currentRequest: CurrentRequest;
}

export const ofiSetCurrentNavFundHistoryRequest: ActionCreator<OfiSetCurrentNavFundHistoryRequest> = (currentRequest) => ({
    type: OFI_SET_CURRENT_NAV_FUND_HISTORY,
    currentRequest
});