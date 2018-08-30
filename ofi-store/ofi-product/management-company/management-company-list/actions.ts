import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Common, SagaHelper} from '@setl/utils';

/**
 * Set Management Company
 * @type {string}
 */
export const SET_MANAGEMENT_COMPANY_LIST = `${name}/SET_MANAGEMENT_COMPANY_LIST`;

export const SET_INV_MANAGEMENT_COMPANY_LIST = `${name}/SET_INV_MANAGEMENT_COMPANY_LIST`;

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_MANAGEMENT_COMPANY = `${name}/SET_REQUESTED_MANAGEMENT_COMPANY`;
export const setRequestedManagementCompany = kAction(SET_REQUESTED_MANAGEMENT_COMPANY);

export const SET_REQUESTED_INV_MANAGEMENT_COMPANY = `${name}/SET_REQUESTED_INV_MANAGEMENT_COMPANY`;
export const setRequestedInvestorManagementCompany = kAction(SET_REQUESTED_INV_MANAGEMENT_COMPANY);


/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_MANAGEMENT_COMPANY = `${name}/CLEAR_REQUESTED_MANAGEMENT_COMPANY`;
export const clearRequestedManagementCompany = kAction(CLEAR_REQUESTED_MANAGEMENT_COMPANY);

export const CLEAR_REQUESTED_INV_MANAGEMENT_COMPANY = `${name}/CLEAR_REQUESTED_INV_MANAGEMENT_COMPANY`;
export const clearRequestedINVManagementCompany = kAction(CLEAR_REQUESTED_INV_MANAGEMENT_COMPANY);
