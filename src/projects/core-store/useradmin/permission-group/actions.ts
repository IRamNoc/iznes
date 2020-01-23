import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {PermissionGroupTab} from './model';

/**
 * Set administrative permissions group list
 */
export const SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST = `${name}/SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST`;

/**
 * Set transactional permissions group list
 */
export const SET_TRANSACTIONAL_PERMISSION_GROUP_LIST = `${name}/SET_TRANSACTIONAL_PERMISSION_GROUP_LIST`;

/**
 * Set transactional permissions group list
 */
export const SET_MENU_PERMISSION_GROUP_LIST = `${name}/SET_MENU_PERMISSION_GROUP_LIST`;

// update tabs
export const SET_ALL_TABS = `${name}/SET_ALL_TABS`;

export interface SetAllTab extends Action {
    tabs: Array<PermissionGroupTab>;
}

export const setAllTabs: ActionCreator<SetAllTab> = (tabs: Array<PermissionGroupTab>) => (
    {
        type: SET_ALL_TABS,
        tabs
    }
);
