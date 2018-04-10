import {name} from './__init__';
// import {KycMyInformations} from './model';
import {Action} from 'redux';
import {kAction} from '@setl/utils/common';

export const SET_AMKYCLIST = `${name}/SET_AMKYCLIST`;
export const setamkyclist = kAction(SET_AMKYCLIST);

export const SET_REQUESTED = `${name}/SET_REQUESTED`;
export const setrequested = kAction(SET_REQUESTED);

export const CLEAR_REQUESTED = `${name}/CLEAR_REQUESTED`;
export const clearrequested = kAction(CLEAR_REQUESTED);

