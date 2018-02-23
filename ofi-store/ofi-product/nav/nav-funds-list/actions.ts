import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';
import {CurrentRequest} from './model';

/**
 *  Set nav fund list
 */
export const SET_NAV_FUNDS_LIST = `${name}/SET_NAV_FUNDS_LIST`;

/**
 * Set (Set to true) request nav funds list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_NAV_FUNDS_LIST = `${name}/SET_REQUESTED_NAV_FUNDS_LIST`;
export const setRequestedNavFundsList = kAction(SET_REQUESTED_NAV_FUNDS_LIST);

/**
 * Clear (set to false) request manage nav list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_NAV_FUNDS_LIST = `${name}/CLEAR_REQUESTED_NAV_FUNDS_LIST`;
export const clearRequestedNavFundsList = kAction(CLEAR_REQUESTED_NAV_FUNDS_LIST);

/**
 *
 */
export const OFI_SET_CURRENT_NAV_FUNDS_LIST = `${name}/OFI_SET_CURRENT_NAV_FUNDS_LIST`;

interface OfiSetCurrentNavFundsListRequest extends Action {
    currentRequest: CurrentRequest;
}

export const ofiSetCurrentNavFundsListRequest: ActionCreator<OfiSetCurrentNavFundsListRequest> = (currentRequest) => ({
    type: OFI_SET_CURRENT_NAV_FUNDS_LIST,
    currentRequest
});