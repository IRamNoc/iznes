import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';
import {CurrentRequest} from './model';

/**
 *  Set nav latest
 */
export const SET_NAV_LATEST = `${name}/SET_NAV_LATEST`;

/**
 * Set (Set to true) request nav latest state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_NAV_LATEST = `${name}/SET_REQUESTED_NAV_LATEST`;
export const setRequestedNavLatest = kAction(SET_REQUESTED_NAV_LATEST);

/**
 * Clear (set to false) request latest state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_NAV_LATEST = `${name}/CLEAR_REQUESTED_NAV_LATEST`;
export const clearRequestedNavLatest = kAction(CLEAR_REQUESTED_NAV_LATEST);

/**
 *
 */
export const OFI_SET_CURRENT_NAV_LATEST = `${name}/OFI_SET_CURRENT_NAV_LATEST`;

interface OfiSetCurrentNavLatestRequest extends Action {
    currentRequest: CurrentRequest;
}

export const ofiSetCurrentNavLatestRequest: ActionCreator<OfiSetCurrentNavLatestRequest> = (currentRequest) => ({
    type: OFI_SET_CURRENT_NAV_LATEST,
    currentRequest
});