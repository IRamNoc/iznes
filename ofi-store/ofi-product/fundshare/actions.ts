import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_AM_All_FUND_SHARE = `${name}/SET_REQUESTED_AM_All_FUND_SHARE`;
export const setRequestedAmAllFundShare = kAction(SET_REQUESTED_AM_All_FUND_SHARE);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_AM_All_FUND_SHARE = `${name}/CLEAR_REQUESTED_AM_All_FUND_SHARE`;
export const clearRequestedAmAllFundShare = kAction(CLEAR_REQUESTED_AM_All_FUND_SHARE);

/**
 *  Set am all fund share list
 */
export const SET_AM_ALL_FUND_SHARE_LIST = `${name}/SET_AM_ALL_FUND_SHARE_LIST`;


