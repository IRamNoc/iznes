import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';
import {CurrentRequest} from './model';

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_FUND_SHARE_SELECTED_FUND = `${name}/SET_REQUESTED_FUND_SHARE_SELECTED_FUND`;
export const setRequestedFundShareSelectedFund = kAction(SET_REQUESTED_FUND_SHARE_SELECTED_FUND);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_FUND_SHARE_SELECTED_FUND = `${name}/CLEAR_REQUESTED_FUND_SHARE_SELECTED_FUND`;
export const clearRequestedFundShareSelectedFund = kAction(CLEAR_REQUESTED_FUND_SHARE_SELECTED_FUND);

export const SET_FUND_SHARE_SELECTED_FUND = `${name}/SET_FUND_SHARE_SELECTED_FUND`;
/**
 * Set request
 */
export const OFI_SET_CURRENT_FUND_SHARE_SELECTED_FUND = `${name}/OFI_SET_CURRENT_FUND_SHARE_SELECTED_FUND`;

interface OfiSetCurrentFundShareSelectedFundRequest extends Action {
    currentRequest: CurrentRequest;
}

export const ofiSetCurrentFundShareSelectedFundRequest: ActionCreator<OfiSetCurrentFundShareSelectedFundRequest> = (currentRequest) => ({
    type: OFI_SET_CURRENT_FUND_SHARE_SELECTED_FUND,
    currentRequest
});