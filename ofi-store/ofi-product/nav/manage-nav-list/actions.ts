import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';
import {CurrentRequest} from './model';

/**
 *  Set manage nav list
 */
export const SET_MANAGE_NAV_LIST = `${name}/SET_MANAGE_NAV_LIST`;

/**
 * Set (Set to true) request manage nav list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_MANAGE_NAV_LIST = `${name}/SET_REQUESTED_MANAGE_NAV_LIST`;
export const setRequestedManageNavList = kAction(SET_REQUESTED_MANAGE_NAV_LIST);

/**
 * Clear (set to false) request manage nav list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_MANAGE_NAV_LIST = `${name}/CLEAR_REQUESTED_MANAGE_NAV_LIST`;
export const clearRequestedManageNavList = kAction(CLEAR_REQUESTED_MANAGE_NAV_LIST);

/**
 *
 */
export const OFI_SET_CURRENT_MANAGE_NAV_REQUEST = `${name}/OFI_SET_CURRENT_MANAGE_NAV_REQUEST`;
interface OfiSetCurrentManageNavRequest extends Action {
    currentRequest: CurrentRequest;
}
export const ofiSetCurrentManageNavRequest: ActionCreator<OfiSetCurrentManageNavRequest> = (currentRequest) => ({
    type: OFI_SET_CURRENT_MANAGE_NAV_REQUEST,
    currentRequest
});

