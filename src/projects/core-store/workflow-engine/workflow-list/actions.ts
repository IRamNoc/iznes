import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';

/**
 *  Set manage nav list
 */
export const SET_WORKFLOW_LIST = `${name}/SET_WORKFLOW_LIST`;

/**
 * Set (Set to true) request manage nav list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_WORKFLOW_LIST = `${name}/SET_REQUESTED_WORKFLOW_LIST`;
export const setRequestedWorkflowList = kAction(SET_REQUESTED_WORKFLOW_LIST);

/**
 * Clear (set to false) request manage nav list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_WORKFLOW_LIST = `${name}/CLEAR_REQUESTED_WORKFLOW_LIST`;
export const clearRequestedWorkflowList = kAction(CLEAR_REQUESTED_WORKFLOW_LIST);

