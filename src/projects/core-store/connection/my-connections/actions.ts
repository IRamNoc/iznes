import {name} from './__init__';
import {kAction} from '@setl/utils/common';

export const SET_FROM_CONNECTION_LIST = `${name}/SET_FROM_CONNECTION_LIST`;
export const SET_TO_CONNECTION_LIST = `${name}/SET_TO_CONNECTION_LIST`;
export const SET_REQUESTED_FROM_CONNECTIONS = `${name}/SET_REQUESTED_FROM_CONNECTIONS`;
export const CLEAR_REQUESTED_FROM_CONNECTIONS = `${name}/CLEAR_REQUESTED_FROM_CONNECTIONS`;
export const SET_REQUESTED_TO_CONNECTIONS = `${name}/SET_REQUESTED_TO_CONNECTIONS`;
export const CLEAR_REQUESTED_TO_CONNECTIONS = `${name}/CLEAR_REQUESTED_TO_CONNECTIONS`;

export const setFromConnectionList = kAction(SET_FROM_CONNECTION_LIST);
export const setToConnectionList = kAction(SET_TO_CONNECTION_LIST);
export const setRequestedFromConnections = kAction(SET_REQUESTED_FROM_CONNECTIONS);
export const clearRequestedFromConnections = kAction(CLEAR_REQUESTED_FROM_CONNECTIONS);
export const setRequestedToConnections = kAction(SET_REQUESTED_TO_CONNECTIONS);
export const clearRequestedToConnections = kAction(CLEAR_REQUESTED_TO_CONNECTIONS);
