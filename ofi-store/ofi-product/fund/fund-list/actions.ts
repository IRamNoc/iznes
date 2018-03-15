import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set Fund List
 * @type {string}
 */
export const SET_FUND_LIST = `${name}/SET_FUND_LIST`;

/**
 * Set Fund Share List
 * @type {string}
 */
export const SET_FUND_SHARE_LIST = `${name}/SET_FUND_SHARE_LIST`;

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_FUND = `${name}/SET_REQUESTED_FUND`;
export const setRequestedFund = kAction(SET_REQUESTED_FUND);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_FUND = `${name}/CLEAR_REQUESTED_FUND`;
export const clearRequestedFund = kAction(CLEAR_REQUESTED_FUND);

/* Iznes funds */
export const SET_REQUESTED_IZN_FUNDS = `${name}/SET_REQUESTED_IZN_FUNDS`;
export const setRequestedIznesFunds = kAction(SET_REQUESTED_IZN_FUNDS);
export const CLEAR_REQUESTED_IZN_FUNDS = `${name}/CLEAR_REQUESTED_IZN_FUNDS`;
export const clearRequestedIznesFunds = kAction(CLEAR_REQUESTED_IZN_FUNDS);
export const GET_IZN_FUND_LIST = `${name}/GET_IZN_FUND_LIST`;
