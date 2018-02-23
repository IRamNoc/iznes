import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';
import {CurrentRequest} from './model';

/**
 *  Set nav fund view
 */
export const SET_NAV_FUND_VIEW = `${name}/SET_NAV_FUND_VIEW`;

/**
 * Set (Set to true) request nav funds view state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_NAV_FUND_VIEW = `${name}/SET_REQUESTED_NAV_FUND_VIEW`;
export const setRequestedNavFundView = kAction(SET_REQUESTED_NAV_FUND_VIEW);

/**
 * Clear (set to false) request nav view state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_NAV_FUND_VIEW = `${name}/CLEAR_REQUESTED_NAV_FUND_VIEW`;
export const clearRequestedNavFundView = kAction(CLEAR_REQUESTED_NAV_FUND_VIEW);

/**
 *
 */
export const OFI_SET_CURRENT_NAV_FUND_VIEW = `${name}/OFI_SET_CURRENT_NAV_FUND_VIEW`;

interface OfiSetCurrentNavFundViewRequest extends Action {
    currentRequest: CurrentRequest;
}

export const ofiSetCurrentNavFundViewRequest: ActionCreator<OfiSetCurrentNavFundViewRequest> = (currentRequest) => ({
    type: OFI_SET_CURRENT_NAV_FUND_VIEW,
    currentRequest
});