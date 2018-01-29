import * as UsersActions from './actions';
import {ADD_TAB, REMOVE_TAB, SET_TAB_ACTIVE, SET_ALL_TABS} from './actions';
import {UsersState, UsersDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';
import {immutableHelper} from '@setl/utils';
import {Action} from 'redux';

const initialState: UsersState = {
    usersList: [],
    openedTabs: []
};

export const UsersReducer = function (state: UsersState = initialState,
                                      action: Action) {

    /* Local stuff. */
    const usersData = _.get(action, 'payload[1].Data', []);
    let newState: UsersState;

    switch (action.type) {
        case UsersActions.SET_ADMIN_USERLIST:
            /* We'll use a function to tidy the data up. */
            const usersList = formatUserList(usersData);

            /* Let's now assign differences to the current state. */
            newState = Object.assign({}, state, {
                usersList
            });

            /* And finally return the new state. */
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
function formatUserList(rawResponse: Array<any>): {} {

    /* Lets define the new structure, an object. */
    const newStructure = {};

    /* We'll loop over the array and make it so each key is a user ID in the new
     object, the value will be the user's data as an object. */
    let i: number;
    for (i = 0; i < rawResponse.length; i++) {
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
        openTabs: newOpenedTabs
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
        openTabs: newOpenedTabs
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
        openTabs: newOpenedTabs
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

    return Object.assign({}, state, {openedTabs: tabs});
}
