import { name } from './__init__';
import { kAction } from '@setl/utils/common';

export const SET_ENCUMBRANCES = `${name}/SET_ENCUMBRANCES`;
export const SET_REQUESTED_ENCUMBRANCES = `${name}/SET_REQUESTED_ENCUMBRANCES`;
export const setRequestedEncumbrances = kAction(SET_REQUESTED_ENCUMBRANCES);
export const CLEAR_REQUESTED_ENCUMBRANCES = `${name}/CLEAR_REQUESTED_ENCUMBRANCES`;
export const clearRequestedEncumbrances = kAction(CLEAR_REQUESTED_ENCUMBRANCES);
