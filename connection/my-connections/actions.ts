import { name } from './__init__';
import { kAction } from '@setl/utils/common';

export const GET_CONNECTIONS = `${name}/GET_CONNECTIONS`;
export const getConnections = kAction(GET_CONNECTIONS);

export const CREATE_CONNECTION = `${name}/CREATE_CONNECTION`;
export const createConnection = kAction(CREATE_CONNECTION);
