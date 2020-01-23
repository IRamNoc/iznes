import { name } from './__init__';
import { kAction } from '@setl/utils/common';

export const SET_REQUESTED_IZN_FUNDS = `${name}/SET_REQUESTED_IZN_FUNDS`;
export const setRequestedIznesFunds = kAction(SET_REQUESTED_IZN_FUNDS);
export const CLEAR_REQUESTED_IZN_FUNDS = `${name}/CLEAR_REQUESTED_IZN_FUNDS`;
export const clearRequestedIznesFunds = kAction(CLEAR_REQUESTED_IZN_FUNDS);
export const GET_IZN_FUND_LIST = `${name}/GET_IZN_FUND_LIST`;

export const SET_FUND_AUDIT = `${name}/SET_FUND_AUDIT`;
