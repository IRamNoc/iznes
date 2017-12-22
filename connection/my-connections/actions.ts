import {name} from './__init__';
import {kAction} from '@setl/utils/common';

export const SET_CONNECTIONS_LIST = `${name}/SET_CONNECTIONS_LIST`;
export const SET_REQUESTED_CONNECTIONS = `${name}/SET_REQUESTED_CONNECTIONS`;
export const CLEAR_REQUESTED_CONNECTIONS = `${name}/CLEAR_REQUESTED_CONNECTIONS`;

export const setConnectionsList = kAction(SET_CONNECTIONS_LIST);
export const setRequestedConnections = kAction(SET_REQUESTED_CONNECTIONS);
export const clearRequestedConnections = kAction(CLEAR_REQUESTED_CONNECTIONS);
