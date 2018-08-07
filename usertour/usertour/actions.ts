import {name} from './__init__';
import {kAction} from '@setl/utils/common';

export const SET_USER_TOURS = `${name}/SET_USER_TOURS`;

export const SET_USER_TOURS_REQUESTED = `${name}/SET_USER_TOURS_REQUESTED`;
export const setUserToursRequested = kAction(SET_USER_TOURS_REQUESTED);

export const CLEAR_USER_TOURS_REQUESTED = `${name}/CLEAR_USER_TOURS_REQUESTED`;
export const clearUserToursRequested = kAction(CLEAR_USER_TOURS_REQUESTED);