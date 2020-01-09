import * as UsersActions from './actions';
import { ADD_TAB, REMOVE_TAB, SET_TAB_ACTIVE, SET_ALL_TABS } from './actions';
import { UsersState } from './model';
import * as _ from 'lodash';
import { immutableHelper } from '@setl/utils';
import { Action } from 'redux';

const initialState: UsersState = {
    usersList: [],
    totalRecords: 0,
    openedTabs: [],
};

export const usersReducer = function (state: UsersState = initialState, action: Action) {

    /* Set local variables */
    const usersData = _.get(action, 'payload[1].Data', []);
    let newState: UsersState;
    let usersList;

    switch (action.type) {
    case UsersActions.SET_ADMIN_USERLIST:
        /* Save totalRecords to Redux if exists... */
        if (usersData[0].hasOwnProperty('totalRecords')) {
            newState = Object.assign({}, state, { totalRecords: usersData[0].totalRecords });
        } else {
            /* ... it doesn't, so merge the new userList into existing state */
            usersList = Object.assign({}, state.usersList, formatUserList(usersData));
            newState = Object.assign({}, state, { usersList });
        }
        return newState;

    case UsersActions.UPDATE_ADMIN_USERLIST:
        /* Tidy data, merge with existing state and assign to new object */
        delete usersData[0].Status;
        delete usersData[0].Message;
        usersList = Object.assign({}, state.usersList, formatUserList(usersData));
        /* Assign differences to the current state */
        newState = Object.assign({}, state, { usersList });
        return newState;

    case UsersActions.DELETE_FROM_ADMIN_USERLIST:
        /* Assign state to new object and remove deleted user from usersList */
        newState = JSON.parse(JSON.stringify(state));
        delete newState.usersList[usersData[0].userID];
        return newState;

    case ADD_TAB:
        return handleAddTab(action, state);

    case REMOVE_TAB:
        return handleRemoveTab(action, state);

    case SET_TAB_ACTIVE:
        return handleSetTabActive(action, state);

    case SET_ALL_TABS:
        return handleSetAllTabs(action, state);

    default:
        return state;
    }
};

/**
 * Format User List
 * A helper to format the raw user array given by the socket server.
 *
 * @param {rawResponse} array - The raw array given.
 *
 * @return {newStructure} object - The object of users by ID.
 */
function formatUserList(rawResponse: any[]): {} {

    /* Lets define the new structure, an object. */
    const newStructure = {};

    /* We'll loop over the array and make it so each key is a user ID in the new
     object, the value will be the user's data as an object. */
    let i: number;
    for (i = 0; i < rawResponse.length; i += 1) {
        newStructure[rawResponse[i].userID] = rawResponse[i];
    }

    /* Lastly, return. */
    return newStructure;
}

/**
 * Handle add user tab action.
 *
 * @param {Action} action
 * @param {UsersState} state
 * @return {UsersState}
 */
function handleAddTab(action: Action, state: UsersState): UsersState {
    const newTab = immutableHelper.get(action, 'tab', null);

    if (_.isNull(newTab)) {
        throw new Error('Passing "null" into handleAddTab, you don\'t want to do that.');
    }

    const currentOpenTabs = immutableHelper.get(state, 'openedTabs', false);
    if (!currentOpenTabs) {
        throw new Error('openTabs property does not exist.');
    }

    const newOpenedTabs = immutableHelper.pushToList(currentOpenTabs, newTab);

    return Object.assign({}, state, {
        openTabs: newOpenedTabs,
    });

}

/**
 * Handle remove user tab action.
 *
 * @param {Action} action
 * @param {UsersState} state
 * @return {UsersState}
 */
function handleRemoveTab(action: Action, state: UsersState): UsersState {
    const tabId = immutableHelper.get(action, 'tabId', null);

    if (_.isNull(tabId)) {
        throw new Error('Passing "null" into handleRemoveTab, you don\'t want to do that.');
    }

    const currentOpenTabs = immutableHelper.get(state, 'openedTabs', false);
    if (!currentOpenTabs) {
        throw new Error('openTabs property does not exist.');
    }

    const newOpenedTabs = immutableHelper.removeFromList(currentOpenTabs, tabId);

    return Object.assign({}, state, {
        openTabs: newOpenedTabs,
    });

}

/**
 * Handle remove user tab action.
 *
 * @param {Action} action
 * @param {UsersState} state
 * @return {UsersState}
 */
function handleSetTabActive(action: Action, state: UsersState): UsersState {
    const tabId = immutableHelper.get(action, 'tabId', null);

    if (_.isNull(tabId)) {
        throw new Error('Passing "null" into handleSetTabActive, you don\'t want to do that.');
    }

    const currentOpenTabs = immutableHelper.get(state, 'openedTabs', false);
    if (!currentOpenTabs) {
        throw new Error('openTabs property does not exist.');
    }

    const newOpenedTabs = immutableHelper.updateInList(currentOpenTabs, [tabId, 'active'], (value) => {
        return true;
    });

    return Object.assign({}, state, {
        openTabs: newOpenedTabs,
    });

}

/**
 * Set all tabs
 *
 * @param {Action} action
 * @param {UsersState} state
 * @return {UsersState}
 */
function handleSetAllTabs(action: Action, state: UsersState): UsersState {
    const tabs = immutableHelper.get(action, 'tabs', []);

    return Object.assign({}, state, { openedTabs: tabs });
}
