import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Action, ActionCreator} from 'redux';

/**
 * Set the centralisation list.
 */
export const OFI_SET_CENTRALIZATION_REPORTS_LIST = `${name}/OFI_SET_CENTRALIZATION_REPORTS_LIST`;
export const OFI_SET_BASE_CENTRALIZATION_HISTORY = `${name}/OFI_SET_BASE_CENTRALIZATION_HISTORY`;
export const OFI_SET_CENTRALIZATION_HISTORY = `${name}/OFI_SET_CENTRALIZATION_HISTORY`;

/**
 * Set (Set to true) request Centralisation Reports list state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_CENTRALIZATION_REPORTS = `${name}/OFI_SET_REQUESTED_CENTRALIZATION_REPORTS`;
export const ofiSetRequestedCentralisationHistoryReports = kAction(OFI_SET_REQUESTED_CENTRALIZATION_REPORTS);

/**
 * Clear (set to false) request CentralisationReports list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const OFI_CLEAR_REQUESTED_CENTRALIZATION_REPORTS = `${name}/OFI_CLEAR_REQUESTED_CENTRALIZATION_REPORTS`;
export const ofiClearRequestedCentralisationHistoryReports = kAction(OFI_CLEAR_REQUESTED_CENTRALIZATION_REPORTS);