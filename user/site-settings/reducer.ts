import {SET_LANGUAGE, SET_MENU_SHOWN} from './actions';
import {SiteSettingsState} from './model';
import _ from 'lodash';

const initialState: SiteSettingsState = {
    language: 'fra',
    menuShown: true
};

export const SiteSettingsReducer = function (state: SiteSettingsState = initialState, action) {

    switch (action.type) {
        case SET_LANGUAGE:
            return setLanguage(SET_LANGUAGE, action, state);
        case SET_MENU_SHOWN:
            return setMenuShown(SET_MENU_SHOWN, action, state);
        default:
            return state;
    }
};

/**
 * Set Message List
 *
 * @param actionType
 * @param action
 * @param state
 * @returns {any}
 */
function setLanguage(actionType, action, state) {
    let newState;

    const language = _.get(action, 'language', []);

    newState = Object.assign({}, state, {
        language
    });

    return newState;
};

function setMenuShown(actionType, action, state) {
    let newState;

    const menuShown = _.get(action, 'menuShown', []);

    newState = Object.assign({}, state, {
        menuShown
    });

    return newState;
};
