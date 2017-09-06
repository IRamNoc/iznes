import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 *  Set manage member list
 */
export const SET_MANAGE_MEMBER_LIST = `${name}/SET_MANAGE_MEMBER_LIST`;

/**
 * Set (Set to true) request manage member list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_MANAGE_MEMBER_LIST = `${name}/SET_REQUESTED_MANAGE_MEMBER_LIST `;
export const setRequestedManageMemberList = kAction(SET_REQUESTED_MANAGE_MEMBER_LIST);


/**
 * Clear (set to false) request manage member list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_MANAGE_MEMBER_LIST = `${name}/CLEAR_REQUESTED_MANAGE_MEMBER_LIST `;
export const clearRequestedManageMemberList = kAction(CLEAR_REQUESTED_MANAGE_MEMBER_LIST);

