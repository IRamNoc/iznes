import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Action, ActionCreator} from 'redux';

// funds list details results
export const SET_CENTRA_FUNDS_DETAILS_LIST = `${name}/SET_CENTRA_FUNDS_DETAILS_LIST`;

// funds list ng-select
export const SET_CENTRA_FUNDS_LIST = `${name}/SET_CENTRA_FUNDS_LIST`;

export const SET_REQUESTED_CENTRA_FUNDS_LIST = `${name}/SET_REQUESTED_CENTRA_FUNDS_LIST`;
export const setRequestedCentraFundsList = kAction(SET_REQUESTED_CENTRA_FUNDS_LIST);

export const CLEAR_REQUESTED_CENTRA_FUNDS_LIST = `${name}/CLEAR_REQUESTED_CENTRA_FUNDS_LIST`;
export const clearRequestedCentraFundsList = kAction(CLEAR_REQUESTED_CENTRA_FUNDS_LIST);

// shares list details results
export const SET_CENTRA_SHARES_DETAILS_LIST = `${name}/SET_CENTRA_SHARES_DETAILS_LIST`;

// shares list ng-select
export const SET_CENTRA_SHARES_LIST = `${name}/SET_CENTRA_SHARES_LIST`;

export const SET_REQUESTED_CENTRA_SHARES_LIST = `${name}/SET_REQUESTED_CENTRA_SHARES_LIST`;
export const setRequestedCentraSharesList = kAction(SET_REQUESTED_CENTRA_SHARES_LIST);

export const CLEAR_REQUESTED_CENTRA_SHARES_LIST = `${name}/CLEAR_REQUESTED_CENTRA_SHARES_LIST`;
export const clearRequestedCentraSharesList = kAction(CLEAR_REQUESTED_CENTRA_SHARES_LIST);