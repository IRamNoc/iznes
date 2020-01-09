import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';
import {Action, ActionCreator} from 'redux';
import {UserTab} from './model';

/**
 * Handle users list
 */
export const SET_ADMIN_USERLIST = `${name}/SET_ADMIN_USERLIST`;
export const UPDATE_ADMIN_USERLIST = `${name}/UPDATE_ADMIN_USERLIST`;
export const DELETE_FROM_ADMIN_USERLIST = `${name}/DELETE_FROM_ADMIN_USERLIST`;

// Add tab action
export const ADD_TAB = `${name}/ADD_TAB`;

export interface AddTab extends Action {
    tab: UserTab;
}

export const addTab: ActionCreator<AddTab> = (tab: UserTab) => (
    { type: ADD_TAB, tab }
);

// remove tab action
export const REMOVE_TAB = `${name}/REMOVE_TAB`;

export interface RemoveTab extends Action {
    tabId: number;
}

export const removeTab: ActionCreator<RemoveTab> = (tabId: number) => (
    {
        type: ADD_TAB,
        tabId
    }
);

// set tab active
export const SET_TAB_ACTIVE = `${name}/SET_TAB_ACTIVE`;

export interface SetTabActive extends Action {
    tabId: number;
}

export const setTabActive: ActionCreator<SetTabActive> = (tabId: number) => (
    {
        type: ADD_TAB,
        tabId
    }
);

// update tabs
export const SET_ALL_TABS = `${name}/SET_ALL_TABS`;

export interface UsersSetAllTab extends Action {
    tabs: Array<UserTab>;
}

export const setAllTabs: ActionCreator<UsersSetAllTab> = (tabs: Array<UserTab>) => (
    {
        type: SET_ALL_TABS,
        tabs
    }
);
