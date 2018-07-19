import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Action, ActionCreator} from 'redux';

// shares list details results
export const SET_PRECENTRA_SHARES_DETAILS_LIST = `${name}/SET_PRECENTRA_SHARES_DETAILS_LIST`;

// shares list ng-select
export const SET_PRECENTRA_SHARES_LIST = `${name}/SET_PRECENTRA_SHARES_LIST`;

export const SET_REQUESTED_PRECENTRA_SHARES_LIST = `${name}/SET_REQUESTED_PRECENTRA_SHARES_LIST`;
export const setRequestedPrecentraSharesList = kAction(SET_REQUESTED_PRECENTRA_SHARES_LIST);

export const CLEAR_REQUESTED_PRECENTRA_SHARES_LIST = `${name}/CLEAR_REQUESTED_PRECENTRA_SHARES_LIST`;
export const clearRequestedPrecentraSharesList = kAction(CLEAR_REQUESTED_PRECENTRA_SHARES_LIST);